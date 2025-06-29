import React, { useState, useMemo } from 'react';
import { useCredibee } from '../../hooks/useCredibee';
import { InvoiceStatus, TransactionCategory, PaymentMethod } from '../../types';
import Card from '../common/Card';

const FilterIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);

const TrendingUpIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);

const TrendingDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
);

const SearchIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
);

interface Transaction {
    id: string;
    type: 'invoice' | 'receipt';
    date: string;
    description: string;
    amount: number;
    category: string;
    status?: InvoiceStatus;
    paymentMethod?: PaymentMethod;
    client?: string;
    tags?: string[];
    isRecurring?: boolean;
}

const Transactions: React.FC = () => {
    const { state } = useCredibee();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Convert invoices and receipts to unified transaction format
    const transactions: Transaction[] = useMemo(() => {
        const invoiceTransactions: Transaction[] = state.invoices.map(invoice => ({
            id: `inv-${invoice.id}`,
            type: 'invoice' as const,
            date: invoice.paidDate || invoice.issueDate,
            description: `Invoice #${invoice.invoiceNumber} - ${invoice.clientName}`,
            amount: invoice.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * (1 + invoice.taxRate / 100),
            category: 'Service Revenue',
            status: invoice.status,
            paymentMethod: invoice.paymentMethod,
            client: invoice.clientName,
            tags: [`invoice`, `client-${invoice.clientName.toLowerCase().replace(/\s+/g, '-')}`]
        }));

        const receiptTransactions: Transaction[] = state.receipts.map(receipt => ({
            id: `rec-${receipt.id}`,
            type: 'receipt' as const,
            date: receipt.date,
            description: `Receipt #${receipt.receiptNumber} - ${receipt.from}`,
            amount: receipt.amount,
            category: receipt.transactionCategory || receipt.category,
            paymentMethod: receipt.paymentMethod,
            client: receipt.from,
            tags: receipt.tags || [],
            isRecurring: receipt.isRecurring
        }));

        return [...invoiceTransactions, ...receiptTransactions];
    }, [state.invoices, state.receipts]);

    // Filter and sort transactions
    const filteredTransactions = useMemo(() => {
        let filtered = transactions.filter(transaction => {
            // Search filter
            const searchMatch = !searchTerm || 
                transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.client?.toLowerCase().includes(searchTerm.toLowerCase());

            // Type filter
            const typeMatch = filterType === 'all' || 
                (filterType === 'income' && transaction.amount > 0) ||
                (filterType === 'expense' && transaction.amount < 0);

            // Category filter
            const categoryMatch = filterCategory === 'all' || 
                transaction.category === filterCategory;

            return searchMatch && typeMatch && categoryMatch;
        });

        // Sort transactions
        filtered.sort((a, b) => {
            if (sortBy === 'date') {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            } else {
                return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
            }
        });

        return filtered;
    }, [transactions, searchTerm, filterType, filterCategory, sortBy, sortOrder]);

    // Get unique categories for filter dropdown
    const categories = useMemo(() => {
        const categorySet = new Set(transactions.map(t => t.category));
        return Array.from(categorySet).sort();
    }, [transactions]);

    // Calculate summary statistics
    const summary = useMemo(() => {
        const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
        const netIncome = totalIncome - totalExpenses;
        const transactionCount = filteredTransactions.length;

        return { totalIncome, totalExpenses, netIncome, transactionCount };
    }, [transactions, filteredTransactions]);

    const formatCurrency = (amount: number) => `₱${Math.abs(amount).toLocaleString()}`;

    const getStatusColor = (status?: InvoiceStatus) => {
        switch (status) {
            case InvoiceStatus.Paid: return 'bg-green-100 text-green-800';
            case InvoiceStatus.Sent: return 'bg-blue-100 text-blue-800';
            case InvoiceStatus.Overdue: return 'bg-red-100 text-red-800';
            case InvoiceStatus.Draft: return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Financial Transactions</h1>
                    <p className="text-slate-600 mt-1">Track all income and expenses in one place</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500">Total Income</h3>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</p>
                        </div>
                        <div className="p-2 rounded-full bg-green-100">
                            <TrendingUpIcon className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500">Total Expenses</h3>
                            <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</p>
                        </div>
                        <div className="p-2 rounded-full bg-red-100">
                            <TrendingDownIcon className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500">Net Income</h3>
                            <p className={`text-2xl font-bold ${summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {summary.netIncome >= 0 ? '+' : ''}{formatCurrency(summary.netIncome)}
                            </p>
                        </div>
                        <div className={`p-2 rounded-full ${summary.netIncome >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                            {summary.netIncome >= 0 ? 
                                <TrendingUpIcon className="h-5 w-5 text-green-600" /> :
                                <TrendingDownIcon className="h-5 w-5 text-red-600" />
                            }
                        </div>
                    </div>
                </Card>

                <Card className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500">Transactions</h3>
                            <p className="text-2xl font-bold text-slate-800">{summary.transactionCount}</p>
                            <p className="text-xs text-slate-500">Filtered results</p>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100">
                            <FilterIcon className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-credibee-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Type Filter */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-credibee-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income Only</option>
                        <option value="expense">Expenses Only</option>
                    </select>

                    {/* Category Filter */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-credibee-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    {/* Sort By */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-credibee-blue-500 focus:border-transparent"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="amount">Sort by Amount</option>
                    </select>

                    {/* Sort Order */}
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-credibee-blue-500 focus:border-transparent"
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>
            </Card>

            {/* Transactions List */}
            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="text-left py-3 px-4 sm:px-6 font-medium text-slate-700">Date</th>
                                <th className="text-left py-3 px-4 sm:px-6 font-medium text-slate-700">Description</th>
                                <th className="text-left py-3 px-4 sm:px-6 font-medium text-slate-700">Category</th>
                                <th className="text-left py-3 px-4 sm:px-6 font-medium text-slate-700">Amount</th>
                                <th className="text-left py-3 px-4 sm:px-6 font-medium text-slate-700">Status</th>
                                <th className="text-left py-3 px-4 sm:px-6 font-medium text-slate-700">Method</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-slate-50">
                                    <td className="py-4 px-4 sm:px-6 text-sm text-slate-600">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4 sm:px-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                            <span className="font-medium text-slate-900">{transaction.description}</span>
                                            <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
                                                {transaction.isRecurring && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                        Recurring
                                                    </span>
                                                )}
                                                {transaction.tags?.slice(0, 2).map(tag => (
                                                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 sm:px-6 text-sm text-slate-600">{transaction.category}</td>
                                    <td className="py-4 px-4 sm:px-6">
                                        <span className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 sm:px-6">
                                        {transaction.status ? (
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-sm">—</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 sm:px-6 text-sm text-slate-600">
                                        {transaction.paymentMethod || '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500">No transactions found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Transactions; 