import React, { createContext, useReducer, Dispatch, ReactNode, useEffect } from 'react';
import { AppState, AppAction, User, Invoice, Receipt, ClientFeedback, InvoiceStatus, ReceiptCategory, PaymentMethod, TransactionCategory, FinancialGoal, CrediScoreMetrics } from '../types';

const initialUser: User = {
    id: 'user-001',
    name: 'Cardi Bautista',
    email: 'cardi.photography@gmail.com',
    businessName: 'Cardi Bautista Photography',
    avatarUrl: 'https://picsum.photos/seed/cardi/100/100',
    businessLogoUrl: 'https://picsum.photos/seed/cardi/100/100', // Camera-themed logo
    businessAddress: '456 Photographers Lane, Dasmariñas, Cavite, Philippines',
    tin: '987-654-321-000',
    phoneNumber: '+639171234567',
    website: 'www.cardibautistaphotography.com',
    businessType: 'Professional Photography Services',
    joinDate: '2023-08-01'
};

const initialInvoices: Invoice[] = [
    // June 2024
    { 
        id: 'inv-001', 
        invoiceNumber: 'CBP-2024-0015', 
        clientName: 'Maria & Jose Wedding', 
        clientEmail: 'maria.santos@email.com', 
        issueDate: '2024-06-10', 
        dueDate: '2024-06-25', 
        items: [
            {id: 'item-1', description: 'Wedding Photography Package (8 hours)', quantity: 1, price: 35000},
            {id: 'item-2', description: 'Prenup Photoshoot', quantity: 1, price: 12000},
            {id: 'item-3', description: 'Digital Gallery & USB', quantity: 1, price: 3000}
        ], 
        status: InvoiceStatus.Paid, 
        notes: 'Congratulations on your special day!',
        paymentTerms: 'Net 15',
        paidDate: '2024-06-22',
        paymentMethod: PaymentMethod.BankTransfer
    },
    { 
        id: 'inv-002', 
        invoiceNumber: 'CBP-2024-0014', 
        clientName: 'Sunrise Resort', 
        clientEmail: 'marketing@sunriseresort.ph', 
        issueDate: '2024-06-05', 
        dueDate: '2024-06-20', 
        items: [
            {id: 'item-4', description: 'Resort Photography for Website', quantity: 1, price: 18000},
            {id: 'item-5', description: 'Food & Amenities Photography', quantity: 1, price: 8000}
        ], 
        status: InvoiceStatus.Paid,
        paymentTerms: 'Net 15',
        paidDate: '2024-06-18',
        paymentMethod: PaymentMethod.GCash
    },
    // May 2024
    { 
        id: 'inv-003', 
        invoiceNumber: 'CBP-2024-0013', 
        clientName: 'Baby Sophia Milestone', 
        clientEmail: 'anna.cruz@email.com', 
        issueDate: '2024-05-20', 
        dueDate: '2024-06-05', 
        items: [{id: 'item-6', description: 'Baby Milestone Photoshoot (1 year)', quantity: 1, price: 8500}], 
        status: InvoiceStatus.Paid,
        paymentTerms: 'Net 15',
        paidDate: '2024-05-30',
        paymentMethod: PaymentMethod.PayMaya
    },
    { 
        id: 'inv-004', 
        invoiceNumber: 'CBP-2024-0012', 
        clientName: 'Cavite Business Hub', 
        clientEmail: 'events@cavitebusinesshub.com', 
        issueDate: '2024-05-15', 
        dueDate: '2024-05-30', 
        items: [
            {id: 'item-7', description: 'Corporate Event Photography', quantity: 1, price: 15000},
            {id: 'item-8', description: 'Headshot Session for Executives', quantity: 5, price: 2500}
        ], 
        status: InvoiceStatus.Paid,
        paymentTerms: 'Net 15',
        paidDate: '2024-05-28',
        paymentMethod: PaymentMethod.BankTransfer
    },
    // April 2024
    { 
        id: 'inv-005', 
        invoiceNumber: 'CBP-2024-0011', 
        clientName: 'The Dela Rosa Family', 
        clientEmail: 'rodel.delarosa@email.com', 
        issueDate: '2024-04-25', 
        dueDate: '2024-05-10', 
        items: [{id: 'item-9', description: 'Family Portrait Session', quantity: 1, price: 6500}], 
        status: InvoiceStatus.Paid,
        paymentTerms: 'Net 15',
        paidDate: '2024-05-05',
        paymentMethod: PaymentMethod.GCash
    },
    { 
        id: 'inv-006', 
        invoiceNumber: 'CBP-2024-0010', 
        clientName: 'Lush Flower Shop', 
        clientEmail: 'info@lushflowershop.ph', 
        issueDate: '2024-04-18', 
        dueDate: '2024-05-03', 
        items: [
            {id: 'item-10', description: 'Product Photography - Flower Arrangements', quantity: 20, price: 350},
            {id: 'item-11', description: 'Lifestyle Photography for Social Media', quantity: 1, price: 4000}
        ], 
        status: InvoiceStatus.Paid,
        paymentTerms: 'Net 15',
        paidDate: '2024-04-30',
        paymentMethod: PaymentMethod.PayMaya
    },
    // March 2024
    { 
        id: 'inv-007', 
        invoiceNumber: 'CBP-2024-0009', 
        clientName: 'Miguel Graduation', 
        clientEmail: 'migueltorres@email.com', 
        issueDate: '2024-03-20', 
        dueDate: '2024-04-05', 
        items: [{id: 'item-12', description: 'Graduation Photography Session', quantity: 1, price: 5500}], 
        status: InvoiceStatus.Paid,
        paymentTerms: 'Net 15',
        paidDate: '2024-03-28',
        paymentMethod: PaymentMethod.GCash
    },
    { 
        id: 'inv-008', 
        invoiceNumber: 'CBP-2024-0008', 
        clientName: 'Bella Maternity', 
        clientEmail: 'bella.reyes@email.com', 
        issueDate: '2024-03-10', 
        dueDate: '2024-03-25', 
        items: [{id: 'item-13', description: 'Maternity Photoshoot Package', quantity: 1, price: 9000}], 
        status: InvoiceStatus.Paid,
        paymentTerms: 'Net 15',
        paidDate: '2024-03-22',
        paymentMethod: PaymentMethod.BankTransfer
    },
    // February 2024
    { 
        id: 'inv-009', 
        invoiceNumber: 'CBP-2024-0007', 
        clientName: 'Tagaytay Coffee Farm', 
        clientEmail: 'marketing@tagcoffeefarm.com', 
        issueDate: '2024-02-15', 
        dueDate: '2024-03-01', 
        items: [
            {id: 'item-14', description: 'Coffee Farm Photography for Brochure', quantity: 1, price: 12000},
            {id: 'item-15', description: 'Drone Photography (Aerial Shots)', quantity: 1, price: 8000}
        ], 
        status: InvoiceStatus.Paid,
        paymentTerms: 'Net 15',
        paidDate: '2024-02-28',
        paymentMethod: PaymentMethod.BankTransfer
    },
    { 
        id: 'inv-010', 
        invoiceNumber: 'CBP-2024-0006', 
        clientName: 'Sweet 16 Celebration - Kyla', 
        clientEmail: 'mom.kyla@email.com', 
        issueDate: '2024-02-08', 
        dueDate: '2024-02-23', 
        items: [{id: 'item-16', description: 'Sweet 16 Birthday Photography', quantity: 1, price: 7500}], 
        status: InvoiceStatus.Paid,
        paymentTerms: 'Net 15',
        paidDate: '2024-02-20',
        paymentMethod: PaymentMethod.PayMaya
    },
    // January 2024
    { 
        id: 'inv-011', 
        invoiceNumber: 'CBP-2024-0005', 
        clientName: 'New Year Corporate Party', 
        clientEmail: 'hr@techstartup.ph', 
        issueDate: '2024-01-25', 
        dueDate: '2024-02-10', 
        items: [{id: 'item-17', description: 'Corporate New Year Party Photography', quantity: 1, price: 13000}], 
        status: InvoiceStatus.Paid,
        paymentTerms: 'Net 15',
        paidDate: '2024-02-08',
        paymentMethod: PaymentMethod.GCash
    },
    { 
        id: 'inv-012', 
        invoiceNumber: 'CBP-2024-0004', 
        clientName: 'Engagement Session - Mark & Lea', 
        clientEmail: 'marklea2024@email.com', 
        issueDate: '2024-01-15', 
        dueDate: '2024-01-30', 
        items: [{id: 'item-18', description: 'Engagement Photoshoot in Tagaytay', quantity: 1, price: 10000}], 
        status: InvoiceStatus.Overdue,
        paymentTerms: 'Net 15'
    },
    // Recent Invoice (July 2024)
    { 
        id: 'inv-013', 
        invoiceNumber: 'CBP-2024-0016', 
        clientName: 'Summer Fashion Brand', 
        clientEmail: 'creative@summerfashion.ph', 
        issueDate: '2024-07-20', 
        dueDate: '2024-08-05', 
        items: [
            {id: 'item-19', description: 'Fashion Photography - Summer Collection', quantity: 1, price: 22000},
            {id: 'item-20', description: 'Model Lifestyle Shots', quantity: 1, price: 8000}
        ], 
        status: InvoiceStatus.Sent,
        paymentTerms: 'Net 15'
    }
];

