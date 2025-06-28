import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getInvoices, createInvoice } from '@/lib/database'
import type { InvoiceInsert } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's invoices
    const invoices = await getInvoices(user.id)
    
    return NextResponse.json({ 
      success: true, 
      data: invoices 
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate required fields
    const { invoice_number, client_name, client_email, amount, tax, total, due_date, status } = body
    
    if (!invoice_number || !client_name || !client_email || amount === undefined || total === undefined || !due_date) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Create invoice data
    const invoiceData: InvoiceInsert = {
      user_id: user.id,
      invoice_number,
      client_name,
      client_email,
      amount: parseFloat(amount),
      tax: parseFloat(tax) || 0,
      total: parseFloat(total),
      due_date,
      status: status || 'pending'
    }

    // Create the invoice
    const newInvoice = await createInvoice(invoiceData)
    
    return NextResponse.json({ 
      success: true, 
      data: newInvoice 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
} 