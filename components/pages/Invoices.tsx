import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCredibee } from '../../hooks/useCredibee';
import { Invoice, InvoiceStatus } from '../../types';
import Card from '../common/Card';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredInvoices = state.invoices.filter(invoice => {
        const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    }).sort((a,b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

    return (
        <Card title="All Invoices" action={
            <button onClick={() => navigate('/invoices/new')} className="bg-credibee-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-credibee-primary-800 transition-colors">
                Create Invoice
            </button>
        }>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by client name or invoice number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-credibee-primary-500"
                />
                 <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-credibee-primary-500 bg-white"
                 >
                    <option value="All">All Statuses</option>
                    {Object.values(InvoiceStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                 </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Invoice #</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Client Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Due Date</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Total</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredInvoices.map((invoice) => {
                            const total = invoice.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * (1 + invoice.taxRate / 100);
                            return (
                                <tr key={invoice.id} className="hover:bg-slate-50 align-middle">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 align-middle">{invoice.invoiceNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 align-middle">{invoice.clientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 align-middle">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right align-middle">₱{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm align-middle">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)} whitespace-nowrap`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right align-middle">
                                        <div className="inline-flex gap-2">
                                            <button onClick={() => navigate(`/invoices/${invoice.id}`)} className="text-credibee-primary-600 hover:text-credibee-primary-900 whitespace-nowrap">View</button>
                                            <button onClick={() => navigate(`/invoices/edit/${invoice.id}`)} className="text-slate-600 hover:text-slate-900 whitespace-nowrap">Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {filteredInvoices.length === 0 && <p className="text-center py-8 text-slate-500">No invoices found matching your criteria.</p>}
            </div>
        </Card>
    );
};

export default Invoices;