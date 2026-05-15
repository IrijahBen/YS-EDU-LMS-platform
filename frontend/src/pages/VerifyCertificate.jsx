import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, CheckCircle, XCircle, Download } from 'lucide-react';
import { certificateService } from '../services/api';
import { formatDate } from '../lib/utils';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function VerifyCertificate() {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        certificateService.verifyCertificate(id)
            .then(({ data }) => setResult(data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full">
                <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm">
                    {result?.valid ? (
                        <>
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-heading font-bold mb-2 text-green-700">Certificate Verified ✓</h1>
                            <p className="text-muted-foreground mb-6">This is an official and valid YS Edu certificate.</p>

                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 rounded-xl p-6 text-left mb-6 shadow-inner">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-amber-100 p-2 rounded-lg">
                                        <Award className="w-8 h-8 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-gray-900 dark:text-white">Certificate of Completion</p>
                                        <p className="text-sm font-semibold text-[#0A3D62] dark:text-blue-400">YS Edu Platform</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm border-t border-amber-200/50 pt-4">
                                    <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-700 pb-2">
                                        <span className="text-muted-foreground">Student:</span>
                                        <span className="font-bold text-right">{result.certificate?.studentName || result.certificate?.user?.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-700 pb-2">
                                        <span className="text-muted-foreground">Course Details:</span>
                                        <span className="font-bold text-right max-w-[60%]">{result.certificate?.courseName || result.certificate?.course?.title}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-700 pb-2">
                                        <span className="text-muted-foreground">Instructor:</span>
                                        <span className="font-bold text-right">{result.certificate?.instructorName || result.certificate?.instructor?.name}</span>
                                    </div>

                                    <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-700 pb-2">
                                        <span className="text-muted-foreground">Final Score:</span>
                                        {/* 💡 Replaces "Completion" with "100%" */}
                                        <span className="font-black text-[#0A3D62] dark:text-blue-400">
                                            {result.certificate?.grade === 'Completion' ? '100%' : `${result.certificate?.grade}%`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-700 pb-2">
                                        <span className="text-muted-foreground">Issued Date:</span>
                                        <span className="font-bold text-right">{formatDate(result.certificate?.issuedAt)}</span>
                                    </div>
                                    <div className="flex justify-between pt-1 items-center">
                                        <span className="text-muted-foreground">Verification ID:</span>
                                        <span className="font-mono text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                                            {result.certificate?.verificationId}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {result.certificate?.pdfUrl && (
                                <a href={result.certificate.pdfUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#0A3D62] hover:bg-[#072a44] text-white font-bold rounded-xl transition-all shadow-md">
                                    <Download className="w-5 h-5" /> Download Official PDF
                                </a>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <XCircle className="w-10 h-10 text-red-600" />
                            </div>
                            <h1 className="text-2xl font-heading font-bold mb-2 text-red-700">Certificate Not Found</h1>
                            <p className="text-muted-foreground">
                                {result?.message || 'This certificate could not be verified. It may be invalid, revoked, or the ID is incorrect.'}
                            </p>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}