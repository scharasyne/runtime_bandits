
import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';
import { AppState, AppAction, User, Invoice, Receipt, ClientFeedback, InvoiceStatus, ReceiptCategory, PaymentMethod } from '../types';

const initialUser: User = {
    id: 'user-001',
    name: 'Juan Dela Cruz',
    email: 'juan.freelancer@email.com',
    businessName: 'Juan\'s Web Development',
    avatarUrl: 'https://picsum.photos/seed/juan/100/100',
    businessLogoUrl: 'https://i.imgur.com/4lJc4yT.png', // A bee-themed logo
    businessAddress: '123 Cyber Street, Makati, Metro Manila, Philippines',
    tin: '123-456-789-000'
};

const initialInvoices: Invoice[] = [
    { id: 'inv-001', invoiceNumber: 'CB-2024-0001', clientName: 'Startup Inc.', clientEmail: 'contact@startup.com', issueDate: '2024-07-15', dueDate: '2024-07-30', items: [{id: 'item-1', description: 'Website Redesign', quantity: 1, price: 15000}], taxRate: 12, status: InvoiceStatus.Paid, notes: 'Thank you for your business!' },
    { id: 'inv-002', invoiceNumber: 'CB-2024-0002', clientName: 'Online Store PH', clientEmail: 'orders@onlinestore.ph', issueDate: '2024-07-20', dueDate: '2024-08-05', items: [{id: 'item-2', description: 'Social Media Graphics', quantity: 10, price: 500}], taxRate: 12, status: InvoiceStatus.Sent },
    { id: 'inv-003', invoiceNumber: 'CB-2024-0003', clientName: 'Ana\'s Tutoring', clientEmail: 'ana.tutor@email.com', issueDate: '2024-06-10', dueDate: '2024-06-25', items: [{id: 'item-3', description: 'Photography Session', quantity: 1, price: 8000}], taxRate: 0, status: InvoiceStatus.Overdue },
];

const initialReceipts: Receipt[] = [
    { id: 'rec-001', receiptNumber: 'R-001', from: 'Startup Inc.', date: '2024-07-28', amount: 16800, category: ReceiptCategory.ServiceFee, paymentMethod: PaymentMethod.BankTransfer },
    { id: 'rec-002', receiptNumber: 'R-002', from: 'Office Supplies Co.', date: '2024-07-10', amount: -2500, category: ReceiptCategory.Expense, paymentMethod: PaymentMethod.EWallet },
];

const initialFeedback: ClientFeedback[] = [
    { id: 'fb-001', clientName: 'Startup Inc.', rating: 5, comment: 'Juan was amazing to work with! Very professional and delivered on time.', date: '2024-08-01' }
];

const initialState: AppState = {
    user: initialUser,
    invoices: initialInvoices,
    receipts: initialReceipts,
    feedback: initialFeedback,
    language: 'en'
};

const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'ADD_INVOICE':
            return { ...state, invoices: [...state.invoices, action.payload] };
        case 'UPDATE_INVOICE':
            return { ...state, invoices: state.invoices.map(inv => inv.id === action.payload.id ? action.payload : inv) };
        case 'DELETE_INVOICE':
            return { ...state, invoices: state.invoices.filter(inv => inv.id !== action.payload) };
        case 'ADD_RECEIPT':
            return { ...state, receipts: [...state.receipts, action.payload] };
        case 'UPDATE_RECEIPT':
            return { ...state, receipts: state.receipts.map(rec => rec.id === action.payload.id ? action.payload : rec) };
        case 'DELETE_RECEIPT':
            return { ...state, receipts: state.receipts.filter(rec => rec.id !== action.payload) };
        case 'ADD_FEEDBACK':
            return { ...state, feedback: [...state.feedback, action.payload] };
        case 'UPDATE_USER':
            return { ...state, user: { ...state.user, ...action.payload } };
        case 'TOGGLE_LANGUAGE':
            return { ...state, language: state.language === 'en' ? 'tl' : 'en' };
        default:
            return state;
    }
};

export const AppContext = createContext<{ state: AppState; dispatch: Dispatch<AppAction> }>({
    state: initialState,
    dispatch: () => null
});

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};