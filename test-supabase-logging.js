const supabaseService = require('./services/supabaseService');

// Test data matching the webhook format
const testData = {
    book_id: 'Unlocking the Primal Brain',
    transaction_id: 'TEST_SUPABASE_001',
    amount: 400,
    phone_number: '254700555666',
    receipt: 'RCP_TEST_001',
    status: 'completed'
};

async function testSupabaseLogging() {
    console.log('🧪 Testing Supabase logging...');
    console.log('Test data:', testData);
    
    try {
        console.log('📊 Attempting to log to Supabase...');
        const result = await supabaseService.recordPurchase(testData);
        console.log('✅ SUCCESS: Purchase logged to Supabase');
        console.log('📋 Result:', result);
    } catch (error) {
        console.error('❌ ERROR: Failed to log to Supabase');
        console.error('Error details:', error.message);
        console.error('Full error:', error);
    }
}

testSupabaseLogging();