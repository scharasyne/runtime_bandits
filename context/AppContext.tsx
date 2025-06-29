import React, { createContext, useReducer, Dispatch, ReactNode, useEffect } from 'react';
import { AppState, AppAction, User, Invoice, Receipt, ClientFeedback, InvoiceStatus, ReceiptCategory, PaymentMethod, TransactionCategory, FinancialGoal, CrediScoreMetrics } from '../types';

const initialUser: User = {
    id: 'user-001',
    name: 'Juan Dela Cruz',
    email: 'juan.freelancer@email.com',
    businessName: 'Juan\'s Web Development',
    avatarUrl: 'https://picsum.photos/seed/juan/100/100',
    businessLogoUrl: 'https://i.imgur.com/4lJc4yT.png', // A bee-themed logo
    businessAddress: '123 Cyber Street, Makati, Metro Manila, Philippines',
    tin: '123-456-789-000',
    phoneNumber: '+639123456789',
    website: 'www.juanswebdev.com',
    businessType: 'Freelance Web Development',
    joinDate: '2023-01-15'
};

const initialInvoices: Invoice[] = [
    { 
        id: 'inv-001', 
        invoiceNumber: 'CB-2024-0001', 
        clientName: 'Startup Inc.', 
        clientEmail: 'contact@startup.com', 
        issueDate: '2024-07-15', 
        dueDate: '2024-07-30', 
        items: [{id: 'item-1', description: 'Website Redesign', quantity: 1, price: 15000}], 
        taxRate: 12, 
        status: InvoiceStatus.Paid, 
        notes: 'Thank you for your business!',
        paymentTerms: 'Net 15',
        paidDate: '2024-07-28',
        paymentMethod: PaymentMethod.BankTransfer
    },
    { 
        id: 'inv-002', 
        invoiceNumber: 'CB-2024-0002', 
        clientName: 'Online Store PH', 
        clientEmail: 'orders@onlinestore.ph', 
        issueDate: '2024-07-20', 
        dueDate: '2024-08-05', 
        items: [{id: 'item-2', description: 'Social Media Graphics', quantity: 10, price: 500}], 
        taxRate: 12, 
        status: InvoiceStatus.Sent,
        paymentTerms: 'Net 15'
    },
    { 
        id: 'inv-003', 
        invoiceNumber: 'CB-2024-0003', 
        clientName: 'Ana\'s Tutoring', 
        clientEmail: 'ana.tutor@email.com', 
        issueDate: '2024-06-10', 
        dueDate: '2024-06-25', 
        items: [{id: 'item-3', description: 'Photography Session', quantity: 1, price: 8000}], 
        taxRate: 0, 
        status: InvoiceStatus.Overdue,
        paymentTerms: 'Net 15'
    },
];

const initialReceipts: Receipt[] = [
    { 
        id: 'rec-001', 
        receiptNumber: 'R-001', 
        from: 'Startup Inc.', 
        date: '2024-07-28', 
        amount: 16800, 
        category: ReceiptCategory.ServiceFee, 
        transactionCategory: TransactionCategory.ServiceRevenue,
        paymentMethod: PaymentMethod.BankTransfer,
        tags: ['web-development', 'client-payment']
    },
    { 
        id: 'rec-002', 
        receiptNumber: 'R-002', 
        from: 'Office Supplies Co.', 
        date: '2024-07-10', 
        amount: -2500, 
        category: ReceiptCategory.BusinessExpense, 
        transactionCategory: TransactionCategory.Office_Supplies,
        paymentMethod: PaymentMethod.GCash, 
        photoUrl: 'https://i.imgur.com/gBFy1H8.jpeg',
        tags: ['office', 'supplies'],
        isRecurring: true,
        recurringFrequency: 'monthly'
    },
    { 
        id: 'rec-003', 
        receiptNumber: 'R-003', 
        from: 'Client B', 
        date: '2024-06-15', 
        amount: 5000, 
        category: ReceiptCategory.ProductSale, 
        transactionCategory: TransactionCategory.ProductSale,
        paymentMethod: PaymentMethod.PayMaya,
        tags: ['product-sale']
    },
    { 
        id: 'rec-004', 
        receiptNumber: 'R-004', 
        from: 'Internet Provider', 
        date: '2024-07-05', 
        amount: -1500, 
        category: ReceiptCategory.BusinessExpense, 
        transactionCategory: TransactionCategory.Internet,
        paymentMethod: PaymentMethod.GCash,
        tags: ['utilities', 'internet'],
        isRecurring: true,
        recurringFrequency: 'monthly'
    },
];

