import React, { useState } from 'react';
import { useCredibee } from '../../hooks/useCredibee';
import Card from '../common/Card';
import { useTranslation } from '../../utils/localization';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex">
        {[...Array(5)].map((_, index) => (
            <svg key={index} className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const Feedback: React.FC = () => {
    const { state } = useCredibee();
    const t = useTranslation();
    const { user, feedback, invoices } = state;
    const [linkCopied, setLinkCopied] = useState(false);
    
    const publicProfileUrl = `${window.location.origin}/#/public/${user.id}`;
    
    // Calculate feedback statistics
    const totalFeedback = feedback.length;
    const averageRating = totalFeedback > 0 
        ? (feedback.reduce((sum, fb) => sum + fb.rating, 0) / totalFeedback).toFixed(1)
        : '0';
    const sentInvoices = invoices.filter(inv => ['Sent', 'Overdue', 'Paid'].includes(inv.status));
    const feedbackFromInvoices = feedback.filter(fb => fb.invoiceId);
    
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: feedback.filter(fb => fb.rating === rating).length,
        percentage: totalFeedback > 0 ? (feedback.filter(fb => fb.rating === rating).length / totalFeedback) * 100 : 0
    }));

    const handleCopyLink = () => {
        navigator.clipboard.writeText(publicProfileUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Feedback Collection Instructions */}
            <Card title="📝 How Clients Leave Feedback">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">✅ Secure Client Feedback System</h3>
                    <div className="space-y-3 text-sm text-blue-700">
                        <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                            <p>Only clients with invoices can leave feedback</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                            <p>Clients access the feedback form through their invoice pages</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                            <p>Each client can only leave one feedback per invoice</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                            <p>Feedback automatically appears on your public profile</p>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-600">{sentInvoices.length}</div>
                        <div className="text-sm text-green-700">Invoices Sent</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">{feedbackFromInvoices.length}</div>
                        <div className="text-sm text-blue-700">Client Feedback</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-600">
                            {sentInvoices.length > 0 ? Math.round((feedbackFromInvoices.length / sentInvoices.length) * 100) : 0}%
                        </div>
                        <div className="text-sm text-purple-700">Response Rate</div>
                    </div>
                </div>

                <div className="text-center text-slate-600">
                    <p className="mb-2">💡 <strong>Tip:</strong> Follow up with clients after project completion to encourage feedback!</p>
                </div>
            </Card>

            {/* Public Profile Sharing */}
            <Card title="🌐 Share Your Public Profile">
                <p className="text-slate-600 mb-4">Share your professional profile to showcase your work and collect testimonials</p>
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input 
                        type="text" 
                        readOnly 
                        value={publicProfileUrl} 
                        className="flex-grow bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-slate-700" 
                    />
                    <button 
                        onClick={handleCopyLink} 
                        className="bg-credibee-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-credibee-primary-800 transition-colors"
                    >
                        {linkCopied ? t('copied') : t('copyLink')}
                    </button>
                </div>
                <div className="flex gap-2">
                    <a 
                        href={publicProfileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-300 transition-colors"
                    >
                        👁️ Preview Profile
                    </a>
                </div>
            </Card>

            {/* Feedback Analytics */}
            {totalFeedback > 0 && (
                <Card title="📊 Feedback Analytics">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Rating Overview */}
                        <div>
                            <div className="text-center mb-4">
                                <div className="text-3xl font-bold text-slate-800">{averageRating}</div>
                                <StarRating rating={Math.round(parseFloat(averageRating))} />
                                <div className="text-sm text-slate-600 mt-1">Based on {totalFeedback} reviews</div>
                            </div>
                        </div>
                        
                        {/* Rating Distribution */}
                        <div>
                            <h4 className="font-semibold text-slate-700 mb-3">Rating Breakdown</h4>
                            <div className="space-y-2">
                                {ratingDistribution.map(({ rating, count, percentage }) => (
                                    <div key={rating} className="flex items-center gap-3">
                                        <span className="text-sm font-medium w-8">{rating}★</span>
                                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                                            <div 
                                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-slate-600 w-8">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Recent Testimonials */}
            <Card title={`💬 Client Testimonials (${totalFeedback})`}>
                <div className="space-y-6">
                    {feedback.length > 0 ? feedback.map(fb => (
                        <div key={fb.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                           <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-semibold text-slate-800">{fb.clientName}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-slate-500">{new Date(fb.date).toLocaleDateString()}</p>
                                        {fb.invoiceId && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                ✓ Verified Client
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <StarRating rating={fb.rating} />
                           </div>
                           <p className="text-slate-600 italic">"{fb.comment}"</p>
                        </div>
                    )) : (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">🌟</div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Feedback Yet</h3>
                            <p className="text-slate-600 mb-4">Start collecting testimonials from your clients!</p>
                            <div className="text-sm text-slate-500">
                                <p>💡 Tips to get more feedback:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-left max-w-md mx-auto">
                                    <li>Send professional invoices to all clients</li>
                                    <li>Follow up after project completion</li>
                                    <li>Provide exceptional service</li>
                                    <li>Ask satisfied clients to leave reviews</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Feedback;
