
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCredibee } from '../../hooks/useCredibee';
import { Invoice, InvoiceItem, InvoiceStatus } from '../../types';
import Card from '../common/Card';
import { useTranslation } from '../../utils/localization';

const generateInvoiceNumber = (invoices: Invoice[]): string => {
    const currentYear = new Date().getFullYear();
    const yearPrefix = `CB-${currentYear}-`;

    const invoicesThisYear = invoices.filter(inv => inv.invoiceNumber.startsWith(yearPrefix));
    
    if (invoicesThisYear.length === 0) {
        return `${yearPrefix}0001`;
    }

    const latestNumber = invoicesThisYear.reduce((max, inv) => {
        const numPart = parseInt(inv.invoiceNumber.replace(yearPrefix, ''), 10);
        return isNaN(numPart) ? max : (numPart > max ? numPart : max);
    }, 0);

    const nextNumber = latestNumber + 1;
    return `${yearPrefix}${nextNumber.toString().padStart(4, '0')}`;
}

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);


const InvoiceForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useCredibee();
    const t = useTranslation();
    const isEditing = id !== undefined;
    
    const [invoice, setInvoice] = useState<Omit<Invoice, 'id'>>({
        invoiceNumber: '',
        clientName: '',
        clientEmail: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        items: [{ id: `item-${Date.now()}`, description: '', quantity: 1, price: 0 }],
        taxRate: 12,
        status: InvoiceStatus.Draft,
        notes: 'Thank you for your business!'
    });

    useEffect(() => {
        if (isEditing) {
            const existingInvoice = state.invoices.find(inv => inv.id === id);
            if (existingInvoice) {
                setInvoice(existingInvoice);
            }
        } else {
            setInvoice(prev => ({
                ...prev,
                invoiceNumber: generateInvoiceNumber(state.invoices)
            }));
        }
    }, [id, isEditing, state.invoices]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInvoice(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...invoice.items];
        const item = newItems[index];
        (item[field] as any) = value;
        setInvoice(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setInvoice(prev => ({
            ...prev,
            items: [...prev.items, { id: `item-${Date.now()}`, description: '', quantity: 1, price: 0 }]
        }));
    };

    const removeItem = (index: number) => {
        if (invoice.items.length > 1) {
            const newItems = invoice.items.filter((_, i) => i !== index);
            setInvoice(prev => ({ ...prev, items: newItems }));
        }
    };
    
    const { subtotal, taxAmount, total } = useMemo(() => {
        const subtotal = invoice.items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);
        const taxAmount = subtotal * (invoice.taxRate / 100);
        const total = subtotal + taxAmount;
        return { subtotal, taxAmount, total };
    }, [invoice.items, invoice.taxRate]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            dispatch({ type: 'UPDATE_INVOICE', payload: invoice as Invoice });
        } else {
            dispatch({ type: 'ADD_INVOICE', payload: { ...invoice, id: `inv-${Date.now()}` } });
        }
        navigate('/invoices');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-slate-800">{isEditing ? t('editInvoice') : t('createInvoice')}</h1>
                 <div>
                     <button type="button" onClick={() => navigate('/invoices')} className="text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg mr-2">{t('backToInvoices')}</button>
                     <button type="submit" className="bg-credibee-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-credibee-primary-800 transition-colors">
                        {isEditing ? t('updateInvoice') : t('saveInvoice')}
                    </button>
                 </div>
            </div>

            <div className="space-y-8">
                {/* Client Info & Invoice Details */}
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('clientInfo')}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="clientName" className="block text-sm font-medium text-slate-700">{t('clientName')}</label>
                                    <input type="text" name="clientName" id="clientName" value={invoice.clientName} onChange={handleInputChange} required className="mt-1 block w-full input"/>
                                </div>
                                <div>
                                    <label htmlFor="clientEmail" className="block text-sm font-medium text-slate-700">{t('clientEmail')}</label>
                                    <input type="email" name="clientEmail" id="clientEmail" value={invoice.clientEmail} onChange={handleInputChange} required className="mt-1 block w-full input"/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('invoiceDetails')}</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="invoiceNumber" className="block text-sm font-medium text-slate-700">{t('invoiceNo')}</label>
                                        <input type="text" name="invoiceNumber" id="invoiceNumber" value={invoice.invoiceNumber} readOnly className="mt-1 block w-full input bg-slate-100"/>
                                    </div>
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-slate-700">{t('status')}</label>
                                        <select name="status" id="status" value={invoice.status} onChange={e => setInvoice(p => ({...p, status: e.target.value as InvoiceStatus}))} className="mt-1 block w-full input">
                                            {Object.values(InvoiceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="issueDate" className="block text-sm font-medium text-slate-700">{t('issueDate')}</label>
                                        <input type="date" name="issueDate" id="issueDate" value={invoice.issueDate} onChange={handleInputChange} required className="mt-1 block w-full input"/>
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">{t('dueDate')}</label>
                                        <input type="date" name="dueDate" id="dueDate" value={invoice.dueDate} onChange={handleInputChange} required className="mt-1 block w-full input"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Items */}
                <Card title={t('items')}>
                     <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="text-left text-sm font-medium text-slate-500 pb-2 w-2/4">{t('description')}</th>
                                    <th className="text-left text-sm font-medium text-slate-500 pb-2">{t('quantity')}</th>
                                    <th className="text-left text-sm font-medium text-slate-500 pb-2">{t('price')}</th>
                                    <th className="text-left text-sm font-medium text-slate-500 pb-2">{t('total')}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td><input type="text" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} required className="w-full input my-1"/></td>
                                        <td><input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} required className="w-full input my-1" min="0"/></td>
                                        <td><input type="number" value={item.price} onChange={e => handleItemChange(index, 'price', Number(e.target.value))} required className="w-full input my-1" min="0" step="0.01"/></td>
                                        <td className="px-2">₱{((Number(item.quantity) || 0) * (Number(item.price) || 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        <td>
                                            <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2">
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button type="button" onClick={addItem} className="mt-4 bg-credibee-primary-100 text-credibee-primary-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-credibee-primary-200 transition-colors">{t('addItem')}</button>
                </Card>

                {/* Notes and Totals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card title={t('notesAndTerms')}>
                        <textarea name="notes" value={invoice.notes} onChange={handleInputChange} rows={6} className="w-full input"></textarea>
                    </Card>
                     <Card>
                        <div className="space-y-4">
                            <div className="flex justify-between text-slate-600">
                                <span>{t('subtotal')}</span>
                                <span>₱{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>{t('tax')}</span>
                                <span>₱{taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="border-t my-2"></div>
                            <div className="flex justify-between text-xl font-bold text-slate-900">
                                <span>{t('total')}</span>
                                <span>₱{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>
                     </Card>
                </div>
            </div>
             <style>{`.input { border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.5rem 0.75rem; } .input:focus { outline: 2px solid #52c1ff; border-color: #52c1ff }`}</style>
        </form>
    );
};

export default InvoiceForm;
