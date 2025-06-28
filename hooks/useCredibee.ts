
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useCredibee = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useCredibee must be used within an AppProvider');
    }
    return context;
};
