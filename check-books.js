const supabaseService = require('./services/supabaseService');

async function checkBooks() {
    console.log('📚 Checking available books and their IDs...');
    
    try {
        const books = await supabaseService.getAllBooks();
        console.log('✅ Found books:', books);
        
        if (books && books.length > 0) {
            console.log('\n📋 Book mapping:');
            books.forEach(book => {
                console.log(`- ${book.title}: ${book.id}`);
            });
        } else {
            console.log('❌ No books found in database');
        }
        
    } catch (error) {
        console.error('❌ Error checking books:', error.message);
    }
}

checkBooks();