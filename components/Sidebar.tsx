import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.png';

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
const CreditCardIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);
const LogOutIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const navLinkClasses = "flex items-center px-3 py-2.5 text-slate-200 hover:bg-credibee-primary-800 rounded-lg transition-colors text-sm font-medium";
    const activeNavLinkClasses = "bg-credibee-primary-900 text-white";

    const navItems = [
        { to: '/', icon: HomeIcon, label: 'Dashboard' },
        { to: '/transactions', icon: CreditCardIcon, label: 'Transactions' },
        { to: '/invoices', icon: FileTextIcon, label: 'Invoices' },
        { to: '/receipts', icon: ReceiptIcon, label: 'Receipts' },
        { to: '/feedback', icon: StarIcon, label: 'Feedback' },
        { to: '/profile', icon: UserIcon, label: 'Profile' },
    ];

    const handleNavItemClick = () => {
        // Close sidebar on mobile when nav item is clicked
        if (window.innerWidth < 1024) { // lg breakpoint
            setSidebarOpen(false);
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-credibee-primary-950 p-4 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col`}>
                <div className="flex items-center space-x-3 text-white px-2 mb-8">
                    <img src={logo} alt="Logo" className="h-8 w-8 object-contain"/>
                    <span className="text-2xl font-bold">Credibee</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map(item => (
                        <NavLink 
                            key={item.to} 
                            to={item.to} 
                            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} 
                            onClick={handleNavItemClick}
                            end
                        >
                            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                            <span className="truncate">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-credibee-primary-800">
                    <a href="#" className={navLinkClasses} onClick={handleNavItemClick}>
                        <LogOutIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span>Logout</span>
                    </a>
                </div>
            </div>
        </>
    );
};

export default Sidebar;