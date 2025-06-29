
import React from 'react';
import { useCredibee } from '../hooks/useCredibee';
import { useTranslation } from '../utils/localization';

const MenuIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

interface HeaderProps {
    setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
    const { state, dispatch } = useCredibee();
    const t = useTranslation();

    return (
        <header className="flex justify-between items-center p-4 bg-white border-b border-slate-200">
            {/* Mobile menu button */}
            <button
                className="text-slate-500 focus:outline-none lg:hidden"
                onClick={() => setSidebarOpen(true)}
            >
                <MenuIcon className="h-6 w-6" />
            </button>
            {/* Search (optional placeholder) */}
            <div className="flex-1 hidden md:block">
                 {/* Can add search bar here in the future */}
            </div>
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => dispatch({ type: 'TOGGLE_LANGUAGE' })}
                    className="text-sm font-medium text-slate-600 hover:text-credibee-primary-700 transition-colors"
                >
                    {state.language === 'en' ? 'Filipino' : 'English'}
                </button>
                <div className="flex items-center">
                    <span className="text-right mr-3 hidden sm:block">
                        <span className="block text-sm font-medium text-slate-700">{state.user.name}</span>
                        <span className="block text-xs text-slate-500">{state.user.businessName}</span>
                    </span>
                    <img className="h-10 w-10 rounded-full object-cover" src={state.user.avatarUrl} alt="User avatar" />
                </div>
            </div>
        </header>
    );
};

export default Header;
