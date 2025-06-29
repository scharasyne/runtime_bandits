import { Invoice, Receipt, InvoiceStatus } from '../types';

// Standardized financial calculation functions
export const calculateFinancialSummary = (invoices: Invoice[], receipts: Receipt[]) => {
    // Income: Only PAID invoices + positive receipts (actual realized income)
    const invoiceRevenue = invoices
        .filter(inv => inv.status === InvoiceStatus.Paid)
        .reduce((sum, inv) => {
            const subtotal = inv.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
            return sum + subtotal;
        }, 0);
    
    const receiptIncome = receipts
        .filter(rec => rec.amount > 0)
        .reduce((sum, rec) => sum + rec.amount, 0);
    
    const totalIncome = invoiceRevenue + receiptIncome;
    
    // Expenses: Only negative receipts (business expenses)
    const totalExpenses = receipts
        .filter(rec => rec.amount < 0)
        .reduce((sum, rec) => sum + Math.abs(rec.amount), 0);
    
    // Pending: Sent/Overdue invoices
    const pendingAmount = invoices
        .filter(inv => inv.status === InvoiceStatus.Sent || inv.status === InvoiceStatus.Overdue)
        .reduce((sum, inv) => {
            const subtotal = inv.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
            return sum + subtotal;
        }, 0);
    
    // Net Income
    const netIncome = totalIncome - totalExpenses;
    
    // Round all values to 2 decimal places
    return {
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        netIncome: Math.round(netIncome * 100) / 100,
        pendingAmount: Math.round(pendingAmount * 100) / 100,
        invoiceRevenue: Math.round(invoiceRevenue * 100) / 100,
        receiptIncome: Math.round(receiptIncome * 100) / 100
    };
}; 