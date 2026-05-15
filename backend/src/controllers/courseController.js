const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const { AppError } = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all published courses
exports.getCourses = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const query = { isPublished: true };

    if (req.query.category) query.category = req.query.category;
    if (req.query.level) query.level = req.query.level;
    if (req.query.language) query.language = req.query.language;
    if (req.query.isFree === 'true') query.isFree = true;
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
        if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }
    if (req.query.rating) query.averageRating = { $gte: parseFloat(req.query.rating) };

    if (req.query.search) {
        query.$or = [
            { title: { $regex: req.query.search, $options: 'i' } },
            { description: { $regex: req.query.search, $options: 'i' } },
            { tags: { $in: [new RegExp(req.query.search, 'i')] } },
        ];
    }

    let sort = '-createdAt';
    if (req.query.sort === 'popular') sort = '-totalStudents';
    if (req.query.sort === 'rating') sort = '-averageRating';
    if (req.query.sort === 'price-low') sort = 'price';
    if (req.query.sort === 'price-high') sort = '-price';
    if (req.query.sort === 'newest') sort = '-createdAt';

    const [courses, total] = await Promise.all([
        Course.find(query)
            .populate('instructor', 'name avatar headline')
            .select('-sections')
            .skip(skip)
            .limit(limit)
            .sort(sort),
        Course.countDocuments(query),
    ]);

    res.status(200).json({
        success: true,
        count: courses.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        courses,
    });
});

// @desc    Get single course
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findOne({ slug: req.params.slug, isPublished: true })
        .populate('instructor', 'name avatar bio headline totalStudents courses')
        .populate({
            path: 'sections.lessons.quiz',
            select: 'title timeLimit passingScore questions',
        });

    if (!course) return next(new AppError('Course not found', 404));

    let isEnrolled = false;
    let progress = null;
    if (req.user) {
        isEnrolled = req.user.enrolledCourses.some(
            (e) => e.course.toString() === course._id.toString()
        );
        if (isEnrolled) {
            progress = await Progress.findOne({ user: req.user.id, course: course._id });
        }
    }

    const courseData = course.toObject();
    if (!isEnrolled && (!req.user || req.user.role !== 'admin')) {
        courseData.sections = courseData.sections.map((section) => ({
            ...section,
            lessons: section.lessons.map((lesson) => ({
                ...lesson,
                video: lesson.isPreview ? lesson.video : undefined,
                content: lesson.isPreview ? lesson.content : undefined,
            })),
        }));
    }

    res.status(200).json({ success: true, course: courseData, isEnrolled, progress });
});

// @desc    Create course
exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.instructor = req.user.id;
    const course = await Course.create(req.body);

    if (course.type === 'test') {
        course.sections.push({
            title: 'Question Bank',
            description: 'Main section for exam questions',
            order: 0,
            lessons: []
        });
        await course.save();
    }

    await User.findByIdAndUpdate(req.user.id, { $push: { courses: course._id } });
    res.status(201).json({ success: true, course });
});

// @desc    Update course
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized to update this course', 403));
    }

    delete req.body.instructor;
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, course });
});

// @desc    Delete course
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized to delete this course', 403));
    }

    if (course.thumbnail && course.thumbnail.public_id) {
        await cloudinary.uploader.destroy(course.thumbnail.public_id);
    }

    await course.deleteOne();
    await User.findByIdAndUpdate(req.user.id, { $pull: { courses: course._id } });
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
});

// @desc    Upload course thumbnail
exports.uploadThumbnail = asyncHandler(async (req, res, next) => {
    if (!req.file) return next(new AppError('Please upload an image', 400));
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized', 403));
    }

    if (course.thumbnail && course.thumbnail.public_id) {
        await cloudinary.uploader.destroy(course.thumbnail.public_id);
    }

    course.thumbnail = { public_id: req.file.filename, url: req.file.path };
    await course.save();
    res.status(200).json({ success: true, thumbnail: course.thumbnail });
});

// @desc    Publish/Unpublish course
exports.togglePublish = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized', 403));
    }

    // 💡 THE FOOLPROOF FIX: Detect if it is a test via type OR examType
    const isExam = course.type === 'test' || (course.examType && course.examType !== 'None');

    if (!course.isPublished) {
        // Require thumbnail ONLY if it is a standard video course
        if (!isExam && (!course.thumbnail || !course.thumbnail.url)) {
            return next(new AppError('Please add a course thumbnail', 400));
        }

        if (course.sections.length === 0) {
            return next(new AppError('Please add at least one section', 400));
        }

        const hasLessons = course.sections.some((s) => s.lessons.length > 0);
        if (!hasLessons) {
            return next(new AppError(isExam ? 'Please add at least one question' : 'Please add at least one lesson', 400));
        }
    }

    course.isPublished = !course.isPublished;
    if (course.isPublished) course.publishedAt = Date.now();

    // Automatically fix the type in the database if it was broken
    if (isExam && course.type !== 'test') {
        course.type = 'test';
    }

    await course.save();

    res.status(200).json({
        success: true,
        message: course.isPublished ? 'Published successfully' : 'Unpublished successfully',
        isPublished: course.isPublished,
    });
});

