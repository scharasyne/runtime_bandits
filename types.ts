export interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
  avatarUrl: string;
  businessLogoUrl?: string;
  businessAddress?: string;
  tin?: string;
  phoneNumber?: string;
  website?: string;
  businessType?: string;
  joinDate: string;
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
  Cancelled = 'Cancelled'
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
  paymentTerms?: string;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
}

export enum TransactionCategory {
  // Income Categories
  ServiceRevenue = 'Service Revenue',
  ProductSale = 'Product Sale',
  Consulting = 'Consulting',
  Commission = 'Commission',
  Royalties = 'Royalties',
  Investment = 'Investment Income',
  Other_Income = 'Other Income',
  
  // Expense Categories
  Office_Supplies = 'Office Supplies',
  Software_Tools = 'Software & Tools',
  Marketing = 'Marketing & Advertising',
  Travel = 'Travel & Transportation',
  Meals = 'Meals & Entertainment',
  Professional_Services = 'Professional Services',
  Insurance = 'Insurance',
  Utilities = 'Utilities',
  Equipment = 'Equipment',
  Training = 'Training & Education',
  Rent = 'Rent & Facilities',
  Internet = 'Internet & Phone',
  Other_Expense = 'Other Expenses'
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
    Credit_Card = 'Credit Card',
    Debit_Card = 'Debit Card',
    Check = 'Check',
    Other = 'Other'
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  from: string; // From client or to vendor
  date: string;
  amount: number; // Positive for income, negative for expense
  category: ReceiptCategory;
  transactionCategory: TransactionCategory;
  paymentMethod: PaymentMethod;
  notes?: string;
  photoUrl?: string; // URL for an uploaded image of a physical receipt
  tags?: string[];
  isRecurring?: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export interface ClientFeedback {
  id: string;
  clientName: string;
  clientEmail?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  projectType?: string;
  isPublic: boolean;
  isVerified: boolean;
  response?: string; // Your response to the feedback
  invoiceId?: string; // Add this field for linking feedback to invoices
}

export interface FinancialGoal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'revenue' | 'savings' | 'expense_reduction' | 'client_acquisition';
  isCompleted: boolean;
  createdDate: string;
}

export interface CrediScoreMetrics {
  score: number;
  level: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';
  factors: {
    paymentHistory: number;
    financialConsistency: number;
    clientDiversity: number;
    businessGrowth: number;
    professionalReputation: number;
  };
  recommendations: string[];
  lastUpdated: string;
}

export interface AppState {
  user: User;
  invoices: Invoice[];
  receipts: Receipt[];
  feedback: ClientFeedback[];
  financialGoals: FinancialGoal[];
  crediScore: CrediScoreMetrics;
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
  | { type: 'UPDATE_FEEDBACK'; payload: ClientFeedback }
  | { type: 'DELETE_FEEDBACK'; payload: string }
  | { type: 'ADD_FINANCIAL_GOAL'; payload: FinancialGoal }
  | { type: 'UPDATE_FINANCIAL_GOAL'; payload: FinancialGoal }
  | { type: 'DELETE_FINANCIAL_GOAL'; payload: string }
  | { type: 'UPDATE_CREDISCORE'; payload: CrediScoreMetrics }
  | { type: 'TOGGLE_LANGUAGE' };