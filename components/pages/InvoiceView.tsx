import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCredibee } from '../../hooks/useCredibee';
import Card from '../common/Card';
import { InvoiceStatus } from '../../types';

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
            if(newStatus === InvoiceStatus.Sent) showNotification('Invoice has been sent successfully!');
            if(newStatus === InvoiceStatus.Paid) showNotification('Invoice has been marked as paid!');
        }
    };


    if (!invoice) {
        return (
            <Card>
                <div className="text-center">
                    <h2 className="text-xl font-semibold">No Invoices Found</h2>
                    <p className="text-slate-500 mt-2">The invoice you are looking for does not exist.</p>
                    <button onClick={() => navigate('/invoices')} className="mt-4 bg-credibee-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-credibee-primary-800 transition-colors">
                        Back to Invoices
                    </button>
                </div>
            </Card>
        );
    }
    
    const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount;
    
    const paymentUrl = `${window.location.origin}/#/payment/${invoice.invoiceNumber}/${total}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(paymentUrl)}&qzone=1`;
    const feedbackUrl = `${window.location.origin}/#/feedback/${invoice.id}`;
    const feedbackQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(feedbackUrl)}&qzone=1`;
    const publicProfileUrl = `${window.location.origin}/#/public/${user.id}`;


    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                @media print {
                    .print-payment-section {
                        page-break-inside: avoid;
                        border: 1px solid #ccc !important;
                        background: #f9f9f9 !important;
                        margin: 20px 0 !important;
                        padding: 15px !important;
                    }
                    .print-feedback-section {
                        page-break-inside: avoid;
                        border: 1px solid #ccc !important;
                        background: #f9f9f9 !important;
                        margin: 20px 0 !important;
                        padding: 15px !important;
                    }
                    .print-qr-code {
                        max-width: 120px !important;
                        max-height: 120px !important;
                        border: 2px solid #666 !important;
                    }
                    .print-feedback-qr {
                        max-width: 90px !important;
                        max-height: 90px !important;
                        border: 2px solid #666 !important;
                        margin: 0 auto !important;
                    }
                    .print-url {
                        font-family: 'Courier New', monospace !important;
                        font-size: 10px !important;
                        word-break: break-all;
                        color: #000 !important;
                        border: 1px solid #ccc;
                        padding: 4px;
                        background: #fff;
                        border-radius: 3px;
                    }
                    .print-section-title {
                        font-size: 16px !important;
                        font-weight: bold !important;
                        margin-bottom: 10px !important;
                        color: #333 !important;
                    }
                }
            `}</style>
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 no-print gap-3">
                <button onClick={() => navigate('/invoices')} className="text-credibee-primary-700 font-semibold hover:underline self-start">
                    &larr; Back to Invoices
                </button>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => navigate(`/invoices/edit/${invoice.id}`)} className="bg-white border border-slate-300 text-slate-800 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors">Edit</button>
                    <button onClick={() => window.print()} className="bg-slate-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-slate-700 transition-colors">Print</button>
                    {invoice.status === 'Draft' && <button onClick={() => handleStatusChange(InvoiceStatus.Sent)} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors">Send</button>}
                    {invoice.status !== 'Paid' && <button onClick={() => handleStatusChange(InvoiceStatus.Paid)} className="bg-credibee-accent-500 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-credibee-accent-600 transition-colors">Mark Paid</button>}
                </div>
            </div>
             {notification && <div className="mb-4 p-3 text-center bg-green-100 text-green-800 rounded-lg">{notification}</div>}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200" id="invoice-wrapper">
                <div className="p-4 sm:p-8 md:p-12" id="invoice-content">
                    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 sm:mb-12 gap-6">
                        <div className="min-w-0 flex-1">
                            {user.businessLogoUrl && <img src={user.businessLogoUrl} alt="Business Logo" className="h-12 sm:h-16 mb-4"/>}
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 break-words">{user.businessName}</h1>
                            <p className="text-slate-500 text-sm sm:text-base break-words">{user.businessAddress}</p>
                             <p className="text-slate-500 text-sm sm:text-base">TIN: {user.tin}</p>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                            <h2 className="text-2xl sm:text-4xl font-bold uppercase text-slate-400">Invoice</h2>
                            <p className="text-slate-500 text-sm sm:text-base"># {invoice.invoiceNumber}</p>
                        </div>
                    </header>

                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Billed To</h3>
                            <p className="font-bold text-slate-800 break-words">{invoice.clientName}</p>
                            <p className="text-slate-600 break-words">{invoice.clientEmail}</p>
                        </div>
                        <div className="text-left sm:text-right space-y-2">
                             <div>
                                <p className="text-sm font-semibold text-slate-500">Issue Date</p>
                                <p className="font-medium text-slate-800">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500">Due Date</p>
                                <p className="font-medium text-slate-800">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8 sm:mb-12">
                        <div className="hidden sm:block">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="p-3 text-sm font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                                        <th className="p-3 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">Qty</th>
                                        <th className="p-3 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">Price</th>
                                        <th className="p-3 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">Total</th>
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
                        </div>
                        <div className="block sm:hidden space-y-4">
                            {invoice.items.map(item => (
                                <div key={item.id} className="bg-slate-50 p-4 rounded-lg">
                                    <div className="font-medium text-slate-800 mb-2 break-words">{item.description}</div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-slate-500">Qty:</span>
                                            <span className="ml-1 font-medium">{item.quantity}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">Price:</span>
                                            <span className="ml-1 font-medium">₱{item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-slate-500">Total:</span>
                                            <span className="ml-1 font-bold">₱{(item.quantity * item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    <section className="flex justify-end mb-8 sm:mb-12">
                        <div className="w-full sm:max-w-sm">
                            <div className="flex justify-between text-slate-600 py-2 text-sm sm:text-base">
                                <span>Subtotal</span>
                                <span>₱{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                             <div className="flex justify-between text-slate-600 py-2 text-sm sm:text-base">
                                <span>Tax ({invoice.taxRate}%)</span>
                                <span>₱{taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                             <div className="flex justify-between font-bold text-slate-900 text-lg sm:text-xl border-t-2 border-slate-300 mt-2 pt-2">
                                <span>Total</span>
                                <span>₱{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>
                    </section>

                    {(invoice.status === InvoiceStatus.Sent || invoice.status === InvoiceStatus.Overdue) && (
                        <section className="my-12 p-6 bg-credibee-primary-50 rounded-lg border border-credibee-primary-200 print-payment-section">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 print-section-title">Pay Now</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center print:gap-4">
                                <div className="text-center print:text-left order-2 sm:order-1">
                                    <img src={qrCodeUrl} alt="Payment QR Code" className="w-32 h-32 sm:w-40 sm:h-40 mx-auto border-4 border-white rounded-lg shadow-md print-qr-code" />
                                    <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium print:text-xs print:mt-1">Scan to pay</p>
                                </div>
                                <div className="space-y-4 text-center sm:text-left print:space-y-2 print:text-left order-1 sm:order-2">
                                    <button 
                                        onClick={() => navigate(`/payment/${invoice.invoiceNumber}/${total}`)}
                                        className="inline-block w-full sm:w-auto bg-credibee-primary-700 text-white px-6 sm:px-8 py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-credibee-primary-800 transition-colors cursor-pointer print:bg-gray-800 print:px-4 print:py-2 print:text-sm print:rounded print:pointer-events-none"
                                    >
                                        Pay ₱{total.toLocaleString(undefined, {minimumFractionDigits: 0})}
                                    </button>
                                    <p className="text-xs text-slate-500 mt-4 print:mt-2 print:text-xs">Or pay with this link:</p>
                                    <div className="text-xs text-credibee-primary-600 break-all print-url">
                                        {paymentUrl}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {(invoice.status === InvoiceStatus.Sent || invoice.status === InvoiceStatus.Overdue || invoice.status === InvoiceStatus.Paid) && (
                        <section className="my-8 sm:my-12 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 text-center print-feedback-section print:text-left">
                            <div className="text-2xl sm:text-4xl mb-2 sm:mb-4 print:text-2xl print:mb-2 print:inline-block print:mr-2">⭐</div>
                            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2 print-section-title print:inline-block print:mb-1">Share Your Experience</h3>
                            <p className="text-slate-600 mb-4 text-sm sm:text-base print:text-sm print:mb-2">Your feedback helps us improve our services</p>
                            <div className="mb-4 sm:hidden">
                                <p className="text-xs text-slate-500 mb-2">Feedback Link:</p>
                                <div className="bg-slate-100 p-3 rounded text-xs text-credibee-primary-600 break-all overflow-hidden">
                                    {feedbackUrl}
                                </div>
                            </div>
                            <div className="print:grid print:grid-cols-2 print:gap-4 print:items-center">
                                <div className="print:text-center">
                                    <img src={feedbackQrCodeUrl} alt="Feedback QR Code" className="hidden print:block print-feedback-qr" />
                                    <p className="hidden print:block print:text-xs print:mt-1">Scan for feedback</p>
                                </div>
                                <div className="hidden print:block print:border print:border-gray-400 print:p-2 print:rounded">
                                    <span className="print:text-sm print:font-semibold print:block print:mb-1">Feedback Link:</span>
                                    <span className="print-url">
                                        {feedbackUrl}
                                    </span>
                                </div>
                            </div>
                            <a 
                                href={`${window.location.origin}/#/feedback/${invoice.id}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 sm:px-8 py-3 rounded-lg text-sm sm:text-base font-semibold hover:from-green-600 hover:to-blue-600 transition-all hover:scale-105 shadow-lg print:hidden"
                            >
                                ✍️ Leave Feedback
                            </a>
                        </section>
                    )}

                    {invoice.notes && (
                         <section className="mb-6 sm:mb-8">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Notes and Terms</h3>
                            <p className="text-slate-600 text-sm break-words">{invoice.notes}</p>
                        </section>
                    )}

                    <footer className="text-center text-slate-500 text-sm">
                        <div className={`inline-block px-4 py-2 rounded-lg border ${getStatusColorClasses(invoice.status)} mb-4 font-semibold`}>
                           Status: {invoice.status}
                        </div>
                        <p>Thank you for your business!</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default InvoiceView;