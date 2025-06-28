
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCredibee } from '../../hooks/useCredibee';
import { Invoice, InvoiceStatus } from '../../types';
import Card from '../common/Card';
import { useTranslation } from '../../utils/localization';

const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
        case InvoiceStatus.Paid: return 'bg-green-100 text-green-800';
        case InvoiceStatus.Sent: return 'bg-blue-100 text-blue-800';
        case InvoiceStatus.Overdue: return 'bg-red-100 text-red-800';
        case InvoiceStatus.Draft: return 'bg-slate-100 text-slate-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const Invoices: React.FC = () => {
    const { state } = useCredibee();
    const navigate = useNavigate();
    const t = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredInvoices = state.invoices.filter(invoice => {
        const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    }).sort((a,b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

    return (
        <Card title={t('allInvoices')} action={
            <button onClick={() => navigate('/invoices/new')} className="bg-credibee-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-credibee-blue-800 transition-colors">
                {t('createInvoice')}
            </button>
        }>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                    type="text"
                    placeholder={t('searchByClient')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-credibee-blue-500"
                />
                 <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-credibee-blue-500 bg-white"
                 >
                    <option value="All">{t('allStatuses')}</option>
                    {Object.values(InvoiceStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                 </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('invoiceNo')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('clientName')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('dueDate')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('total')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('status')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredInvoices.map((invoice) => {
                            const total = invoice.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * (1 + invoice.taxRate / 100);
                            return (
                                <tr key={invoice.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{invoice.invoiceNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{invoice.clientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">₱{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => navigate(`/invoices/${invoice.id}`)} className="text-credibee-blue-600 hover:text-credibee-blue-900">{t('view')}</button>
                                        <button onClick={() => navigate(`/invoices/edit/${invoice.id}`)} className="text-slate-600 hover:text-slate-900">{t('edit')}</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {filteredInvoices.length === 0 && <p className="text-center py-8 text-slate-500">{t('noInvoicesFound')}</p>}
            </div>
        </Card>
    );
};

export default Invoices;