const initialReceipts: Receipt[] = [
    // Equipment and Gear
    { 
        id: 'rec-001', 
        receiptNumber: 'R-001', 
        from: 'Canon Philippines', 
        date: '2024-01-10', 
        amount: -85000, 
        category: ReceiptCategory.BusinessExpense, 
        transactionCategory: TransactionCategory.Equipment,
        paymentMethod: PaymentMethod.BankTransfer,
        tags: ['equipment', 'camera', 'canon-r6'],
        notes: 'Canon EOS R6 Mark II Camera Body'
    },
    
    // Client Payments (Income)
    { 
        id: 'rec-003', 
        receiptNumber: 'R-002', 
        from: 'Maria & Jose Wedding', 
        date: '2024-06-22', 
        amount: 50000, 
        category: ReceiptCategory.ServiceFee, 
        transactionCategory: TransactionCategory.ServiceRevenue,
        paymentMethod: PaymentMethod.BankTransfer,
        tags: ['wedding', 'client-payment', 'photography']
    },
    { 
        id: 'rec-004', 
        receiptNumber: 'R-003', 
        from: 'Sunrise Resort', 
        date: '2024-06-18', 
        amount: 29120, 
        category: ReceiptCategory.ServiceFee, 
        transactionCategory: TransactionCategory.ServiceRevenue,
        paymentMethod: PaymentMethod.GCash,
        tags: ['commercial', 'client-payment', 'resort']
    },
    
    // Monthly Expenses
    { 
        id: 'rec-005', 
        receiptNumber: 'R-005', 
        from: 'Adobe Creative Cloud', 
        date: '2024-06-01', 
        amount: -2750, 
        category: ReceiptCategory.BusinessExpense, 
        transactionCategory: TransactionCategory.Software_Tools,
        paymentMethod: PaymentMethod.Credit_Card,
        tags: ['software', 'adobe', 'subscription'],
        isRecurring: true,
        recurringFrequency: 'monthly',
        notes: 'Adobe Creative Cloud Photography Plan'
    },
    
    // Transportation and Travel
    { 
        id: 'rec-007', 
        receiptNumber: 'R-007', 
        from: 'Shell Gas Station', 
        date: '2024-06-15', 
        amount: -2200, 
        category: ReceiptCategory.BusinessExpense, 
        transactionCategory: TransactionCategory.Travel,
        paymentMethod: PaymentMethod.GCash,
        tags: ['fuel', 'transportation', 'client-shoot'],
        notes: 'Fuel for wedding shoot in Tagaytay'
    },
    
    // More Client Payments
    { 
        id: 'rec-008', 
        receiptNumber: 'R-008', 
        from: 'Baby Sophia Milestone', 
        date: '2024-05-30', 
        amount: 8500, 
        category: ReceiptCategory.ServiceFee, 
        transactionCategory: TransactionCategory.ServiceRevenue,
        paymentMethod: PaymentMethod.PayMaya,
        tags: ['baby', 'milestone', 'client-payment']
    },
    { 
        id: 'rec-009', 
        receiptNumber: 'R-009', 
        from: 'Cavite Business Hub', 
        date: '2024-05-28', 
        amount: 27440, 
        category: ReceiptCategory.ServiceFee, 
        transactionCategory: TransactionCategory.ServiceRevenue,
        paymentMethod: PaymentMethod.BankTransfer,
        tags: ['corporate', 'headshots', 'client-payment']
    },
    
    // Equipment Maintenance
    { 
        id: 'rec-010', 
        receiptNumber: 'R-010', 
        from: 'Camera Repair Center', 
        date: '2024-05-10', 
        amount: -3500, 
        category: ReceiptCategory.BusinessExpense, 
        transactionCategory: TransactionCategory.Equipment,
        paymentMethod: PaymentMethod.Cash,
        tags: ['maintenance', 'camera', 'repair'],
        notes: 'Camera sensor cleaning and calibration'
    },
    
    // Marketing and Website
    { 
        id: 'rec-011', 
        receiptNumber: 'R-011', 
        from: 'Facebook Ads', 
        date: '2024-04-25', 
        amount: -5000, 
        category: ReceiptCategory.BusinessExpense, 
        transactionCategory: TransactionCategory.Marketing,
        paymentMethod: PaymentMethod.Credit_Card,
        tags: ['advertising', 'facebook', 'marketing'],
        notes: 'Social media advertising campaign'
    },
    { 
        id: 'rec-012', 
        receiptNumber: 'R-012', 
        from: 'GoDaddy', 
        date: '2024-04-15', 
        amount: -4200, 
        category: ReceiptCategory.BusinessExpense, 
        transactionCategory: TransactionCategory.Internet,
        paymentMethod: PaymentMethod.Credit_Card,
        tags: ['website', 'hosting', 'domain'],
        isRecurring: true,
        recurringFrequency: 'yearly',
        notes: 'Website hosting and domain renewal'
    },
    
    // More Client Payments
    { 
        id: 'rec-013', 
        receiptNumber: 'R-013', 
        from: 'The Dela Rosa Family', 
        date: '2024-05-05', 
        amount: 6500, 
        category: ReceiptCategory.ServiceFee, 
        transactionCategory: TransactionCategory.ServiceRevenue,
        paymentMethod: PaymentMethod.GCash,
        tags: ['family', 'portrait', 'client-payment']
    },
    { 
        id: 'rec-014', 
        receiptNumber: 'R-014', 
        from: 'Lush Flower Shop', 
        date: '2024-04-30', 
        amount: 11088, 
        category: ReceiptCategory.ServiceFee, 
        transactionCategory: TransactionCategory.ServiceRevenue,
        paymentMethod: PaymentMethod.PayMaya,
        tags: ['product', 'commercial', 'client-payment']
    },
    
    // Props and Accessories
    { 
        id: 'rec-016', 
        receiptNumber: 'R-016', 
        from: 'Photography Props Store', 
        date: '2024-02-20', 
        amount: -6500, 
        category: ReceiptCategory.BusinessExpense, 
        transactionCategory: TransactionCategory.Office_Supplies,
        paymentMethod: PaymentMethod.GCash,
        tags: ['props', 'backdrops', 'accessories'],
        notes: 'Studio backdrops and baby photography props'
    },
];

