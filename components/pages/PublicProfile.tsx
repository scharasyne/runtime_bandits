import React from 'react';
import { useCredibee } from '../../hooks/useCredibee';
import Card from '../common/Card';

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ rating, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };
    
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <svg 
                    key={index} 
                    className={`${sizeClasses[size]} ${index < rating ? 'text-amber-400' : 'text-slate-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

const BusinessIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "w-8 h-8" }) => {
    const icons = {
        projects: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        rating: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        ),
        clients: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
        )
    };
    
    return icons[type] || icons.projects;
};

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
            iconType: 'projects',
            label: 'Total Projects',
            value: totalInvoices.toString(),
            description: 'Completed successfully',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            iconType: 'rating',
            label: 'Average Rating',
            value: averageRating,
            description: `From ${feedback.length} reviews`,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200'
        },
        {
            iconType: 'clients',
            label: 'Happy Clients',
            value: totalClients.toString(),
            description: 'Trusted partnerships',
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200'
        }
    ];


    
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 25px 25px, white 2px, transparent 0)',
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>
                
                <div className="relative container mx-auto max-w-6xl px-4 py-20 sm:py-24">
                    <div className="text-center">
                        <div className="mb-8">
                            <img 
                                src={user.avatarUrl || user.businessLogoUrl} 
                                alt={user.businessName} 
                                className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover mx-auto mb-6 ring-4 ring-white/20 shadow-xl" 
                            />
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                            {user.businessName}
                        </h1>
                        
                        <div className="mb-6 space-y-2">
                            <p className="text-lg sm:text-xl text-slate-200">
                                Led by <span className="font-semibold text-white">{user.name}</span>
                            </p>
                            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
                                Professional business services with a proven track record of excellence and client satisfaction
                            </p>
                        </div>

                        {feedback.length > 0 && (
                            <div className="mt-8 flex justify-center">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 border border-white/20">
                                    <div className="flex items-center justify-center gap-4">
                                        <StarRating rating={Math.round(parseFloat(averageRating))} size="lg" />
                                        <div className="text-left">
                                            <div className="text-2xl font-bold text-white">{averageRating}/5</div>
                                            <div className="text-sm text-slate-300">
                                                {feedback.length} review{feedback.length !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Business Highlights */}
            <div className="py-16 bg-white">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Why Choose Us
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Our track record speaks for itself through measurable results and satisfied clients
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {businessHighlights.map((highlight, index) => (
                            <div 
                                key={index} 
                                className={`group relative overflow-hidden rounded-2xl border-2 ${highlight.borderColor} ${highlight.bgColor} p-8 transition-all duration-300 hover:shadow-lg hover:scale-105`}
                            >
                                <div className="text-center">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${highlight.color} bg-white shadow-lg mb-6`}>
                                        <BusinessIcon type={highlight.iconType} className="w-8 h-8" />
                                    </div>
                                    
                                    <div className={`text-4xl font-bold ${highlight.color} mb-2`}>
                                        {highlight.value}
                                        {highlight.label.includes('Rating') && (
                                            <span className="text-2xl text-slate-500">/5</span>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                        {highlight.label}
                                    </h3>
                                    
                                    <p className="text-slate-600 text-sm">
                                        {highlight.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>



            {/* Testimonials Section */}
            <div className="py-16 bg-slate-50">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            What Our Clients Say
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Real feedback from real clients who've experienced our services
                        </p>
                    </div>

                    {feedback.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {feedback.slice(0, 4).map(fb => (
                                <div 
                                    key={fb.id} 
                                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300"
                                >
                                    <div className="mb-6">
                                        <StarRating rating={fb.rating} size="md" />
                                    </div>
                                    
                                    <blockquote className="text-slate-700 text-lg leading-relaxed mb-6">
                                        "{fb.comment}"
                                    </blockquote>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div>
                                            <div className="font-semibold text-slate-900">{fb.clientName}</div>
                                            <div className="text-sm text-slate-500">
                                                {new Date(fb.date).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-amber-500">{fb.rating}.0</div>
                                            <div className="text-xs text-slate-500">out of 5</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200 max-w-2xl mx-auto">
                            <div className="w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Building Trust Through Excellence</h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                We're committed to delivering exceptional results for every client. 
                                Your success is our success, and we work tirelessly to exceed expectations.
                            </p>
                        </div>
                    )}
                </div>
            </div>



            {/* Call to Action */}
            <div className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 25px 25px, white 2px, transparent 0)',
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>
                
                <div className="relative container mx-auto max-w-4xl px-4 text-center">
                    <div className="mb-8">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Work Together?</h2>
                        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Let's discuss how we can help achieve your business goals and bring your vision to life
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <a 
                            href={`mailto:${user.email}`}
                            className="group inline-flex items-center justify-center bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Get in Touch
                        </a>
                        
                        {user.phone && (
                            <a 
                                href={`tel:${user.phone}`}
                                className="group inline-flex items-center justify-center bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Call Now
                            </a>
                        )}
                    </div>

                    {user.businessAddress && (
                        <div className="mt-12 text-center">
                            <div className="inline-flex items-center text-slate-300 text-sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {user.businessAddress}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;