// @desc    Add section to course
exports.addSection = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized', 403));
    }

    if (!req.body.title) {
        return next(new AppError('Please provide a section title', 400));
    }

    const section = {
        title: req.body.title,
        description: req.body.description,
        order: course.sections.length,
        lessons: [],
    };

    course.sections.push(section);
    await course.save();
    res.status(201).json({ success: true, section: course.sections[course.sections.length - 1] });
});

// @desc    Update section
exports.updateSection = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized', 403));
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) return next(new AppError('Section not found', 404));

    if (req.body.title) section.title = req.body.title;
    if (req.body.description !== undefined) section.description = req.body.description;
    if (req.body.order !== undefined) section.order = req.body.order;

    await course.save();
    res.status(200).json({ success: true, section });
});

// @desc    Delete section
exports.deleteSection = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized', 403));
    }

    course.sections = course.sections.filter(
        (s) => s._id.toString() !== req.params.sectionId
    );
    await course.save();
    res.status(200).json({ success: true, message: 'Section deleted' });
});

// @desc    Add lesson to section
exports.addLesson = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized', 403));
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) return next(new AppError('Section not found', 404));

    const lesson = {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type || 'video',
        content: req.body.content,
        isPreview: req.body.isPreview || false,
        order: section.lessons.length,
        duration: req.body.duration || 0,
    };

    section.lessons.push(lesson);
    await course.save();

    res.status(201).json({
        success: true,
        lesson: section.lessons[section.lessons.length - 1],
    });
});

// @desc    Upload lesson video
exports.uploadLessonVideo = asyncHandler(async (req, res, next) => {
    if (!req.file) return next(new AppError('Please upload a video', 400));
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized', 403));
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) return next(new AppError('Section not found', 404));

    const lesson = section.lessons.id(req.params.lessonId);
    if (!lesson) return next(new AppError('Lesson not found', 404));

    if (lesson.video && lesson.video.public_id) {
        await cloudinary.uploader.destroy(lesson.video.public_id, { resource_type: 'video' });
    }

    lesson.video = {
        public_id: req.file.filename,
        url: req.file.path,
        duration: req.body.duration || 0,
    };
    lesson.type = 'video';

    await course.save();
    res.status(200).json({ success: true, video: lesson.video });
});

// @desc    Update lesson
exports.updateLesson = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized to update this course', 403));
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) return next(new AppError('Section not found', 404));

    const lesson = section.lessons.id(req.params.lessonId);
    if (!lesson) return next(new AppError('Lesson not found', 404));

    const allowedUpdates = ['title', 'description', 'content', 'isPreview', 'order', 'duration', 'isPublished', 'options', 'correctOption'];
    allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) lesson[field] = req.body[field];
    });

    await course.save();
    res.status(200).json({ success: true, lesson });
});

// @desc    Delete lesson
exports.deleteLesson = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized', 403));
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) return next(new AppError('Section not found', 404));

    const lesson = section.lessons.id(req.params.lessonId);
    if (lesson && lesson.video && lesson.video.public_id) {
        await cloudinary.uploader.destroy(lesson.video.public_id, { resource_type: 'video' });
    }

    section.lessons = section.lessons.filter(
        (l) => l._id.toString() !== req.params.lessonId
    );
    await course.save();
    res.status(200).json({ success: true, message: 'Lesson deleted' });
});

// @desc    Get instructor's courses
exports.getInstructorCourses = asyncHandler(async (req, res, next) => {
    const courses = await Course.find({ instructor: req.user.id })
        .select('title thumbnail totalStudents averageRating totalReviews isPublished price createdAt totalLessons')
        .sort('-createdAt');
    res.status(200).json({ success: true, count: courses.length, courses });
});

// @desc    Get featured courses
exports.getFeaturedCourses = asyncHandler(async (req, res, next) => {
    const courses = await Course.find({ isPublished: true, isFeatured: true })
        .populate('instructor', 'name avatar')
        .select('-sections')
        .limit(8)
        .sort('-totalStudents');
    res.status(200).json({ success: true, courses });
});

// @desc    Get course categories with counts
exports.getCategories = asyncHandler(async (req, res, next) => {
    const categories = await Course.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);
    res.status(200).json({ success: true, categories });
});

// @desc    Approve/Reject course (Admin)
exports.approveCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) return next(new AppError('Course not found', 404));

    course.isApproved = req.body.approved;
    course.approvedAt = req.body.approved ? Date.now() : undefined;
    course.approvedBy = req.user.id;

    if (!req.body.approved) {
        course.isPublished = false;
    }

    await course.save();

    await Notification.create({
        recipient: course.instructor._id,
        type: req.body.approved ? 'course_approved' : 'course_rejected',
        title: req.body.approved ? 'Course Approved!' : 'Course Rejected',
        message: req.body.approved
            ? `Your course "${course.title}" has been approved and is now live.`
            : `Your course "${course.title}" was rejected. Reason: ${req.body.reason || 'No reason provided'}`,
        link: `/instructor/courses/${course._id}`,
    });

    res.status(200).json({ success: true, course });
});

// @desc    Get all sections for a course
exports.getSections = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).select('sections');

    if (!course) return next(new AppError('Course not found', 404));

    res.status(200).json({
        success: true,
        count: course.sections.length,
        sections: course.sections
    });
});