const initialFeedback: ClientFeedback[] = [
    { 
        id: 'fb-001', 
        clientName: 'Maria Santos', 
        clientEmail: 'maria.santos@email.com',
        rating: 5, 
        comment: 'Cardi exceeded all our expectations for our wedding! She captured every precious moment beautifully and made us feel so comfortable throughout the day. The prenup photos were absolutely stunning, and she even went above and beyond by taking extra shots during the reception. Highly recommend her to any couple looking for a talented photographer!',
        date: '2024-06-25',
        projectType: 'Wedding Photography',
        isPublic: true,
        isVerified: true,
        invoiceId: 'inv-001'
    },
    { 
        id: 'fb-002', 
        clientName: 'Sunrise Resort Marketing Team', 
        clientEmail: 'marketing@sunriseresort.ph',
        rating: 5, 
        comment: 'Professional, creative, and delivered exceptional results! Cardi\'s photos perfectly showcase our resort\'s beauty and amenities. The food photography was particularly impressive - made our dishes look absolutely appetizing. She understood our brand perfectly and delivered images that significantly boosted our social media engagement.',
        date: '2024-06-20',
        projectType: 'Commercial Photography',
        isPublic: true,
        isVerified: true,
        invoiceId: 'inv-002'
    },
    { 
        id: 'fb-003', 
        clientName: 'Anna Cruz', 
        clientEmail: 'anna.cruz@email.com',
        rating: 5, 
        comment: 'Cardi is amazing with babies! My daughter Sophia was having a fussy day, but Cardi was so patient and creative in getting her to smile. The milestone photos turned out absolutely perfect - captured my baby\'s personality perfectly. Will definitely book her again for future milestones!',
        date: '2024-06-02',
        projectType: 'Baby Photography',
        isPublic: true,
        isVerified: true,
        invoiceId: 'inv-003'
    },
    { 
        id: 'fb-004', 
        clientName: 'Cavite Business Hub', 
        clientEmail: 'events@cavitebusinesshub.com',
        rating: 4, 
        comment: 'Great work on our corporate event and executive headshots. Cardi was professional and efficient, capturing all the important moments of our business networking event. The headshots look polished and professional - exactly what we needed for our company profiles.',
        date: '2024-05-30',
        projectType: 'Corporate Photography',
        isPublic: true,
        isVerified: true,
        invoiceId: 'inv-004'
    },
    { 
        id: 'fb-005', 
        clientName: 'Rodel Dela Rosa', 
        clientEmail: 'rodel.delarosa@email.com',
        rating: 5, 
        comment: 'Cardi made our family portrait session so enjoyable! She had great ideas for poses and locations, and she was wonderful with our kids. The photos came out beautifully and truly captured our family\'s bond. We\'ll treasure these photos forever.',
        date: '2024-05-08',
        projectType: 'Family Photography',
        isPublic: true,
        isVerified: true,
        invoiceId: 'inv-005'
    },
    { 
        id: 'fb-006', 
        clientName: 'Lush Flower Shop', 
        clientEmail: 'info@lushflowershop.ph',
        rating: 5, 
        comment: 'Incredible product photography! Cardi transformed our flower arrangements into works of art. Her attention to detail and creative composition skills are outstanding. The lifestyle shots she took for our social media have been getting amazing engagement. Highly recommend for any business needing quality product photos.',
        date: '2024-05-02',
        projectType: 'Product Photography',
        isPublic: true,
        isVerified: true,
        invoiceId: 'inv-006'
    },
    { 
        id: 'fb-007', 
        clientName: 'Miguel Torres', 
        clientEmail: 'migueltorres@email.com',
        rating: 5, 
        comment: 'Perfect graduation photos! Cardi captured this milestone moment beautifully. She was creative with different poses and backdrops, and made the whole session fun and relaxed. My family loves the photos, and they\'ll be perfect for my graduation announcements.',
        date: '2024-03-30',
        projectType: 'Graduation Photography',
        isPublic: true,
        isVerified: true,
        invoiceId: 'inv-007'
    },
    { 
        id: 'fb-008', 
        clientName: 'Bella Reyes', 
        clientEmail: 'bella.reyes@email.com',
        rating: 5, 
        comment: 'Cardi made me feel so beautiful during my maternity shoot! She had wonderful ideas for poses that were comfortable for me, and the lighting was absolutely perfect. The photos captured this special time in my life so beautifully. I can\'t wait to book her for newborn photos!',
        date: '2024-03-25',
        projectType: 'Maternity Photography',
        isPublic: true,
        isVerified: true,
        invoiceId: 'inv-008'
    },
    { 
        id: 'fb-009', 
        clientName: 'Tagaytay Coffee Farm', 
        clientEmail: 'marketing@tagcoffeefarm.com',
        rating: 4, 
        comment: 'Excellent work on our coffee farm photography! Cardi perfectly captured the essence of our farm and the coffee-making process. The drone shots were particularly impressive, showing the beautiful landscape of our farm. The photos have been great for our marketing materials.',
        date: '2024-03-05',
        projectType: 'Commercial Photography',
        isPublic: true,
        isVerified: true,
        invoiceId: 'inv-009'
    },
    { 
        id: 'fb-010', 
        clientName: 'Kyla\'s Mom', 
        clientEmail: 'mom.kyla@email.com',
        rating: 5, 
        comment: 'Cardi made my daughter\'s Sweet 16 celebration absolutely magical! She captured all the special moments and the joy of the day. Kyla felt like a princess during the photoshoot, and the photos are stunning. Thank you for making this milestone so memorable!',
        date: '2024-02-25',
        projectType: 'Birthday Photography',
        isPublic: true,
        isVerified: true,
        invoiceId: 'inv-010'
    }
];

