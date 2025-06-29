import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCredibee } from '../../hooks/useCredibee';
import Card from '../common/Card';
import { InvoiceStatus } from '../../types';
import { useTranslation } from '../../utils/localization';

const getStatusColorClasses = (status: InvoiceStatus) => {
    switch (status) {
        case InvoiceStatus.Paid: return 'bg-green-100 text-green-800 border-green-300';
        case InvoiceStatus.Overdue: return 'bg-red-100 text-red-800 border-red-300';
        case InvoiceStatus.Sent: return 'bg-blue-100 text-blue-800 border-blue-300';
        default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
}

const InvoiceView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useCredibee();
    const t = useTranslation();
    const { user } = state;

    const [notification, setNotification] = useState('');

    const invoice = state.invoices.find(inv => inv.id === id);
    
    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    }

    const handleStatusChange = (newStatus: InvoiceStatus) => {
        if (invoice) {
            dispatch({ type: 'UPDATE_INVOICE', payload: { ...invoice, status: newStatus } });
            if(newStatus === InvoiceStatus.Sent) showNotification(t('invoiceSent'));
            if(newStatus === InvoiceStatus.Paid) showNotification(t('invoicePaid'));
        }
    };


    if (!invoice) {
        return (
            <Card>
                <div className="text-center">
                    <h2 className="text-xl font-semibold">{t('noInvoicesFound')}</h2>
                    <p className="text-slate-500 mt-2">The invoice you are looking for does not exist.</p>
                    <button onClick={() => navigate('/invoices')} className="mt-4 bg-credibee-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-credibee-blue-800 transition-colors">
                        {t('backToInvoices')}
                    </button>
                </div>
            </Card>
        );
    }
    
    const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount;
    
    const paymentUrl = `https://pay.credibee.ph/dummy-payment?invoiceId=${invoice.invoiceNumber}&amount=${total}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(paymentUrl)}&qzone=1`;
    const publicProfileUrl = `${window.location.origin}/#/public/${user.id}`;


    return (
        <div className="max-w-4xl mx-auto">
             <div className="flex justify-between items-center mb-4 no-print">
                <button onClick={() => navigate('/invoices')} className="text-credibee-blue-700 font-semibold hover:underline">
                    &larr; {t('backToInvoices')}
                </button>
                <div className="flex gap-2">
                    <button onClick={() => navigate(`/invoices/edit/${invoice.id}`)} className="bg-white border border-slate-300 text-slate-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">{t('edit')}</button>
                    <button onClick={() => window.print()} className="bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors">{t('printOrSave')}</button>
                    {invoice.status === 'Draft' && <button onClick={() => handleStatusChange(InvoiceStatus.Sent)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">{t('sendEmail')}</button>}
                    {invoice.status !== 'Paid' && <button onClick={() => handleStatusChange(InvoiceStatus.Paid)} className="bg-credibee-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors">{t('markAsPaid')}</button>}
                </div>
            </div>
             {notification && <div className="mb-4 p-3 text-center bg-green-100 text-green-800 rounded-lg">{notification}</div>}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200" id="invoice-wrapper">
                <div className="p-8 md:p-12" id="invoice-content">
                    <header className="flex justify-between items-start mb-12">
                        <div>
                            {user.businessLogoUrl && <img src={user.businessLogoUrl} alt="Business Logo" className="h-16 mb-4"/>}
                            <h1 className="text-3xl font-bold text-slate-900">{user.businessName}</h1>
                            <p className="text-slate-500 max-w-xs">{user.businessAddress}</p>
                             <p className="text-slate-500">TIN: {user.tin}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-4xl font-bold uppercase text-slate-400">{t('invoice')}</h2>
                            <p className="text-slate-500"># {invoice.invoiceNumber}</p>
                        </div>
                    </header>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('billedTo')}</h3>
                            <p className="font-bold text-slate-800">{invoice.clientName}</p>
                            <p className="text-slate-600">{invoice.clientEmail}</p>
                        </div>
                        <div className="text-left md:text-right space-y-2">
                             <div>
                                <p className="text-sm font-semibold text-slate-500">{t('issueDate')}</p>
                                <p className="font-medium text-slate-800">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500">{t('dueDate')}</p>
                                <p className="font-medium text-slate-800">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-slate-600 uppercase tracking-wider">{t('description')}</th>
                                    <th className="p-3 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">{t('quantity')}</th>
                                    <th className="p-3 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">{t('price')}</th>
                                    <th className="p-3 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">{t('total')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoice.items.map(item => (
                                    <tr key={item.id}>
                                        <td className="p-3 pr-2">{item.description}</td>
                                        <td className="p-3 text-right">{item.quantity}</td>
                                        <td className="p-3 text-right">₱{item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        <td className="p-3 text-right font-medium">₱{(item.quantity * item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                    
                    <section className="flex justify-end mb-12">
                        <div className="w-full max-w-sm">
                            <div className="flex justify-between text-slate-600 py-2">
                                <span>{t('subtotal')}</span>
                                <span>₱{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                             <div className="flex justify-between text-slate-600 py-2">
                                <span>{t('tax')} ({invoice.taxRate}%)</span>
                                <span>₱{taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                             <div className="flex justify-between font-bold text-slate-900 text-xl border-t-2 border-slate-300 mt-2 pt-2">
                                <span>{t('total')}</span>
                                <span>₱{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>
                    </section>

                    {(invoice.status === InvoiceStatus.Sent || invoice.status === InvoiceStatus.Overdue) && (
                        <section className="my-12 p-6 bg-credibee-blue-50 rounded-lg border border-credibee-blue-200 no-print">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('payNow')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div className="text-center">
                                    <img src={qrCodeUrl} alt="Payment QR Code" className="w-40 h-40 mx-auto border-4 border-white rounded-lg shadow-md" />
                                    <p className="text-sm text-slate-600 mt-2 font-medium">{t('scanToPay')}</p>
                                </div>
                                <div className="space-y-4 text-center md:text-left">
                                    <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full md:w-auto bg-credibee-blue-700 text-white px-8 py-3 rounded-lg text-base font-bold hover:bg-credibee-blue-800 transition-transform hover:scale-105">
                                        {t('payNow')} ₱{total.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </a>
                                    <p className="text-xs text-slate-500 mt-4">{t('orPayWithLink')}</p>
                                    <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-credibee-blue-600 hover:underline break-all">
                                        {paymentUrl}
                                    </a>
                                </div>
                            </div>
                        </section>
                    )}

                    {(invoice.status === InvoiceStatus.Sent || invoice.status === InvoiceStatus.Overdue || invoice.status === InvoiceStatus.Paid) && (
                        <section className="my-12 p-6 bg-slate-50 rounded-lg border border-slate-200 text-center no-print">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('leaveReviewPrompt')}</h3>
                            <a 
                                href={publicProfileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block bg-credibee-green-500 text-white px-6 py-2 rounded-lg text-base font-semibold hover:bg-green-600 transition-transform hover:scale-105"
                            >
                                {t('leaveReviewAction')}
                            </a>
                        </section>
                    )}

                    {invoice.notes && (
                         <section className="mb-8">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('notesAndTerms')}</h3>
                            <p className="text-slate-600 text-sm">{invoice.notes}</p>
                        </section>
                    )}

                    <footer className="text-center text-slate-500 text-sm">
                        <div className={`inline-block px-4 py-2 rounded-lg border ${getStatusColorClasses(invoice.status)} mb-4 font-semibold`}>
                           {t('status')}: {invoice.status}
                        </div>
                        <p>Thank you for your business!</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default InvoiceView;