const initialFeedback: ClientFeedback[] = [
    { 
        id: 'fb-001', 
        clientName: 'Startup Inc.', 
        clientEmail: 'contact@startup.com',
        rating: 5, 
        comment: 'Juan was amazing to work with! Very professional and delivered on time. The website exceeded our expectations and helped increase our online presence significantly.',
        date: '2024-08-01',
        projectType: 'Website Development',
        isPublic: true,
        isVerified: true
    },
    { 
        id: 'fb-002', 
        clientName: 'Online Store PH', 
        clientEmail: 'orders@onlinestore.ph',
        rating: 4, 
        comment: 'Great work on the social media graphics. Very creative and professional. Will definitely work with Juan again.',
        date: '2024-07-25',
        projectType: 'Graphic Design',
        isPublic: true,
        isVerified: true
    },
    { 
        id: 'fb-003', 
        clientName: 'Local Restaurant', 
        rating: 5, 
        comment: 'Outstanding photography work for our menu. Juan captured the essence of our dishes perfectly!',
        date: '2024-06-20',
        projectType: 'Photography',
        isPublic: true,
        isVerified: false
    }
];

const initialFinancialGoals: FinancialGoal[] = [
    {
        id: 'goal-001',
        title: 'Monthly Revenue Target',
        description: 'Reach ₱50,000 monthly revenue by Q4 2024',
        targetAmount: 50000,
        currentAmount: 32000,
        deadline: '2024-12-31',
        category: 'revenue',
        isCompleted: false,
        createdDate: '2024-01-01'
    },
    {
        id: 'goal-002',
        title: 'Emergency Fund',
        description: 'Build emergency fund equivalent to 6 months expenses',
        targetAmount: 120000,
        currentAmount: 45000,
        deadline: '2024-12-31',
        category: 'savings',
        isCompleted: false,
        createdDate: '2024-02-15'
    },
    {
        id: 'goal-003',
        title: 'New Client Acquisition',
        description: 'Acquire 5 new regular clients',
        targetAmount: 5,
        currentAmount: 3,
        deadline: '2024-09-30',
        category: 'client_acquisition',
        isCompleted: false,
        createdDate: '2024-05-01'
    }
];

// Enhanced CrediScore calculation function
const calculateCrediScore = (invoices: Invoice[], receipts: Receipt[], feedback: ClientFeedback[], user: User): CrediScoreMetrics => {
    // Payment History Score (0-25 points)
    const paidInvoices = invoices.filter(inv => inv.status === InvoiceStatus.Paid);
    const totalInvoices = invoices.length;
    const paymentHistoryScore = totalInvoices > 0 ? (paidInvoices.length / totalInvoices) * 25 : 0;

    // Financial Consistency Score (0-20 points)
    const monthlyRevenues = new Map<string, number>();
    paidInvoices.forEach(inv => {
        const month = new Date(inv.paidDate || inv.issueDate).toISOString().slice(0, 7);
        const revenue = inv.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * (1 + inv.taxRate / 100);
        monthlyRevenues.set(month, (monthlyRevenues.get(month) || 0) + revenue);
    });
    
    const revenues = Array.from(monthlyRevenues.values());
    const avgRevenue = revenues.reduce((sum, rev) => sum + rev, 0) / revenues.length || 0;
    const variance = revenues.reduce((sum, rev) => sum + Math.pow(rev - avgRevenue, 2), 0) / revenues.length || 0;
    const consistencyScore = avgRevenue > 0 ? Math.max(0, 20 - (Math.sqrt(variance) / avgRevenue) * 10) : 0;

    // Client Diversity Score (0-15 points) - based on unique clients from invoices
    const uniqueClients = new Set(invoices.map(inv => inv.clientName));
    const clientDiversityScore = Math.min(15, uniqueClients.size * 2.5);

    // Business Growth Score (0-20 points)
    const totalRevenue = paidInvoices.reduce((sum, inv) => {
        return sum + inv.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0) * (1 + inv.taxRate / 100);
    }, 0);
    const businessAge = (new Date().getTime() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    const growthScore = Math.min(20, Math.log10(totalRevenue + 1) * 3 + businessAge * 2);

    // Professional Reputation Score (0-20 points)
    const avgRating = feedback.length > 0 ? feedback.reduce((sum, fb) => sum + fb.rating, 0) / feedback.length : 0;
    const verifiedFeedbacks = feedback.filter(fb => fb.isVerified).length;
    const reputationScore = (avgRating / 5) * 15 + Math.min(5, verifiedFeedbacks);

    const totalScore = Math.round(paymentHistoryScore + consistencyScore + clientDiversityScore + growthScore + reputationScore);

    let level: CrediScoreMetrics['level'];
    if (totalScore >= 85) level = 'Excellent';
    else if (totalScore >= 70) level = 'Very Good';
    else if (totalScore >= 55) level = 'Good';
    else if (totalScore >= 40) level = 'Fair';
    else level = 'Poor';

    const recommendations: string[] = [];
    if (paymentHistoryScore < 20) recommendations.push('Improve invoice collection to boost payment history');
    if (consistencyScore < 15) recommendations.push('Focus on maintaining consistent monthly revenue');
    if (clientDiversityScore < 10) recommendations.push('Diversify your client base to reduce dependency risk');
    if (growthScore < 15) recommendations.push('Implement strategies to grow your business revenue');
    if (reputationScore < 15) recommendations.push('Collect more client feedback and testimonials');

    return {
        score: totalScore,
        level,
        factors: {
            paymentHistory: Math.round(paymentHistoryScore),
            financialConsistency: Math.round(consistencyScore),
            clientDiversity: Math.round(clientDiversityScore),
            businessGrowth: Math.round(growthScore),
            professionalReputation: Math.round(reputationScore)
        },
        recommendations,
        lastUpdated: new Date().toISOString()
    };
};

