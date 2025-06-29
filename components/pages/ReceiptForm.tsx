import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCredibee } from '../../hooks/useCredibee';
import { Receipt, ReceiptCategory, PaymentMethod } from '../../types';
import Card from '../common/Card';

const generateReceiptNumber = (receipts: Receipt[]): string => {
    const latestNumber = receipts.reduce((max, r) => {
        const numPart = parseInt(r.receiptNumber.replace('R-', ''), 10);
        return isNaN(numPart) ? max : (numPart > max ? numPart : max);
    }, 0);
    const nextNumber = latestNumber + 1;
    return `R-${nextNumber.toString().padStart(3, '0')}`;
}

const ReceiptForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useCredibee();
    const isEditing = id !== undefined;
    
    const [receipt, setReceipt] = useState<Omit<Receipt, 'id'>>({
        receiptNumber: '',
        from: '',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        category: ReceiptCategory.BusinessExpense,
        paymentMethod: PaymentMethod.GCash,
        notes: '',
        photoUrl: '',
    });

    useEffect(() => {
        if (isEditing) {
            const existingReceipt = state.receipts.find(r => r.id === id);
            if (existingReceipt) {
                // Prevent editing of income receipts
                if(existingReceipt.amount >= 0) {
                    navigate('/receipts');
                    return;
                }
                // Ensure amount is handled correctly for display (positive for form input)
                setReceipt({ ...existingReceipt, amount: Math.abs(existingReceipt.amount) });
            }
        } else {
            setReceipt(prev => ({
                ...prev,
                receiptNumber: generateReceiptNumber(state.receipts),
                category: ReceiptCategory.BusinessExpense, // Always default to expense
            }));
        }
    }, [id, isEditing, state.receipts, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setReceipt(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // All receipts from this form are expenses, so amount is always negative.
        const finalAmount = -Math.abs(Number(receipt.amount));
        const payload = { ...receipt, amount: finalAmount, category: ReceiptCategory.BusinessExpense };

        if (isEditing) {
            dispatch({ type: 'UPDATE_RECEIPT', payload: payload as Receipt });
        } else {
            dispatch({ type: 'ADD_RECEIPT', payload: { ...payload, id: `rec-${Date.now()}` } });
        }
        navigate('/receipts');
    };

    const isExpense = receipt.category === ReceiptCategory.BusinessExpense;

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-slate-800">{isEditing ? 'Edit Expense' : 'Create Expense'}</h1>
                 <div>
                     <button type="button" onClick={() => navigate('/receipts')} className="text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg mr-2">Back to Receipts</button>
                     <button type="submit" className="bg-credibee-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-credibee-primary-800 transition-colors">
                        {isEditing ? 'Update Expense' : 'Save Expense'}
                    </button>
                 </div>
            </div>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Column 1 */}
                    <div>
                        <label htmlFor="receiptNumber" className="block text-sm font-medium text-slate-700">Receipt #</label>
                        <input type="text" name="receiptNumber" id="receiptNumber" value={receipt.receiptNumber} readOnly className="mt-1 block w-full input bg-slate-100"/>
                    </div>
                     <div>
                        <label htmlFor="from" className="block text-sm font-medium text-slate-700">Client/Vendor</label>
                        <input type="text" name="from" id="from" value={receipt.from} onChange={handleInputChange} required placeholder="e.g., Office Supplies Co." className="mt-1 block w-full input"/>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
                        <select name="category" id="category" value={receipt.category} onChange={handleInputChange} className="mt-1 block w-full input bg-slate-100" disabled>
                           <option value={ReceiptCategory.BusinessExpense}>{ReceiptCategory.BusinessExpense}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Amount</label>
                         <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className={`font-bold ${isExpense ? 'text-red-500' : 'text-green-500'}`}>{isExpense ? '-' : '+'} ₱</span>
                            </div>
                            <input type="number" name="amount" id="amount" value={receipt.amount} onChange={handleInputChange} required min="0" step="0.01" className="block w-full input pl-12"/>
                        </div>
                    </div>
                    
                    {/* Column 2 */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-slate-700">Transaction Date</label>
                        <input type="date" name="date" id="date" value={receipt.date} onChange={handleInputChange} required className="mt-1 block w-full input"/>
                    </div>
                    <div>
                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700">Payment Method</label>
                        <select name="paymentMethod" id="paymentMethod" value={receipt.paymentMethod} onChange={handleInputChange} className="mt-1 block w-full input">
                           {Object.values(PaymentMethod).map(pm => <option key={pm} value={pm}>{pm}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Notes</label>
                        <textarea name="notes" id="notes" value={receipt.notes || ''} onChange={handleInputChange} rows={3} className="mt-1 block w-full input"></textarea>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="photoUrl" className="block text-sm font-medium text-slate-700">Photo Receipt</label>
                        <input type="text" name="photoUrl" id="photoUrl" value={receipt.photoUrl || ''} onChange={handleInputChange} placeholder="Enter photo URL" className="mt-1 block w-full input"/>
                         {receipt.photoUrl && <img src={receipt.photoUrl} alt="Receipt Preview" className="mt-4 h-32 w-auto rounded-lg object-contain border p-2"/>}
                    </div>
                </div>
            </Card>
             <style>{`.input { border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.5rem 0.75rem; } .input:focus { outline: 2px solid #52c1ff; border-color: #52c1ff }`}</style>
        </form>
    );
};

export default ReceiptForm;