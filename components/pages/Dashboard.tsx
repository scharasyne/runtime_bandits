
import React, { useState, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCredibee } from '../../hooks/useCredibee';
import { useTranslation } from '../../utils/localization';
import { InvoiceStatus, ReceiptCategory, Invoice, Receipt } from '../../types';
import Card from '../common/Card';
import { getFinancialHealthTips } from '../../services/geminiService';

const SparkleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.94 14.34 9 12l-1 2-2 1 2 1 1 2 1-2 2-1-2-1Z"/><path d="M14 5.34 13 3l-1 2-2 1 2 1 1 2 1-2 2-1-2-1Z"/><path d="m18 15-1-2-2-1 2-1 1-2 1 2 2 1-2 1Z"/><path d="M22 12h-2"/><path d="M2 12H1"/><path d="M12 2V1"/><path d="m19.07 4.93-1.41 1.41"/><path d="m4.93 19.07-1.41-1.41"/><path d="M12 22v-2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m19.07 19.07 1.41-1.41"/></svg>
);


const Dashboard: React.FC = () => {
    const { state } = useCredibee();
    const t = useTranslation();
    const { user, invoices, receipts } = state;

    const [tips, setTips] = useState<string[]>([]);
    const [isLoadingTips, setIsLoadingTips] = useState(false);

    const handleGetTips = useCallback(async () => {
        setIsLoadingTips(true);
        const generatedTips = await getFinancialHealthTips(invoices);
        setTips(generatedTips);
        setIsLoadingTips(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoices]);

    const stats = useMemo(() => {
        const totalRevenue = invoices
            .filter(inv => inv.status === InvoiceStatus.Paid)
            .reduce((sum, inv) => {
                const subtotal = inv.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
                return sum + subtotal * (1 + inv.taxRate / 100);
            }, 0);
        
        const pending = invoices
            .filter(inv => inv.status === InvoiceStatus.Sent || inv.status === InvoiceStatus.Overdue)
            .reduce((sum, inv) => {
                const subtotal = inv.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
                return sum + subtotal * (1 + inv.taxRate / 100);
            }, 0);

        const clientNames = new Set(invoices.map(inv => inv.clientName));
        const totalClients = clientNames.size;

        // Basic CrediScore Algorithm
        const score = Math.min(100, 
            (invoices.filter(i => i.status === 'Paid').length * 5) + 
            (receipts.length * 2) + 
            (totalClients * 3) + 
            (Math.log10(totalRevenue + 1) * 10)
        );

        return { totalRevenue, pending, totalClients, crediScore: Math.round(score) };
    }, [invoices, receipts]);
    
    const chartData = useMemo(() => {
        const dataMap: { [key: string]: { name: string; revenue: number; expenses: number } } = {};
        
        invoices.filter(i => i.status === InvoiceStatus.Paid).forEach(inv => {
            const month = new Date(inv.issueDate).toLocaleString('default', { month: 'short' });
            if (!dataMap[month]) dataMap[month] = { name: month, revenue: 0, expenses: 0};
            const subtotal = inv.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
            dataMap[month].revenue += subtotal * (1 + inv.taxRate / 100);
        });

        receipts.filter(r => r.category === ReceiptCategory.Expense).forEach(rec => {
            const month = new Date(rec.date).toLocaleString('default', { month: 'short' });
            if (!dataMap[month]) dataMap[month] = { name: month, revenue: 0, expenses: 0};
            dataMap[month].expenses += Math.abs(rec.amount);
        });

        return Object.values(dataMap).slice(-6); // Last 6 months
    }, [invoices, receipts]);

    const getScoreColor = (score: number) => {
        if (score > 75) return 'text-credibee-green-500';
        if (score > 50) return 'text-yellow-500';
        return 'text-red-500';
    }

    const recentActivities: (Invoice | Receipt)[] = [...invoices, ...receipts]
      .sort((a, b) => new Date('date' in a ? a.date : a.issueDate).getTime() < new Date('date' in b ? b.date : b.issueDate).getTime() ? 1 : -1)
      .slice(0, 5);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">{t('hello')}, {user.name}!</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <h4 className="text-sm font-medium text-slate-500">{t('crediScore')}</h4>
                    <p className={`text-4xl font-bold ${getScoreColor(stats.crediScore)}`}>{stats.crediScore} <span className="text-lg font-normal">/ 100</span></p>
                </Card>
                 <Card>
                    <h4 className="text-sm font-medium text-slate-500">{t('totalRevenue')}</h4>
                    <p className="text-3xl font-bold text-slate-800">₱{stats.totalRevenue.toLocaleString()}</p>
                </Card>
                 <Card>
                    <h4 className="text-sm font-medium text-slate-500">{t('pending')}</h4>
                    <p className="text-3xl font-bold text-slate-800">₱{stats.pending.toLocaleString()}</p>
                </Card>
                 <Card>
                    <h4 className="text-sm font-medium text-slate-500">{t('totalClients')}</h4>
                    <p className="text-3xl font-bold text-slate-800">{stats.totalClients}</p>
                </Card>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title={t('revenueAndExpenses')}>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#0f8eff" name="Revenue" />
                                    <Bar dataKey="expenses" fill="#f43f5e" name="Expenses" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title={t('aiPoweredTips')} action={
                        <button onClick={handleGetTips} disabled={isLoadingTips} className="p-1.5 rounded-full bg-credibee-blue-100 text-credibee-blue-700 hover:bg-credibee-blue-200 disabled:opacity-50">
                            <SparkleIcon className="h-5 w-5"/>
                        </button>
                    }>
                        {isLoadingTips ? (
                            <p className="text-slate-500">{t('generatingTips')}</p>
                        ) : (
                            <ul className="space-y-3">
                                {tips.length > 0 ? tips.map((tip, index) => (
                                    <li key={index} className="flex items-start">
                                        <SparkleIcon className="h-4 w-4 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                                        <span className="text-sm text-slate-700">{tip}</span>
                                    </li>
                                )) : (
                                  <p className="text-sm text-center text-slate-500 py-4">Click the ✨ button to get personalized financial tips!</p>
                                )}
                            </ul>
                        )}
                    </Card>

                    <Card title={t('recentActivity')}>
                        <ul className="space-y-4">
                            {recentActivities.map(activity => (
                                'invoiceNumber' in activity ?
                                <li key={activity.id} className="flex justify-between items-center text-sm">
                                    <p>Invoice <span className="font-semibold text-credibee-blue-700">#{activity.invoiceNumber}</span></p>
                                    <p className="font-medium">₱{(activity.items.reduce((sum, i) => sum + i.price * i.quantity, 0) * (1 + activity.taxRate / 100)).toLocaleString()}</p>
                                </li>
                                :
                                <li key={activity.id} className="flex justify-between items-center text-sm">
                                    <p>Receipt <span className="font-semibold text-credibee-blue-700">#{activity.receiptNumber}</span></p>
                                    <p className={`font-medium ${activity.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{activity.amount > 0 ? '+' : ''}₱{activity.amount.toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

