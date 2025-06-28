
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/pages/Dashboard';
import Invoices from './components/pages/Invoices';
import Receipts from './components/pages/Receipts';
import Feedback from './components/pages/Feedback';
import Profile from './components/pages/Profile';
import PublicProfile from './components/pages/PublicProfile';
import InvoiceView from './components/pages/InvoiceView';
import InvoiceForm from './components/pages/InvoiceForm';
import ReceiptView from './components/pages/ReceiptView';
import ReceiptForm from './components/pages/ReceiptForm';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/new" element={<InvoiceForm />} />
          <Route path="invoices/edit/:id" element={<InvoiceForm />} />
          <Route path="invoices/:id" element={<InvoiceView />} />
          <Route path="receipts" element={<Receipts />} />
          <Route path="receipts/new" element={<ReceiptForm />} />
          <Route path="receipts/edit/:id" element={<ReceiptForm />} />
          <Route path="receipts/:id" element={<ReceiptView />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/public/:userId" element={<PublicProfile />} />
      </Routes>
    </HashRouter>
  );
};

export default App;