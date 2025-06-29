import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCredibee } from '../../hooks/useCredibee';
import { Invoice, InvoiceItem, InvoiceStatus } from '../../types';
import Card from '../common/Card';

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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                 <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{isEditing ? 'Edit Invoice' : 'Create Invoice'}</h1>
                 <div className="flex flex-col sm:flex-row gap-2">
                     <button type="button" onClick={() => navigate('/invoices')} className="text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg text-sm sm:text-base">Back to Invoices</button>
                     <button type="submit" className="bg-credibee-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-credibee-primary-800 transition-colors text-sm sm:text-base">
                        {isEditing ? 'Update Invoice' : 'Save Invoice'}
                    </button>
                 </div>
            </div>

            <div className="space-y-8">
                {/* Client Info & Invoice Details */}
                <Card>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Client Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="clientName" className="block text-sm font-medium text-slate-700">Client Name</label>
                                    <input type="text" name="clientName" id="clientName" value={invoice.clientName} onChange={handleInputChange} required className="mt-1 block w-full input"/>
                                </div>
                                <div>
                                    <label htmlFor="clientEmail" className="block text-sm font-medium text-slate-700">Client Email</label>
                                    <input type="email" name="clientEmail" id="clientEmail" value={invoice.clientEmail} onChange={handleInputChange} required className="mt-1 block w-full input"/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Invoice Details</h3>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="invoiceNumber" className="block text-sm font-medium text-slate-700">Invoice #</label>
                                        <input type="text" name="invoiceNumber" id="invoiceNumber" value={invoice.invoiceNumber} readOnly className="mt-1 block w-full input bg-slate-100"/>
                                    </div>
                                    <div className="sm:w-32">
                                        <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
                                        <select name="status" id="status" value={invoice.status} onChange={e => setInvoice(p => ({...p, status: e.target.value as InvoiceStatus}))} className="mt-1 block w-full input">
                                            {Object.values(InvoiceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="issueDate" className="block text-sm font-medium text-slate-700">Issue Date</label>
                                        <input type="date" name="issueDate" id="issueDate" value={invoice.issueDate} onChange={handleInputChange} required className="mt-1 block w-full input"/>
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">Due Date</label>
                                        <input type="date" name="dueDate" id="dueDate" value={invoice.dueDate} onChange={handleInputChange} required className="mt-1 block w-full input"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Items */}
                <Card title="Items">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left text-sm font-medium text-slate-500 pb-2 w-2/4">Description</th>
                                        <th className="text-left text-sm font-medium text-slate-500 pb-2">Quantity</th>
                                        <th className="text-left text-sm font-medium text-slate-500 pb-2">Price</th>
                                        <th className="text-left text-sm font-medium text-slate-500 pb-2">Total</th>
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
                    </div>
                    
                    {/* Mobile Card View */}
                    <div className="block lg:hidden space-y-4">
                        {invoice.items.map((item, index) => (
                            <div key={item.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-sm font-medium text-slate-600">Item {index + 1}</h4>
                                    <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1" disabled={invoice.items.length === 1}>
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                                        <input 
                                            type="text" 
                                            value={item.description} 
                                            onChange={e => handleItemChange(index, 'description', e.target.value)} 
                                            required 
                                            className="w-full input text-sm"
                                            placeholder="Enter item description"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">Quantity</label>
                                            <input 
                                                type="number" 
                                                value={item.quantity} 
                                                onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} 
                                                required 
                                                className="w-full input text-sm" 
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">Price</label>
                                            <input 
                                                type="number" 
                                                value={item.price} 
                                                onChange={e => handleItemChange(index, 'price', Number(e.target.value))} 
                                                required 
                                                className="w-full input text-sm" 
                                                min="0" 
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-600">Total:</span>
                                            <span className="text-lg font-bold text-slate-800">₱{((Number(item.quantity) || 0) * (Number(item.price) || 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button type="button" onClick={addItem} className="mt-4 w-full sm:w-auto bg-credibee-primary-100 text-credibee-primary-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-credibee-primary-200 transition-colors">Add Item</button>
                </Card>

                {/* Notes and Totals */}
                <Card title="Notes and Terms">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                            <textarea 
                                name="notes" 
                                value={invoice.notes || ''} 
                                onChange={handleInputChange} 
                                rows={6} 
                                className="w-full input" 
                                placeholder="Payment terms, thank you message, etc."
                            ></textarea>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span>Subtotal</span>
                                    <span>₱{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm sm:text-base">
                                    <span>Tax Rate</span>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number" 
                                            value={invoice.taxRate} 
                                            onChange={e => setInvoice(p => ({...p, taxRate: Number(e.target.value)}))} 
                                            className="w-16 sm:w-20 input text-right text-sm" 
                                            min="0" 
                                            max="100" 
                                            step="0.1"
                                        />
                                        <span>%</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span>Tax Amount</span>
                                    <span>₱{taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg sm:text-xl border-t border-slate-200 pt-4">
                                    <span>Total</span>
                                    <span>₱{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <style>{`.input { border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; } .input:focus { outline: 2px solid #52c1ff; border-color: #52c1ff } @media (min-width: 640px) { .input { font-size: 1rem; } }`}</style>
        </form>
    );
};

export default InvoiceForm;
