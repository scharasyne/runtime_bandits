
import React, { useState } from 'react';
import { useCredibee } from '../../hooks/useCredibee';
import Card from '../common/Card';

const Profile: React.FC = () => {
    const { state, dispatch } = useCredibee();
    const [user, setUser] = useState(state.user);
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'UPDATE_USER', payload: user });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <Card title="My Profile">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex items-center space-x-6">
                    <img src={user.businessLogoUrl || user.avatarUrl} alt="Business Logo or Avatar" className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-md" />
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                        <p className="text-slate-500">{user.email}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={user.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-credibee-blue-500 focus:border-credibee-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={user.email}
                                onChange={handleChange}
                                 className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-credibee-blue-500 focus:border-credibee-blue-500 sm:text-sm bg-slate-50"
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                 <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Business Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-slate-700">Business Name</label>
                            <input
                                type="text"
                                name="businessName"
                                id="businessName"
                                value={user.businessName}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-credibee-blue-500 focus:border-credibee-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="tin" className="block text-sm font-medium text-slate-700">TIN (Taxpayer Identification Number)</label>
                            <input
                                type="text"
                                name="tin"
                                id="tin"
                                value={user.tin || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-credibee-blue-500 focus:border-credibee-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="businessAddress" className="block text-sm font-medium text-slate-700">Business Address</label>
                            <textarea
                                name="businessAddress"
                                id="businessAddress"
                                value={user.businessAddress || ''}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-credibee-blue-500 focus:border-credibee-blue-500 sm:text-sm"
                            />
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="businessLogoUrl" className="block text-sm font-medium text-slate-700">Business Logo URL</label>
                            <input
                                type="text"
                                name="businessLogoUrl"
                                id="businessLogoUrl"
                                value={user.businessLogoUrl || ''}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-credibee-blue-500 focus:border-credibee-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center pt-4 border-t">
                    {isSaved && <span className="text-green-600 mr-4">Saved successfully!</span>}
                    <button type="submit" className="bg-credibee-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-credibee-blue-800 transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default Profile;