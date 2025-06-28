
export interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
  avatarUrl: string;
  businessLogoUrl?: string;
  businessAddress?: string;
  tin?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export enum InvoiceStatus {
  Draft = 'Draft',
  Sent = 'Sent',
  Paid = 'Paid',
  Overdue = 'Overdue',
}

export interface Invoice {
  id:string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number; // as percentage
  status: InvoiceStatus;
  notes?: string;
}

export enum ReceiptCategory {
  ProductSale = 'Product Sale',
  ServiceFee = 'Service Fee',
  BusinessExpense = 'Business Expense',
  Other = 'Other',
}

export enum PaymentMethod {
    BankTransfer = 'Bank Transfer',
    GCash = 'GCash',
    PayMaya = 'PayMaya',
    Cash = 'Cash',
    Other = 'Other'
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  from: string; // From client or to vendor
  date: string;
  amount: number; // Positive for income, negative for expense
  category: ReceiptCategory;
  paymentMethod: PaymentMethod;
  notes?: string;
  photoUrl?: string; // URL for an uploaded image of a physical receipt
}

export interface ClientFeedback {
  id: string;
  clientName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface AppState {
  user: User;
  invoices: Invoice[];
  receipts: Receipt[];
  feedback: ClientFeedback[];
  language: 'en' | 'tl';
}

export type AppAction =
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'ADD_RECEIPT'; payload: Receipt }
  | { type: 'UPDATE_RECEIPT'; payload: Receipt }
  | { type: 'DELETE_RECEIPT'; payload: string }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_FEEDBACK'; payload: ClientFeedback }
  | { type: 'TOGGLE_LANGUAGE' };