import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCredibee } from '../../hooks/useCredibee';
import Card from '../common/Card';

const Payment: React.FC = () => {
    const { invoiceId, amount } = useParams();
    const navigate = useNavigate();
    const { state } = useCredibee();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardholderName, setCardholderName] = useState('');

    const invoice = state.invoices.find(inv => inv.invoiceNumber === invoiceId);
    const paymentAmount = amount ? parseFloat(amount) : 0;

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Demo Payment System: This is a non-functional payment interface for demonstration purposes only. No actual payment will be processed.');
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\D/g, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Payment</h1>
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg text-sm">
                        <strong>Demo Mode:</strong> This is a non-functional payment interface
                    </div>
                </div>

                <Card>
                    <div className="p-6">
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Payment Details</h3>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Invoice #:</span>
                                <span className="font-medium">{invoiceId}</span>
                            </div>
                            {invoice && (
                                <>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Billed To:</span>
                                        <span className="font-medium">{invoice.clientName}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Business:</span>
                                        <span className="font-medium">{state.user.businessName}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
                                <span>Total Amount:</span>
                                <span className="text-green-600">₱{paymentAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
                            <div className="space-y-3">
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={selectedPaymentMethod === 'card'}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        className="mr-3"
                                    />
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-500 rounded mr-3 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">💳</span>
                                        </div>
                                        <span className="font-medium">Credit/Debit Card</span>
                                    </div>
                                </label>
                                
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="gcash"
                                        checked={selectedPaymentMethod === 'gcash'}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        className="mr-3"
                                    />
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">G</span>
                                        </div>
                                        <span className="font-medium">GCash</span>
                                    </div>
                                </label>

                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="paymaya"
                                        checked={selectedPaymentMethod === 'paymaya'}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        className="mr-3"
                                    />
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-green-500 rounded mr-3 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">P</span>
                                        </div>
                                        <span className="font-medium">PayMaya</span>
                                    </div>
                                </label>

                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="bank"
                                        checked={selectedPaymentMethod === 'bank'}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        className="mr-3"
                                    />
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-purple-500 rounded mr-3 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">🏦</span>
                                        </div>
                                        <span className="font-medium">Bank Transfer</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {selectedPaymentMethod === 'card' && (
                            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={cardholderName}
                                        onChange={(e) => setCardholderName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                                            placeholder="123"
                                            maxLength={4}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6"
                                >
                                    Pay ₱{paymentAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </button>
                            </form>
                        )}

                        {selectedPaymentMethod && selectedPaymentMethod !== 'card' && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📱</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                    {selectedPaymentMethod === 'gcash' && 'GCash Payment'}
                                    {selectedPaymentMethod === 'paymaya' && 'PayMaya Payment'}
                                    {selectedPaymentMethod === 'bank' && 'Bank Transfer'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    You will be redirected to complete your payment securely.
                                </p>
                                <button
                                    onClick={handlePaymentSubmit}
                                    className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        )}

                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                                <span className="text-green-500 mr-2">🔒</span>
                                <span className="text-sm text-green-800">
                                    Your payment information is secured with 256-bit SSL encryption
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                                ← Back to Invoice
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Payment;