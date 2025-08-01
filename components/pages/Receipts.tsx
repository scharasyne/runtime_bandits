import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCredibee } from '../../hooks/useCredibee';
import { calculateFinancialSummary } from '../../utils/financialCalculations';
import { Receipt, ReceiptCategory, PaymentMethod, InvoiceStatus } from '../../types';
import Card from '../common/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const COLORS = ['#ffbf01', '#ffa400', '#ffe9af', '#ff9500', '#e67e00'];

const Receipts: React.FC = () => {
    const { state } = useCredibee();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');

    const { summary, filteredReceipts, chartData, paymentMethodData } = useMemo(() => {
        const filtered = state.receipts.filter(receipt => {
            const matchesSearch = receipt.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || receipt.category === categoryFilter;
            const matchesPaymentMethod = paymentMethodFilter === 'All' || receipt.paymentMethod === paymentMethodFilter;
            return matchesSearch && matchesCategory && matchesPaymentMethod;
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Use standardized financial calculation including invoices
        const financialSummary = calculateFinancialSummary(state.invoices, state.receipts);
        const totalIncome = financialSummary.totalIncome;
        const totalExpenses = financialSummary.totalExpenses;

        const monthlyChart: { [key: string]: { name: string; income: number; expenses: number } } = {};
        
        // Include PAID invoices in income (consistent with standardized calculation)
        state.invoices.filter(inv => inv.status === InvoiceStatus.Paid).forEach(inv => {
            const month = new Date(inv.paidDate || inv.issueDate).toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!monthlyChart[month]) monthlyChart[month] = { name: month, income: 0, expenses: 0 };
            const subtotal = inv.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
            const revenue = subtotal;
            monthlyChart[month].income += revenue;
        });
        
        // Include receipt transactions
        state.receipts.forEach(rec => {
            const month = new Date(rec.date).toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!monthlyChart[month]) monthlyChart[month] = { name: month, income: 0, expenses: 0 };
            if (rec.amount > 0) monthlyChart[month].income += rec.amount;
            else monthlyChart[month].expenses += Math.abs(rec.amount);
        });

        const paymentData: { [key: string]: number } = {};
        state.receipts.forEach(rec => {
            paymentData[rec.paymentMethod] = (paymentData[rec.paymentMethod] || 0) + Math.abs(rec.amount);
        });

        return {
            summary: {
                totalIncome,
                totalExpenses,
                netIncome: financialSummary.netIncome
            },
            filteredReceipts: filtered,
            chartData: Object.values(monthlyChart).slice(-12),
            paymentMethodData: Object.entries(paymentData).map(([name, value]) => ({ name, value }))
        };

    }, [state.receipts, searchTerm, categoryFilter, paymentMethodFilter]);

    const exportToCSV = () => {
        const headers = ['Receipt #', 'Date', 'From/To', 'Category', 'Payment Method', 'Amount', 'Notes'];
        const rows = filteredReceipts.map(r => [
            r.receiptNumber,
            r.date,
            `"${r.from.replace(/"/g, '""')}"`,
            r.category,
            r.paymentMethod,
            r.amount,
            `"${r.notes?.replace(/"/g, '""') || ''}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "credibee_receipts.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Total Income"><p className="text-3xl font-bold text-green-600">₱{summary.totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</p></Card>
                <Card title="Total Expenses"><p className="text-3xl font-bold text-red-600">₱{Math.abs(summary.totalExpenses).toLocaleString(undefined, {minimumFractionDigits: 2})}</p></Card>
                <Card title="Net Income"><p className="text-3xl font-bold text-slate-800">₱{summary.netIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</p></Card>
            </div>
            {/* Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="lg:col-span-2" title="Income vs Expenses">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `₱${value.toLocaleString()}`}/>
                            <Legend />
                            <Bar dataKey="income" fill="#10b981" name="Income" />
                            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Payment Methods">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={paymentMethodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {paymentMethodData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value: number) => `₱${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            
            <Card title="All Receipts" action={
                <div className="flex items-center gap-2">
                    <button onClick={exportToCSV} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">Export to CSV</button>
                    <button onClick={() => navigate('/receipts/new')} className="bg-credibee-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-credibee-primary-800 transition-colors">
                        Create Expense
                    </button>
                </div>
            }>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by source name or receipt number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-credibee-primary-500"
                    />
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-credibee-primary-500 bg-white"
                    >
                        <option value="All">All Categories</option>
                        {Object.values(ReceiptCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                     <select
                        value={paymentMethodFilter}
                        onChange={e => setPaymentMethodFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-credibee-primary-500 bg-white"
                    >
                        <option value="All">All Payment Methods</option>
                        {Object.values(PaymentMethod).map(pm => <option key={pm} value={pm}>{pm}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">From/To</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Category</th>
                                <th scope="col" className="px-8 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                                {/* No headers for View/Edit columns */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredReceipts.map((receipt) => (
                                <tr key={receipt.id} className="hover:bg-slate-50 align-middle">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 align-middle">{new Date(receipt.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 align-middle">{receipt.from}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 align-middle">{receipt.category}</td>
                                    <td className={`px-8 py-4 whitespace-nowrap text-sm text-right font-medium align-middle ${receipt.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>{receipt.amount >= 0 ? '+' : ''}₱{receipt.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    <td className="py-4 px-8 whitespace-nowrap text-sm font-medium text-right align-middle w-20 pr-2">
                                        <button onClick={() => navigate(`/receipts/${receipt.id}`)} className="text-credibee-primary-600 hover:text-credibee-primary-900 whitespace-nowrap">View</button>
                                    </td>
                                    <td className="py-4 px-8 whitespace-nowrap text-sm font-medium text-right align-middle w-20 pl-2">
                                        {receipt.amount < 0 && (
                                            <button onClick={() => navigate(`/receipts/edit/${receipt.id}`)} className="text-slate-600 hover:text-slate-900 whitespace-nowrap">Edit</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredReceipts.length === 0 && <p className="text-center py-8 text-slate-500">No receipts found matching your criteria.</p>}
                </div>
            </Card>
        </div>
    );
};

export default Receipts;