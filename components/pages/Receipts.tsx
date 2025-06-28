
import React, { useState } from 'react';
import { useCredibee } from '../../hooks/useCredibee';
import { ReceiptCategory } from '../../types';
import Card from '../common/Card';
import { useTranslation } from '../../utils/localization';

const Receipts: React.FC = () => {
    const { state } = useCredibee();
    const t = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredReceipts = state.receipts.filter(receipt =>
        receipt.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <Card title="All Receipts & Expenses" action={
            <button className="bg-credibee-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-credibee-blue-800 transition-colors">
                Create Receipt
            </button>
        }>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by source or receipt #"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-credibee-blue-500"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">From/To</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredReceipts.map((receipt) => (
                            <tr key={receipt.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(receipt.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{receipt.from}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{receipt.category}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${receipt.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {receipt.amount > 0 ? '+' : ''}₱{receipt.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-credibee-blue-600 hover:text-credibee-blue-900">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredReceipts.length === 0 && <p className="text-center py-8 text-slate-500">No receipts found.</p>}
            </div>
        </Card>
    );
};

export default Receipts;
