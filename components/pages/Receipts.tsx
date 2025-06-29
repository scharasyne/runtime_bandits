import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCredibee } from '../../hooks/useCredibee';
import { Receipt, ReceiptCategory, PaymentMethod } from '../../types';
import Card from '../common/Card';
import { useTranslation } from '../../utils/localization';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const COLORS = ['#ffbf01', '#ffa400', '#ffe9af', '#ff9500', '#e67e00'];

const Receipts: React.FC = () => {
    const { state } = useCredibee();
    const navigate = useNavigate();
    const t = useTranslation();
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

        const totalIncome = state.receipts.filter(r => r.amount > 0).reduce((sum, r) => sum + r.amount, 0);
        const totalExpenses = state.receipts.filter(r => r.amount < 0).reduce((sum, r) => sum + r.amount, 0);

        const monthlyChart: { [key: string]: { name: string; income: number; expenses: number } } = {};
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
                netIncome: totalIncome + totalExpenses
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
                <Card title={t('totalIncome')}><p className="text-3xl font-bold text-green-600">₱{summary.totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</p></Card>
                <Card title={t('totalExpenses')}><p className="text-3xl font-bold text-red-600">₱{Math.abs(summary.totalExpenses).toLocaleString(undefined, {minimumFractionDigits: 2})}</p></Card>
                <Card title={t('netIncome')}><p className="text-3xl font-bold text-slate-800">₱{summary.netIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</p></Card>
            </div>
            {/* Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="lg:col-span-2" title={t('incomeVsExpenses')}>
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
                <Card title={t('paymentMethods')}>
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
            
            <Card title={t('allReceipts')} action={
                <div className="flex items-center gap-2">
                    <button onClick={exportToCSV} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">{t('exportToCsv')}</button>
                    <button onClick={() => navigate('/receipts/new')} className="bg-credibee-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-credibee-primary-800 transition-colors">
                        {t('createExpense')}
                    </button>
                </div>
            }>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder={t('searchBySource')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-credibee-primary-500"
                    />
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-credibee-primary-500 bg-white"
                    >
                        <option value="All">{t('allCategories')}</option>
                        {Object.values(ReceiptCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                     <select
                        value={paymentMethodFilter}
                        onChange={e => setPaymentMethodFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-credibee-primary-500 bg-white"
                    >
                        <option value="All">{t('allPaymentMethods')}</option>
                        {Object.values(PaymentMethod).map(pm => <option key={pm} value={pm}>{pm}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('date')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('fromTo')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('category')}</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t('amount')}</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredReceipts.map((receipt) => (
                                <tr key={receipt.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(receipt.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{receipt.from}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{receipt.category}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${receipt.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {receipt.amount >= 0 ? '+' : ''}₱{receipt.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-4">
                                       <button onClick={() => navigate(`/receipts/${receipt.id}`)} className="text-credibee-primary-600 hover:text-credibee-primary-900">{t('view')}</button>
                                       {receipt.amount < 0 && (
                                            <button onClick={() => navigate(`/receipts/edit/${receipt.id}`)} className="text-slate-600 hover:text-slate-900">{t('edit')}</button>
                                       )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredReceipts.length === 0 && <p className="text-center py-8 text-slate-500">{t('noReceiptsFound')}</p>}
                </div>
            </Card>
        </div>
    );
};

export default Receipts;