const initialCrediScore = calculateCrediScore(initialInvoices, initialReceipts, initialFeedback, initialUser);

const initialState: AppState = {
    user: initialUser,
    invoices: initialInvoices,
    receipts: initialReceipts,
    feedback: initialFeedback,
    financialGoals: initialFinancialGoals,
    crediScore: initialCrediScore,
    language: 'en'
};

const appReducer = (state: AppState, action: AppAction): AppState => {
    let newState = state;
    
    switch (action.type) {
        case 'ADD_INVOICE':
            newState = { ...state, invoices: [...state.invoices, action.payload] };
            break;
        case 'UPDATE_INVOICE':
            newState = { ...state, invoices: state.invoices.map(inv => inv.id === action.payload.id ? action.payload : inv) };
            break;
        case 'DELETE_INVOICE':
            newState = { ...state, invoices: state.invoices.filter(inv => inv.id !== action.payload) };
            break;
        case 'ADD_RECEIPT':
            newState = { ...state, receipts: [...state.receipts, action.payload] };
            break;
        case 'UPDATE_RECEIPT':
            newState = { ...state, receipts: state.receipts.map(rec => rec.id === action.payload.id ? action.payload : rec) };
            break;
        case 'DELETE_RECEIPT':
            newState = { ...state, receipts: state.receipts.filter(rec => rec.id !== action.payload) };
            break;
        case 'ADD_FEEDBACK':
            newState = { ...state, feedback: [action.payload, ...state.feedback] };
            break;
        case 'UPDATE_FEEDBACK':
            newState = { ...state, feedback: state.feedback.map(fb => fb.id === action.payload.id ? action.payload : fb) };
            break;
        case 'DELETE_FEEDBACK':
            newState = { ...state, feedback: state.feedback.filter(fb => fb.id !== action.payload) };
            break;
        case 'ADD_FINANCIAL_GOAL':
            newState = { ...state, financialGoals: [...state.financialGoals, action.payload] };
            break;
        case 'UPDATE_FINANCIAL_GOAL':
            newState = { ...state, financialGoals: state.financialGoals.map(goal => goal.id === action.payload.id ? action.payload : goal) };
            break;
        case 'DELETE_FINANCIAL_GOAL':
            newState = { ...state, financialGoals: state.financialGoals.filter(goal => goal.id !== action.payload) };
            break;
        case 'UPDATE_USER':
            newState = { ...state, user: { ...state.user, ...action.payload } };
            break;
        case 'UPDATE_CREDISCORE':
            newState = { ...state, crediScore: action.payload };
            break;
        case 'TOGGLE_LANGUAGE':
            newState = { ...state, language: state.language === 'en' ? 'tl' : 'en' };
            break;
        default:
            return state;
    }

    // Recalculate CrediScore when relevant data changes
    if (['ADD_INVOICE', 'UPDATE_INVOICE', 'DELETE_INVOICE', 'ADD_RECEIPT', 'UPDATE_RECEIPT', 'DELETE_RECEIPT', 'ADD_FEEDBACK', 'UPDATE_FEEDBACK', 'DELETE_FEEDBACK'].includes(action.type)) {
        newState.crediScore = calculateCrediScore(newState.invoices, newState.receipts, newState.feedback, newState.user);
    }

    return newState;
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