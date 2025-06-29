import React, { useState, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useCredibee } from '../../hooks/useCredibee';
import { useTranslation } from '../../utils/localization';
import { calculateFinancialSummary } from '../../utils/financialCalculations';
import { InvoiceStatus, ReceiptCategory, Invoice, Receipt, TransactionCategory } from '../../types';
import Card from '../common/Card';
import { getFinancialHealthTips } from '../../services/geminiService';

const SparkleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.94 14.34 9 12l-1 2-2 1 2 1 1 2 1-2 2-1-2-1Z"/><path d="M14 5.34 13 3l-1 2-2 1 2 1 1 2 1-2 2-1-2-1Z"/><path d="m18 15-1-2-2-1 2-1 1-2 1 2 2 1-2 1Z"/><path d="M22 12h-2"/><path d="M2 12H1"/><path d="M12 2V1"/><path d="m19.07 4.93-1.41 1.41"/><path d="m4.93 19.07-1.41-1.41"/><path d="M12 22v-2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m19.07 19.07 1.41-1.41"/></svg>
);

const TrendingUpIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);

const TargetIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

const FileTextIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);

const Dashboard: React.FC = () => {
    const { state } = useCredibee();
    const t = useTranslation();
    const { user, invoices, receipts, financialGoals, crediScore } = state;

    const [tips, setTips] = useState<string[]>([]);
    const [isLoadingTips, setIsLoadingTips] = useState(false);

    const handleGetTips = useCallback(async () => {
        setIsLoadingTips(true);
        const generatedTips = await getFinancialHealthTips(invoices);
        setTips(generatedTips);
        setIsLoadingTips(false);
    }, [invoices]);

    const stats = useMemo(() => {
        const financialSummary = calculateFinancialSummary(invoices, receipts);
        const uniqueClients = new Set(invoices.map(inv => inv.clientName));
        
        return { 
            totalRevenue: financialSummary.totalIncome,
            totalIncome: financialSummary.totalIncome,
            pending: financialSummary.pendingAmount,
            totalExpenses: financialSummary.totalExpenses,
            netIncome: financialSummary.netIncome,
            totalClients: uniqueClients.size
        };
    }, [invoices, receipts]);
    
    const chartData = useMemo(() => {
        const dataMap: { [key: string]: { name: string; revenue: number; expenses: number; profit: number; date: Date } } = {};
        
        // Only PAID invoices for revenue (consistent with financial summary)
        invoices.filter(i => i.status === InvoiceStatus.Paid).forEach(inv => {
            const date = new Date(inv.paidDate || inv.issueDate);
            const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format for sorting
            const monthName = date.toLocaleString('default', { month: 'short' });
            if (!dataMap[monthKey]) dataMap[monthKey] = { name: monthName, revenue: 0, expenses: 0, profit: 0, date };
            const subtotal = inv.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
            const revenue = subtotal * (1 + inv.taxRate / 100);
            dataMap[monthKey].revenue += revenue;
        });

        // Include positive receipts as revenue (consistent with financial summary)
        receipts.filter(r => r.amount > 0).forEach(rec => {
            const date = new Date(rec.date);
            const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format for sorting
            const monthName = date.toLocaleString('default', { month: 'short' });
            if (!dataMap[monthKey]) dataMap[monthKey] = { name: monthName, revenue: 0, expenses: 0, profit: 0, date };
            dataMap[monthKey].revenue += rec.amount;
        });

        // Only negative receipts for expenses
        receipts.filter(r => r.amount < 0).forEach(rec => {
            const date = new Date(rec.date);
            const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format for sorting
            const monthName = date.toLocaleString('default', { month: 'short' });
            if (!dataMap[monthKey]) dataMap[monthKey] = { name: monthName, revenue: 0, expenses: 0, profit: 0, date };
            dataMap[monthKey].expenses += Math.abs(rec.amount);
        });

        // Calculate profit and round to 2 decimal places
        Object.values(dataMap).forEach(data => {
            data.revenue = Math.round(data.revenue * 100) / 100;
            data.expenses = Math.round(data.expenses * 100) / 100;
            data.profit = Math.round((data.revenue - data.expenses) * 100) / 100;
        });

        // Sort by date and take last 6 months to ensure current month is on the right
        return Object.values(dataMap)
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(-6)
            .map(({ date, ...rest }) => rest); // Remove date from final output
    }, [invoices, receipts]);

    const expensesByCategory = useMemo(() => {
        const categoryMap: { [key: string]: number } = {};
        
        receipts.filter(r => r.amount < 0).forEach(rec => {
            const category = rec.transactionCategory || rec.category;
            categoryMap[category] = (categoryMap[category] || 0) + Math.abs(rec.amount);
        });

        return Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [receipts]);

    const COLORS = ['#ffbf01', '#ffa400', '#ffe9af', '#ff9500', '#e67e00'];

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-blue-600';
        if (score >= 55) return 'text-yellow-600';
        if (score >= 40) return 'text-orange-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 85) return 'bg-green-100';
        if (score >= 70) return 'bg-blue-100';
        if (score >= 55) return 'bg-yellow-100';
        if (score >= 40) return 'bg-orange-100';
        return 'bg-red-100';
    };

    const recentActivities: (Invoice | Receipt)[] = [...invoices, ...receipts]
      .sort((a, b) => new Date('date' in a ? a.date : a.issueDate).getTime() < new Date('date' in b ? b.date : b.issueDate).getTime() ? 1 : -1)
      .slice(0, 8);

    const activeGoals = financialGoals.filter(goal => !goal.isCompleted).slice(0, 3);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-credibee-primary-600 to-credibee-primary-800 rounded-lg p-4 sm:p-6 text-white">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('hello')}, {user.name}!</h1>
                <p className="text-credibee-primary-100 text-sm sm:text-base">Welcome to your financial dashboard</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xs sm:text-sm font-medium text-slate-500">{t('crediScore')}</h4>
                            <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${getScoreColor(crediScore.score)}`}>
                                {crediScore.score}
                            </p>
                            <p className="text-xs text-slate-500">{crediScore.level}</p>
                        </div>
                        <div className={`p-2 rounded-full ${getScoreBgColor(crediScore.score)}`}>
                            <TrendingUpIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${getScoreColor(crediScore.score)}`} />
                        </div>
                    </div>
                </Card>
                
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xs sm:text-sm font-medium text-slate-500">{t('totalRevenue')}</h4>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">₱{stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                            <p className="text-xs text-green-600">+{((stats.totalRevenue / (stats.totalRevenue + stats.totalExpenses)) * 100).toFixed(1)}%</p>
                        </div>
                        <div className="p-2 rounded-full bg-green-100">
                            <TrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        </div>
                    </div>
                </Card>
                
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xs sm:text-sm font-medium text-slate-500">Net Income</h4>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">₱{stats.netIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                            <p className="text-xs text-slate-500">Revenue - Expenses</p>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100">
                            <TargetIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                    </div>
                </Card>
                
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xs sm:text-sm font-medium text-slate-500">Total Clients</h4>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">{stats.totalClients}</p>
                            <p className="text-xs text-slate-500">Unique clients</p>
                        </div>
                        <div className="p-2 rounded-full bg-purple-100">
                            <FileTextIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column - Charts */}
                <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                    {/* Revenue Chart */}
                    <Card title="Financial Performance" className="p-4 sm:p-6">
                        <div className="h-64 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line dataKey="revenue" stroke="#ffbf01" name="Revenue" strokeWidth={3} />
                                    <Line dataKey="expenses" stroke="#f43f5e" name="Expenses" strokeWidth={3} />
                                    <Line dataKey="profit" stroke="#ffa400" name="Profit" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Expense Breakdown */}
                    <Card title="Top Expense Categories" className="p-4 sm:p-6">
                        <div className="h-64 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expensesByCategory}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {expensesByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₱${Number(value).toLocaleString()}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Right Column - Widgets */}
                <div className="space-y-4 sm:space-y-6">
                    {/* CrediScore Breakdown */}
                    <Card title="CrediScore Breakdown" className="p-4 sm:p-6">
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full ${getScoreBgColor(crediScore.score)} mb-2`}>
                                    <span className={`text-2xl sm:text-3xl font-bold ${getScoreColor(crediScore.score)}`}>
                                        {crediScore.score}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-slate-600">{crediScore.level}</p>
                            </div>
                            
                            <div className="space-y-3">
                                {Object.entries(crediScore.factors).map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="font-medium">{value}/25</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div 
                                                className="bg-credibee-primary-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(value / 25) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Financial Goals */}
                    <Card title="Financial Goals" className="p-4 sm:p-6">
                        <div className="space-y-4">
                            {activeGoals.map(goal => (
                                <div key={goal.id} className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-medium text-slate-700">{goal.title}</h4>
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                            {goal.category}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span>₱{goal.currentAmount.toLocaleString()}</span>
                                            <span>₱{goal.targetAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div 
                                                className="bg-credibee-primary-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% complete
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* AI Tips */}
                    <Card title={t('aiPoweredTips')} className="p-4 sm:p-6" action={
                        <button 
                            onClick={handleGetTips} 
                            disabled={isLoadingTips} 
                            className="p-1.5 rounded-full bg-credibee-primary-100 text-credibee-primary-700 hover:bg-credibee-primary-200 disabled:opacity-50 transition-colors"
                        >
                            <SparkleIcon className="h-4 w-4 sm:h-5 sm:w-5"/>
                        </button>
                    }>
                        {isLoadingTips ? (
                            <p className="text-slate-500 text-sm">Generating insights...</p>
                        ) : (
                            <div className="space-y-3">
                                {tips.length > 0 ? tips.map((tip, index) => (
                                    <div key={index} className="flex items-start space-x-2">
                                        <SparkleIcon className="h-3 w-3 text-yellow-400 mt-1 flex-shrink-0" />
                                        <span className="text-sm text-slate-700">{tip}</span>
                                    </div>
                                )) : (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-slate-500 mb-2">Get personalized financial insights!</p>
                                        <button 
                                            onClick={handleGetTips}
                                            className="text-sm text-credibee-primary-600 hover:text-credibee-primary-800 font-medium"
                                        >
                                            Click ✨ to start
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Recent Activity */}
                    <Card title="Recent Activity" className="p-4 sm:p-6">
                        <div className="space-y-3">
                            {recentActivities.map(activity => (
                                <div key={activity.id} className="flex justify-between items-center text-sm py-2 border-b border-slate-100 last:border-b-0">
                                    {'invoiceNumber' in activity ? (
                                        <>
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-700">Invoice #{activity.invoiceNumber}</p>
                                                <p className="text-xs text-slate-500">{activity.clientName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-credibee-primary-700">
                                                    ₱{(activity.items.reduce((sum, i) => sum + i.price * i.quantity, 0) * (1 + activity.taxRate / 100)).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-slate-500">{activity.status}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-700">Receipt #{activity.receiptNumber}</p>
                                                <p className="text-xs text-slate-500">{activity.from}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-medium ${activity.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {activity.amount > 0 ? '+' : ''}₱{activity.amount.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-slate-500">{activity.transactionCategory}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;