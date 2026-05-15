const mongoose = require('mongoose');
const slugify = require('slugify');

const lessonSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: String,
        type: { type: String, enum: ['video', 'text', 'quiz', 'resource', 'question'], default: 'video' },
        video: {
            public_id: String,
            url: String,
            duration: Number, // in seconds
            thumbnail: String,
        },
        content: String, // for text lessons
        options: {
            A: { type: String, default: '' },
            B: { type: String, default: '' },
            C: { type: String, default: '' },
            D: { type: String, default: '' }
        },
        correctOption: { type: String, default: 'A' },
        resources: [
            {
                name: String,
                url: String,
                public_id: String,
                type: String,
                size: Number,
            },
        ],
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
        order: { type: Number, default: 0 },
        isPreview: { type: Boolean, default: false },
        isPublished: { type: Boolean, default: false },
        duration: { type: Number, default: 0 }, // in seconds
    },
    { timestamps: true }
);

const sectionSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: String,
    order: { type: Number, default: 0 },
    lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
        slug: { type: String, unique: true },
        subtitle: { type: String, maxlength: 200 },
        description: { type: String },
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true
        },
        type: {
            type: String,
            enum: ['course', 'test'],
            default: 'course'
        },
        examType: {
            type: String,
            enum: ['UTME (JAMB)', 'WAEC', 'NECO', 'Post-UTME', 'General Practice', 'None'],
            default: 'None'
        },
        subcategory: String,
        tags: [String],
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
            default: 'All Levels',
        },
        language: { type: String, default: 'English' },
        thumbnail: {
            public_id: String,
            url: { type: String, default: '' },
        },
        previewVideo: {
            public_id: String,
            url: String,
            duration: Number,
        },
        price: { type: Number, default: 0, min: 0 },
        discountPrice: { type: Number, min: 0 },
        discountExpiry: Date,
        isFree: { type: Boolean, default: true },
        currency: { type: String, default: 'USD' },
        sections: [sectionSchema],
        duration: { type: Number, default: 0 },
        instructions: [String],
        totalDuration: { type: Number, default: 0 },
        totalLessons: { type: Number, default: 0 },
        totalStudents: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0, min: 0, max: 5 },
        requirements: [String],
        whatYouWillLearn: [String],
        targetAudience: [String],
        isPublished: { type: Boolean, default: false },
        publishedAt: Date,
        isFeatured: { type: Boolean, default: false },
        isApproved: { type: Boolean, default: false },
        approvedAt: Date,
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        hasCertificate: { type: Boolean, default: true },
        completionThreshold: { type: Number, default: 80 },
        metaTitle: String,
        metaDescription: String,
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

/**
 * THE FIX: 
 * We use an async function and REMOVE 'next'.
 * This prevents the TypeError "next is not a function".
 */
courseSchema.pre('save', async function () {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
    }

    let tDuration = 0;
    let tLessons = 0;

    if (this.sections && this.sections.length > 0) {
        this.sections.forEach((section) => {
            if (section.lessons && section.lessons.length > 0) {
                section.lessons.forEach((lesson) => {
                    tLessons++;
                    tDuration += (lesson.duration || 0);
                });
            }
        });
    }

    this.totalDuration = tDuration;
    this.totalLessons = tLessons;
});

courseSchema.virtual('effectivePrice').get(function () {
    if (this.isFree) return 0;
    if (this.discountPrice && this.discountExpiry && this.discountExpiry > Date.now()) {
        return this.discountPrice;
    }
    return this.price;
});

module.exports = mongoose.model('Course', courseSchema);