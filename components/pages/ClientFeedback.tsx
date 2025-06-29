import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCredibee } from '../../hooks/useCredibee';
import Card from '../common/Card';

const StarRating: React.FC<{ rating: number, onRate?: (rating: number) => void, interactive?: boolean }> = ({ rating, onRate, interactive }) => (
    <div className="flex justify-center">
        {[...Array(5)].map((_, index) => (
            <svg 
                key={index} 
                onClick={() => interactive && onRate && onRate(index + 1)}
                className={`w-8 h-8 ${index < rating ? 'text-yellow-400' : 'text-slate-300'} ${interactive ? 'cursor-pointer hover:text-yellow-500' : ''} transition-colors`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const ClientFeedback: React.FC = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useCredibee();
    const { user, feedback, invoices } = state;

    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [validationError, setValidationError] = useState('');

    // Find the invoice to validate the client
    const invoice = invoices.find(inv => inv.id === invoiceId);
    
    // Check if feedback already exists for this invoice
    const existingFeedback = feedback.find(fb => fb.invoiceId === invoiceId);

    useEffect(() => {
        setIsValidating(true);
        
        if (!invoice) {
            setValidationError('Invoice not found. Please check the link and try again.');
            setIsValidating(false);
            return;
        }

        // Only allow feedback for sent, overdue, or paid invoices
        if (!['Sent', 'Overdue', 'Paid'].includes(invoice.status)) {
            setValidationError('Feedback can only be provided for processed invoices.');
            setIsValidating(false);
            return;
        }

        if (existingFeedback) {
            setValidationError('Feedback has already been provided for this invoice.');
            setIsValidating(false);
            return;
        }

        setIsValidating(false);
    }, [invoice, existingFeedback]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!invoice) return;
        
        if (newRating === 0) {
            alert('Please select a rating');
            return;
        }
        
        if (!newComment.trim()) {
            alert('Please write a comment');
            return;
        }

        dispatch({
            type: 'ADD_FEEDBACK',
            payload: {
                id: `fb-${Date.now()}`,
                clientName: invoice.clientName,
                rating: newRating,
                comment: newComment.trim(),
                date: new Date().toISOString(),
                invoiceId: invoiceId,
                isPublic: true,
                isVerified: true // Set to true since it's linked to an actual invoice
            }
        });
        
        setSubmitted(true);
    };

    const handleBackToInvoice = () => {
        if (invoice) {
            navigate(`/invoice/${invoice.id}`);
        }
    };

    if (isValidating) {
        return (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen py-12">
                <div className="container mx-auto max-w-2xl px-4">
                    <Card className="text-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-slate-600">Validating your access...</p>
                    </Card>
                </div>
            </div>
        );
    }

    if (validationError) {
        return (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen py-12">
                <div className="container mx-auto max-w-2xl px-4">
                    <Card className="text-center p-8">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Access Restricted</h2>
                        <p className="text-slate-600 mb-6">{validationError}</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Return to Home
                        </button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen py-12">
            <div className="container mx-auto max-w-2xl px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <img 
                        src={user.avatarUrl} 
                        alt="Business Owner" 
                        className="h-20 w-20 rounded-full object-cover mx-auto mb-4 ring-4 ring-white" 
                    />
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{user.businessName}</h1>
                    <p className="text-slate-600">Share your experience with us</p>
                </div>

                {/* Invoice Information */}
                <Card className="mb-6 bg-blue-50 border-blue-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-600">Invoice #{invoice?.invoiceNumber}</p>
                            <p className="font-semibold text-slate-800">{invoice?.clientName}</p>
                            <p className="text-sm text-slate-600">
                                {invoice?.issueDate && new Date(invoice.issueDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-600">Amount</p>
                            <p className="font-bold text-slate-800">
                                ₱{invoice && invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Feedback Form */}
                <Card>
                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-6">🎉</div>
                            <h3 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h3>
                            <p className="text-slate-600 mb-6">
                                Your feedback has been submitted successfully. We appreciate you taking the time to share your experience.
                            </p>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => navigate(`/public/${user.id}`)}
                                    className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    View Public Profile
                                </button>
                                <button 
                                    onClick={handleBackToInvoice}
                                    className="block w-full bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                                >
                                    Back to Invoice
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Leave Your Feedback</h2>
                                <p className="text-slate-600">
                                    Help others by sharing your experience working with {user.businessName}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-lg font-semibold text-slate-700 mb-4 text-center">
                                        How would you rate your experience?
                                    </label>
                                    <StarRating rating={newRating} onRate={setNewRating} interactive={true} />
                                    {newRating > 0 && (
                                        <p className="text-center mt-2 text-slate-600">
                                            {newRating === 1 && "Poor"}
                                            {newRating === 2 && "Fair"}
                                            {newRating === 3 && "Good"}
                                            {newRating === 4 && "Very Good"}
                                            {newRating === 5 && "Excellent"}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold text-slate-700 mb-3">
                                        Tell us about your experience
                                    </label>
                                    <textarea 
                                        value={newComment} 
                                        onChange={e => setNewComment(e.target.value)} 
                                        required 
                                        rows={5} 
                                        placeholder="What did you like about working with us? Any suggestions for improvement?"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <p className="text-sm text-slate-500 mt-2">
                                        {newComment.length}/500 characters
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={handleBackToInvoice}
                                        className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={newRating === 0 || !newComment.trim()}
                                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Submit Feedback
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </Card>

                {/* Existing Feedback Preview */}
                {existingFeedback && (
                    <Card className="mt-6 bg-green-50 border-green-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Your Previous Feedback</h3>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="font-semibold text-slate-800">{existingFeedback.clientName}</p>
                                <p className="text-sm text-slate-500">{new Date(existingFeedback.date).toLocaleDateString()}</p>
                            </div>
                            <StarRating rating={existingFeedback.rating} />
                        </div>
                        <p className="text-slate-700 italic">"{existingFeedback.comment}"</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ClientFeedback; 