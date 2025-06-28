import { supabase } from './supabase'
import type {
  User,
  UserInsert,
  UserUpdate,
  Invoice,
  InvoiceInsert,
  InvoiceUpdate,
  Receipt,
  ReceiptInsert,
  ReceiptUpdate,
  Feedback,
  FeedbackInsert,
  FeedbackUpdate,
  CreditScore,
  CreditScoreInsert,
  CreditScoreUpdate,
  InvoiceWithStatus,
  UserProfile
} from '@/types/database'

// Users
export const getUser = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export const createUser = async (user: UserInsert): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateUser = async (id: string, updates: UserUpdate): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getUserProfile = async (id: string): Promise<UserProfile | null> => {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (userError) throw userError

  // Get additional profile data
  const [invoicesData, feedbackData, creditData] = await Promise.all([
    supabase
      .from('invoices')
      .select('amount, status')
      .eq('user_id', id),
    supabase
      .from('feedback')
      .select('rating')
      .eq('user_id', id),
    supabase
      .from('credit_scores')
      .select('score')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
  ])

  const totalInvoices = invoicesData.data?.length || 0
  const totalRevenue = invoicesData.data?.reduce((sum, inv) => sum + inv.amount, 0) || 0
  const averageRating = feedbackData.data?.length 
    ? feedbackData.data.reduce((sum, fb) => sum + fb.rating, 0) / feedbackData.data.length 
    : 0
  const creditScore = creditData.data?.[0]?.score || 0

  return {
    ...user,
    totalInvoices,
    totalRevenue,
    averageRating,
    creditScore
  }
}

// Invoices
export const getInvoices = async (userId: string): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getInvoice = async (id: string): Promise<Invoice | null> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const createInvoice = async (invoice: InvoiceInsert): Promise<Invoice> => {
  const { data, error } = await supabase
    .from('invoices')
    .insert(invoice)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateInvoice = async (id: string, updates: InvoiceUpdate): Promise<Invoice> => {
  const { data, error } = await supabase
    .from('invoices')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteInvoice = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export const getInvoicesWithStatus = async (userId: string): Promise<InvoiceWithStatus[]> => {
  const invoices = await getInvoices(userId)
  const today = new Date()

  return invoices.map(invoice => {
    const dueDate = new Date(invoice.due_date)
    const isPaid = invoice.status === 'paid'
    const isOverdue = !isPaid && dueDate < today
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    return {
      ...invoice,
      isPaid,
      isOverdue,
      daysUntilDue
    }
  })
}

// Receipts
export const getReceipts = async (userId: string): Promise<Receipt[]> => {
  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getReceipt = async (id: string): Promise<Receipt | null> => {
  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const createReceipt = async (receipt: ReceiptInsert): Promise<Receipt> => {
  const { data, error } = await supabase
    .from('receipts')
    .insert(receipt)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateReceipt = async (id: string, updates: ReceiptUpdate): Promise<Receipt> => {
  const { data, error } = await supabase
    .from('receipts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteReceipt = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('receipts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Feedback
export const getFeedback = async (userId: string): Promise<Feedback[]> => {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getPublicFeedback = async (userId: string): Promise<Feedback[]> => {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('user_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const createFeedback = async (feedback: FeedbackInsert): Promise<Feedback> => {
  const { data, error } = await supabase
    .from('feedback')
    .insert(feedback)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateFeedback = async (id: string, updates: FeedbackUpdate): Promise<Feedback> => {
  const { data, error } = await supabase
    .from('feedback')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteFeedback = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('feedback')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Credit Scores
export const getCreditScores = async (userId: string): Promise<CreditScore[]> => {
  const { data, error } = await supabase
    .from('credit_scores')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getLatestCreditScore = async (userId: string): Promise<CreditScore | null> => {
  const { data, error } = await supabase
    .from('credit_scores')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export const createCreditScore = async (creditScore: CreditScoreInsert): Promise<CreditScore> => {
  const { data, error } = await supabase
    .from('credit_scores')
    .insert(creditScore)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateCreditScore = async (id: string, updates: CreditScoreUpdate): Promise<CreditScore> => {
  const { data, error } = await supabase
    .from('credit_scores')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Analytics and Reports
export const getInvoiceAnalytics = async (userId: string) => {
  const { data, error } = await supabase
    .from('invoices')
    .select('amount, status, due_date, created_at')
    .eq('user_id', userId)

  if (error) throw error

  const totalInvoices = data.length
  const paidInvoices = data.filter(inv => inv.status === 'paid').length
  const totalRevenue = data.reduce((sum, inv) => sum + inv.amount, 0)
  const averageInvoiceAmount = totalInvoices > 0 ? totalRevenue / totalInvoices : 0
  
  const today = new Date()
  const overdueInvoices = data.filter(inv => 
    inv.status !== 'paid' && new Date(inv.due_date) < today
  ).length

  return {
    totalInvoices,
    paidInvoices,
    overdueInvoices,
    totalRevenue,
    averageInvoiceAmount,
    paymentRate: totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0
  }
}

export const getReceiptAnalytics = async (userId: string) => {
  const { data, error } = await supabase
    .from('receipts')
    .select('amount, category, payment_method, created_at')
    .eq('user_id', userId)

  if (error) throw error

  const totalReceipts = data.length
  const totalExpenses = data.reduce((sum, receipt) => sum + receipt.amount, 0)
  
  const categoryBreakdown = data.reduce((acc, receipt) => {
    acc[receipt.category] = (acc[receipt.category] || 0) + receipt.amount
    return acc
  }, {} as Record<string, number>)

  const paymentMethodBreakdown = data.reduce((acc, receipt) => {
    acc[receipt.payment_method] = (acc[receipt.payment_method] || 0) + receipt.amount
    return acc
  }, {} as Record<string, number>)

  return {
    totalReceipts,
    totalExpenses,
    averageExpense: totalReceipts > 0 ? totalExpenses / totalReceipts : 0,
    categoryBreakdown,
    paymentMethodBreakdown
  }
} 