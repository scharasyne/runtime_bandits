
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../utils/localization';

const HomeIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const FileTextIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);
const ReceiptIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 4v16"/></svg>
);
const StarIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const UserIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const LogOutIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

const BeeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.5,12.5c0,2-1,3.8-2.5,5.1l-2.6-1.5c1-1,1.6-2.4,1.6-3.6c0-1-0.4-2-1-2.8l-1.3-0.8V7.5c0-3-2.5-5.5-5.5-5.5S4.5,4.5,4.5,7.5v1.4L3.2,9.7C2.6,10.5,2.2,11.5,2.2,12.5c0,1.2,0.6,2.6,1.6,3.6L1,17.6C-0.5,16.3-1.5,14.5-1.5,12.5c0-2.3,1.2-4.4,3.1-5.7L3.1,5.1C4,3.3,5.9,2,8,2h8c2.1,0,4,1.3,4.9,3.1l1.5,1.7C24.3,8.1,25.5,10.2,25.5,12.5h-4V12.5z M8,22c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S10.2,22,8,22z M16,22c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S18.2,22,16,22z"/>
    </svg>
);


interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const t = useTranslation();
    const navLinkClasses = "flex items-center px-4 py-2.5 text-slate-200 hover:bg-credibee-blue-800 rounded-lg transition-colors";
    const activeNavLinkClasses = "bg-credibee-blue-900";

    const navItems = [
        { to: '/', icon: HomeIcon, label: t('dashboard') },
        { to: '/invoices', icon: FileTextIcon, label: t('invoices') },
        { to: '/receipts', icon: ReceiptIcon, label: t('receipts') },
        { to: '/feedback', icon: StarIcon, label: t('feedback') },
        { to: '/profile', icon: UserIcon, label: t('profile') },
    ];

    return (
        <>
            {/* Mobile overlay */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-credibee-blue-950 p-4 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col`}>
                <div className="flex items-center space-x-3 text-white px-2 mb-8">
                    <BeeIcon className="h-8 w-8 text-yellow-300"/>
                    <span className="text-2xl font-bold">Credibee</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map(item => (
                        <NavLink key={item.to} to={item.to} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} end>
                            <item.icon className="h-5 w-5 mr-3" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto">
                    <a href="#" className={navLinkClasses}>
                        <LogOutIcon className="h-5 w-5 mr-3" />
                        <span>{t('logout')}</span>
                    </a>
                </div>
            </div>
        </>
    );
};

export default Sidebar;