const initialFinancialGoals: FinancialGoal[] = [
    {
        id: 'goal-001',
        title: 'Monthly Revenue Target',
        description: 'Reach ₱45,000 monthly revenue by Q4 2024',
        targetAmount: 45000,
        currentAmount: 38500,
        deadline: '2024-12-31',
        category: 'revenue',
        isCompleted: false,
        createdDate: '2024-01-01'
    },
    {
        id: 'goal-002',
        title: 'Photography Equipment Fund',
        description: 'Save for new professional lighting equipment',
        targetAmount: 80000,
        currentAmount: 35000,
        deadline: '2024-10-31',
        category: 'savings',
        isCompleted: false,
        createdDate: '2024-02-15'
    },
    {
        id: 'goal-003',
        title: 'Photography Clients',
        description: 'Book 20 photography sessions this year',
        targetAmount: 20,
        currentAmount: 13,
        deadline: '2024-12-31',
        category: 'client_acquisition',
        isCompleted: false,
        createdDate: '2024-01-01'
    },
    {
        id: 'goal-004',
        title: 'Business Emergency Fund',
        description: 'Build emergency fund for 6 months of expenses',
        targetAmount: 150000,
        currentAmount: 62000,
        deadline: '2024-12-31',
        category: 'savings',
        isCompleted: false,
        createdDate: '2024-03-01'
    },
    {
        id: 'goal-005',
        title: 'Studio Expansion',
        description: 'Save for larger studio space in Cavite',
        targetAmount: 200000,
        currentAmount: 25000,
        deadline: '2025-06-30',
        category: 'savings',
        isCompleted: false,
        createdDate: '2024-04-01'
    }
];

