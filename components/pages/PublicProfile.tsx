
import React from 'react';
import { useCredibee } from '../../hooks/useCredibee';
import Card from '../common/Card';

const StarRating: React.FC<{ rating: number, onRate?: (rating: number) => void, interactive?: boolean }> = ({ rating, onRate, interactive }) => (
    <div className="flex">
        {[...Array(5)].map((_, index) => (
            <svg 
                key={index} 
                onClick={() => interactive && onRate && onRate(index + 1)}
                className={`w-6 h-6 ${index < rating ? 'text-yellow-400' : 'text-slate-300'} ${interactive ? 'cursor-pointer' : ''}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);


const PublicProfile: React.FC = () => {
    // In a real app, this would fetch data based on `userId` from useParams.
    // For this MVP, we'll just use the context data as a stand-in.
    const { state, dispatch } = useCredibee();
    const { user, feedback } = state;

    const [newRating, setNewRating] = React.useState(0);
    const [newComment, setNewComment] = React.useState('');
    const [clientName, setClientName] = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating > 0 && newComment && clientName) {
            dispatch({
                type: 'ADD_FEEDBACK',
                payload: {
                    id: `fb-${Date.now()}`,
                    clientName,
                    rating: newRating,
                    comment: newComment,
                    date: new Date().toISOString()
                }
            });
            setSubmitted(true);
        }
    };
    
    return (
        <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
            <div className="container mx-auto max-w-2xl px-4">
                <div className="text-center mb-8">
                     <img src={user.avatarUrl} alt="User Avatar" className="h-24 w-24 rounded-full object-cover mx-auto mb-4" />
                     <h1 className="text-3xl font-bold text-slate-800">{user.businessName}</h1>
                     <p className="text-slate-500">Operated by {user.name}</p>
                </div>
                
                <Card title="Leave Feedback">
                    {submitted ? (
                        <div className="text-center py-8">
                            <h3 className="text-xl font-semibold text-green-600">Thank you!</h3>
                            <p className="text-slate-600 mt-2">Your feedback has been submitted successfully.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-credibee-blue-500"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Your Rating</label>
                                <StarRating rating={newRating} onRate={setNewRating} interactive={true} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Your Review</label>
                                <textarea value={newComment} onChange={e => setNewComment(e.target.value)} required rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-credibee-blue-500"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-credibee-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-credibee-blue-800 transition-colors">
                                Submit Feedback
                            </button>
                        </form>
                    )}
                </Card>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">What Clients Are Saying</h2>
                     <div className="space-y-4">
                        {feedback.length > 0 ? feedback.map(fb => (
                            <div key={fb.id} className="p-4 border border-slate-200 rounded-lg bg-white">
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
                            <p className="text-center text-slate-500 py-8">Be the first to leave a review!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
