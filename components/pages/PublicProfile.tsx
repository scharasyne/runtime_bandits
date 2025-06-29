import React from 'react';
import { useCredibee } from '../../hooks/useCredibee';
import Card from '../common/Card';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex">
        {[...Array(5)].map((_, index) => (
            <svg 
                key={index} 
                className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-slate-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const PublicProfile: React.FC = () => {
    const { state } = useCredibee();
    const { user, feedback, invoices, receipts } = state;

    // Calculate business statistics
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const averageRating = feedback.length > 0 
        ? (feedback.reduce((sum, fb) => sum + fb.rating, 0) / feedback.length).toFixed(1)
        : '0';
    const totalClients = new Set(invoices.map(inv => inv.clientName)).size;
    const completedProjects = invoices.filter(inv => inv.status === 'paid').length;

    const businessHighlights = [
        {
            icon: '📊',
            label: 'Total Projects',
            value: totalInvoices.toString(),
            color: 'text-credibee-primary-600'
        },
        {
            icon: '⭐',
            label: 'Average Rating',
            value: averageRating,
            color: 'text-credibee-accent-600'
        },
        {
            icon: '👥',
            label: 'Happy Clients',
            value: totalClients.toString(),
            color: 'text-credibee-primary-700'
        }
    ];


    
    return (
        <div className="bg-gradient-to-br from-credibee-primary-50 to-credibee-accent-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-credibee-primary-600 to-credibee-accent-600 text-white py-16">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <img 
                        src={user.avatarUrl} 
                        alt="Business Owner" 
                        className="h-32 w-32 rounded-full object-cover mx-auto mb-6 ring-4 ring-white/30" 
                    />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{user.businessName}</h1>
                    <p className="text-xl mb-2 text-credibee-primary-100">Led by {user.name}</p>
                    <p className="text-lg text-credibee-primary-100 max-w-2xl mx-auto">
                        Professional business services with a proven track record of excellence and client satisfaction
                    </p>
                    <div className="mt-8 flex justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                            <div className="flex items-center gap-3">
                                <StarRating rating={Math.round(parseFloat(averageRating))} />
                                <span className="text-lg font-semibold">{averageRating}/5</span>
                                <span className="text-credibee-primary-100">({feedback.length} reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Business Highlights */}
            <div className="py-12">
                <div className="container mx-auto max-w-6xl px-4">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Business Highlights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {businessHighlights.map((highlight, index) => (
                            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                                <div className="text-3xl mb-3">{highlight.icon}</div>
                                <div className={`text-2xl font-bold ${highlight.color} mb-2`}>
                                    {highlight.value}
                                </div>
                                <div className="text-sm text-slate-600">{highlight.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>



            {/* Testimonials Section */}
            <div className="py-12 bg-credibee-primary-50">
                <div className="container mx-auto max-w-4xl px-4">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">What Our Clients Say</h2>
                    {feedback.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {feedback.slice(0, 4).map(fb => (
                                <Card key={fb.id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="font-semibold text-slate-800">{fb.clientName}</p>
                                            <p className="text-sm text-slate-500">{new Date(fb.date).toLocaleDateString()}</p>
                                        </div>
                                        <StarRating rating={fb.rating} />
                                    </div>
                                    <p className="text-slate-700 italic">"{fb.comment}"</p>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-12">
                            <div className="text-4xl mb-4">🌟</div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">Building Trust Through Excellence</h3>
                            <p className="text-slate-600">We're committed to delivering exceptional results for every client.</p>
                        </Card>
                    )}
                </div>
            </div>



            {/* Call to Action */}
            <div className="py-16 bg-gradient-to-r from-credibee-primary-600 to-credibee-accent-600 text-white">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Work Together?</h2>
                    <p className="text-xl mb-8 text-credibee-primary-100">
                        Let's discuss how we can help achieve your business goals
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href={`mailto:${user.email}`}
                            className="bg-white text-credibee-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-credibee-primary-50 transition-colors"
                        >
                            📧 Get in Touch
                        </a>
                        <a 
                            href={`tel:${user.phone}`}
                            className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
                        >
                            📞 Call Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;