// Enhanced CrediScore calculation function
const calculateCrediScore = (invoices: Invoice[], receipts: Receipt[], feedback: ClientFeedback[], user: User): CrediScoreMetrics => {
    // Payment History Score (0-25 points)
    const paidInvoices = invoices.filter(inv => inv.status === InvoiceStatus.Paid);
    const totalInvoices = invoices.length;
    const paymentHistoryScore = totalInvoices > 0 ? (paidInvoices.length / totalInvoices) * 25 : 0;

    // Financial Consistency Score (0-20 points)
    const monthlyRevenues = new Map<string, number>();
    paidInvoices.forEach(inv => {
        const month = new Date(inv.paidDate || inv.issueDate).toISOString().slice(0, 7);
        const revenue = inv.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        monthlyRevenues.set(month, (monthlyRevenues.get(month) || 0) + revenue);
    });
    
    const revenues = Array.from(monthlyRevenues.values());
    const avgRevenue = revenues.reduce((sum, rev) => sum + rev, 0) / revenues.length || 0;
    const variance = revenues.reduce((sum, rev) => sum + Math.pow(rev - avgRevenue, 2), 0) / revenues.length || 0;
    const consistencyScore = avgRevenue > 0 ? Math.max(0, 20 - (Math.sqrt(variance) / avgRevenue) * 10) : 0;

    // Client Diversity Score (0-15 points) - based on unique clients from invoices
    const uniqueClients = new Set(invoices.map(inv => inv.clientName));
    const clientDiversityScore = Math.min(15, uniqueClients.size * 2.5);

    // Business Growth Score (0-20 points)
    const totalRevenue = paidInvoices.reduce((sum, inv) => {
        return sum + inv.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
    }, 0);
    const businessAge = (new Date().getTime() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    const growthScore = Math.min(20, Math.log10(totalRevenue + 1) * 3 + businessAge * 2);

    // Professional Reputation Score (0-20 points)
    const avgRating = feedback.length > 0 ? feedback.reduce((sum, fb) => sum + fb.rating, 0) / feedback.length : 0;
    const verifiedFeedbacks = feedback.filter(fb => fb.isVerified).length;
    const reputationScore = (avgRating / 5) * 15 + Math.min(5, verifiedFeedbacks);

    const totalScore = Math.round(paymentHistoryScore + consistencyScore + clientDiversityScore + growthScore + reputationScore);

    let level: CrediScoreMetrics['level'];
    if (totalScore >= 85) level = 'Excellent';
    else if (totalScore >= 70) level = 'Very Good';
    else if (totalScore >= 55) level = 'Good';
    else if (totalScore >= 40) level = 'Fair';
    else level = 'Poor';

    const recommendations: string[] = [];
    if (paymentHistoryScore < 20) recommendations.push('Improve invoice collection to boost payment history');
    if (consistencyScore < 15) recommendations.push('Focus on maintaining consistent monthly revenue');
    if (clientDiversityScore < 10) recommendations.push('Diversify your client base to reduce dependency risk');
    if (growthScore < 15) recommendations.push('Implement strategies to grow your business revenue');
    if (reputationScore < 15) recommendations.push('Collect more client feedback and testimonials');

    return {
        score: totalScore,
        level,
        factors: {
            paymentHistory: Math.round(paymentHistoryScore),
            financialConsistency: Math.round(consistencyScore),
            clientDiversity: Math.round(clientDiversityScore),
            businessGrowth: Math.round(growthScore),
            professionalReputation: Math.round(reputationScore)
        },
        recommendations,
        lastUpdated: new Date().toISOString()
    };
};

const initialCrediScore = calculateCrediScore(initialInvoices, initialReceipts, initialFeedback, initialUser);

const initialState: AppState = {
    user: initialUser,
    invoices: initialInvoices,
    receipts: initialReceipts,
    feedback: initialFeedback,
    financialGoals: initialFinancialGoals,
    crediScore: initialCrediScore
};

const appReducer = (state: AppState, action: AppAction): AppState => {
    let newState = state;
    
    switch (action.type) {
        case 'ADD_INVOICE':
            newState = { ...state, invoices: [...state.invoices, action.payload] };
            break;
        case 'UPDATE_INVOICE':
            newState = { ...state, invoices: state.invoices.map(inv => inv.id === action.payload.id ? action.payload : inv) };
            break;
        case 'DELETE_INVOICE':
            newState = { ...state, invoices: state.invoices.filter(inv => inv.id !== action.payload) };
            break;
        case 'ADD_RECEIPT':
            newState = { ...state, receipts: [...state.receipts, action.payload] };
            break;
        case 'UPDATE_RECEIPT':
            newState = { ...state, receipts: state.receipts.map(rec => rec.id === action.payload.id ? action.payload : rec) };
            break;
        case 'DELETE_RECEIPT':
            newState = { ...state, receipts: state.receipts.filter(rec => rec.id !== action.payload) };
            break;
        case 'ADD_FEEDBACK':
            newState = { ...state, feedback: [action.payload, ...state.feedback] };
            break;
        case 'UPDATE_FEEDBACK':
            newState = { ...state, feedback: state.feedback.map(fb => fb.id === action.payload.id ? action.payload : fb) };
            break;
        case 'DELETE_FEEDBACK':
            newState = { ...state, feedback: state.feedback.filter(fb => fb.id !== action.payload) };
            break;
        case 'ADD_FINANCIAL_GOAL':
            newState = { ...state, financialGoals: [...state.financialGoals, action.payload] };
            break;
        case 'UPDATE_FINANCIAL_GOAL':
            newState = { ...state, financialGoals: state.financialGoals.map(goal => goal.id === action.payload.id ? action.payload : goal) };
            break;
        case 'DELETE_FINANCIAL_GOAL':
            newState = { ...state, financialGoals: state.financialGoals.filter(goal => goal.id !== action.payload) };
            break;
        case 'UPDATE_USER':
            newState = { ...state, user: { ...state.user, ...action.payload } };
            break;
        case 'UPDATE_CREDISCORE':
            newState = { ...state, crediScore: action.payload };
            break;
        default:
            return state;
    }

    // Recalculate CrediScore when relevant data changes
    if (['ADD_INVOICE', 'UPDATE_INVOICE', 'DELETE_INVOICE', 'ADD_RECEIPT', 'UPDATE_RECEIPT', 'DELETE_RECEIPT', 'ADD_FEEDBACK', 'UPDATE_FEEDBACK', 'DELETE_FEEDBACK'].includes(action.type)) {
        newState.crediScore = calculateCrediScore(newState.invoices, newState.receipts, newState.feedback, newState.user);
    }

    return newState;
};

export const AppContext = createContext<{ state: AppState; dispatch: Dispatch<AppAction> }>({
    state: initialState,
    dispatch: () => null
});

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};