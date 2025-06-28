
import React, { useState } from 'react';
import { useCredibee } from '../../hooks/useCredibee';
import Card from '../common/Card';

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
    const { user, feedback } = state;
    const [linkCopied, setLinkCopied] = useState(false);
    
    const publicProfileUrl = `${window.location.origin}${window.location.pathname}#/public/${user.id}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(publicProfileUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <Card title="Collect Feedback">
                <p className="text-slate-600 mb-4">Share your public profile link with clients to collect ratings and testimonials.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input type="text" readOnly value={publicProfileUrl} className="flex-grow bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-slate-700" />
                    <button onClick={handleCopyLink} className="bg-credibee-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-credibee-blue-800 transition-colors">
                        {linkCopied ? 'Copied!' : 'Copy Link'}
                    </button>
                </div>
            </Card>

            <Card title="Client Testimonials">
                <div className="space-y-6">
                    {feedback.length > 0 ? feedback.map(fb => (
                        <div key={fb.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                           <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-slate-800">{fb.clientName}</p>
                                    <p className="text-xs text-slate-500">{new Date(fb.date).toLocaleDateString()}</p>
                                </div>
                                <StarRating rating={fb.rating} />
                           </div>
                           <p className="text-slate-600 mt-3 italic">"{fb.comment}"</p>
                        </div>
                    )) : (
                        <p className="text-center text-slate-500 py-8">No feedback yet. Share your link to get started!</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Feedback;
