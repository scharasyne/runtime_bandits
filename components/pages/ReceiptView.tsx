import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCredibee } from '../../hooks/useCredibee';
import { useTranslation } from '../../utils/localization';

const ReceiptView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useCredibee();
    const t = useTranslation();
    const { user } = state;

    const receipt = state.receipts.find(rec => rec.id === id);

    if (!receipt) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold">{t('noReceiptsFound')}</h2>
                <p className="text-slate-500 mt-2">The receipt you are looking for does not exist.</p>
                <button onClick={() => navigate('/receipts')} className="mt-4 bg-credibee-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-credibee-primary-800 transition-colors">
                    {t('backToReceipts')}
                </button>
            </div>
        );
    }
    
    const isIncome = receipt.amount >= 0;

    return (
        <div className="max-w-2xl mx-auto">
             <div className="flex justify-between items-center mb-4 no-print">
                <button onClick={() => navigate('/receipts')} className="text-credibee-primary-700 font-semibold hover:underline">
                    &larr; {t('backToReceipts')}
                </button>
                <div className="flex gap-2">
                    {!isIncome && (
                        <button onClick={() => navigate(`/receipts/edit/${receipt.id}`)} className="bg-white border border-slate-300 text-slate-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">{t('edit')}</button>
                    )}
                    <button onClick={() => window.print()} className="bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors">{t('printOrSave')}</button>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-slate-200" id="invoice-wrapper">
                <div className="p-8 md:p-10" id="invoice-content">
                    <header className="flex justify-between items-start mb-10">
                        <div>
                            {user.businessLogoUrl && <img src={user.businessLogoUrl} alt="Business Logo" className="h-12 mb-2"/>}
                            <h1 className="text-2xl font-bold text-slate-900">{user.businessName}</h1>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-bold uppercase text-slate-400">{t('receipt')}</h2>
                            <p className="text-slate-500"># {receipt.receiptNumber}</p>
                        </div>
                    </header>

                    <div className={`text-center mb-8 p-4 rounded-lg border ${isIncome ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <p className={`text-sm uppercase font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                            {isIncome ? 'Income' : 'Expense'}
                        </p>
                         <p className={`text-4xl font-bold ${isIncome ? 'text-green-700' : 'text-red-700'}`}>
                            ₱{Math.abs(receipt.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </p>
                    </div>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{isIncome ? t('receivedFrom') : t('paidTo')}</h3>
                            <p className="font-bold text-slate-800">{receipt.from}</p>
                        </div>
                        <div className="space-y-3">
                             <div>
                                <p className="text-sm font-semibold text-slate-500">{t('transactionDate')}</p>
                                <p className="font-medium text-slate-800">{new Date(receipt.date).toLocaleDateString()}</p>
                            </div>
                             <div>
                                <p className="text-sm font-semibold text-slate-500">{t('paymentMethod')}</p>
                                <p className="font-medium text-slate-800">{receipt.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500">{t('category')}</p>
                                <p className="font-medium text-slate-800">{receipt.category}</p>
                            </div>
                        </div>
                    </section>

                    {receipt.notes && (
                        <section className="mb-8">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('notes')}</h3>
                            <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-md">{receipt.notes}</p>
                        </section>
                    )}
                    
                    {receipt.photoUrl && (
                        <section className="mb-8">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('photoReceipt')}</h3>
                            <div className="border rounded-lg p-2">
                                <img src={receipt.photoUrl} alt="Physical receipt" className="max-w-full max-h-96 mx-auto rounded-md object-contain" />
                            </div>
                        </section>
                    )}

                    <footer className="text-center text-slate-500 text-sm pt-8 border-t mt-8">
                        <p>This is a system-generated receipt.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ReceiptView;