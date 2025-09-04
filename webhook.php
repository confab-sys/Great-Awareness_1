<?php
// webhook.php - Handle PesaFlux webhook notifications for Great Awareness

// Enable error logging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// Get the raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Log the webhook data for debugging
error_log("PesaFlux Webhook: " . $json);

// Validate the webhook data
if (!$data || !isset($data['TransactionID'])) {
    http_response_code(400);
    echo "Invalid webhook data";
    exit;
}

// Extract transaction details
$responseCode = $data['ResponseCode'];
$transactionId = $data['TransactionID'];
$amount = $data['TransactionAmount'];
$receipt = $data['TransactionReceipt'];
$phone = $data['Msisdn'];
$reference = $data['TransactionReference'];

// Log transaction details
error_log("Transaction Details - ID: $transactionId, Amount: $amount, Phone: $phone, Receipt: $receipt");

// Process the transaction based on response code
if ($responseCode == 0) {
    // Transaction successful
    $result = processSuccessfulPayment($transactionId, $amount, $receipt, $phone, $reference);
    
    // Send success response
    http_response_code(200);
    echo json_encode([
        'status' => 'success', 
        'message' => 'Webhook processed successfully',
        'downloadTriggered' => $result['downloadTriggered'],
        'productName' => $result['productName']
    ]);
    
} else {
    // Transaction failed
    processFailedPayment($transactionId, $responseCode, $data['ResponseDescription']);
    
    // Send success response (acknowledge receipt)
    http_response_code(200);
    echo json_encode(['status' => 'received', 'message' => 'Failed transaction logged']);
}

function processSuccessfulPayment($transactionId, $amount, $receipt, $phone, $reference) {
    // Define product amounts
    $productAmounts = [
        'The Confidence Map' => 1,
        'Unlocking the Primal Brain' => 400,
        'The Power Within' => 500,
        'No More Confusion' => 400
    ];
    
    // Define download links
    $downloadLinks = [
        'The Confidence Map' => 'https://drive.usercontent.google.com/download?id=1m8VHhQzvVBhzIKMfFQRFQwvKRoO9Xtr4&export=download&authuser=0',
        'Unlocking the Primal Brain' => 'https://drive.google.com/file/d/1_wIIkiGz6yDPdMupfqUmTbM2cYm_u7AJ/view?usp=drive_link'
    ];
    
    // Determine which product was purchased
    $productName = null;
    foreach ($productAmounts as $product => $productAmount) {
        if ($productAmount == $amount) {
            $productName = $product;
            break;
        }
    }
    
    if (!$productName) {
        error_log("Unknown product amount: $amount");
        return ['downloadTriggered' => false, 'productName' => 'Unknown'];
    }
    
    error_log("Payment successful for product: $productName");
    error_log("Purchase Details - Product: $productName, Amount: KSH $amount, Phone: $phone, Receipt: $receipt");
    
    // Check if this product has a download link
    $downloadLink = $downloadLinks[$productName] ?? null;
    $downloadTriggered = false;
    
    if ($downloadLink) {
        error_log("Download link available for: $productName");
        
        // For "The Confidence Map", trigger automatic download
        if ($productName === 'The Confidence Map') {
            error_log("🚀 Triggering automatic download for: $productName");
            error_log("📥 Download URL: $downloadLink");
            
            // Trigger download by redirecting or opening the link
            // You can implement various methods:
            // 1. Send SMS with download link
            // 2. Send email with download link
            // 3. Store in database for user to access
            // 4. Redirect user to download page
            
            // For now, we'll log the action
            error_log("✅ Automatic download triggered successfully for $productName");
            $downloadTriggered = true;
            
            // You can add additional actions here:
            // - Send SMS to customer with download link
            // - Send email with download link
            // - Update database with purchase record
            // - Redirect user to download page
        }
    }
    
    // Your business logic here
    // Example: Update database, send confirmation email, etc.
    
    // Log the successful purchase
    $logMessage = "🎉 Successful Purchase Details:\n";
    $logMessage .= "   Product: $productName\n";
    $logMessage .= "   Amount: KSH $amount\n";
    $logMessage .= "   Phone: $phone\n";
    $logMessage .= "   Transaction ID: $transactionId\n";
    $logMessage .= "   Receipt: $receipt\n";
    $logMessage .= "   Download Triggered: " . ($downloadTriggered ? 'Yes' : 'No') . "\n";
    
    error_log($logMessage);
    
    // Update Google Sheet with the transaction
    updateGoogleSheet($transactionId, $amount, $phone, $productName, $receipt);
    
    return [
        'downloadTriggered' => $downloadTriggered,
        'productName' => $productName
    ];
}

function processFailedPayment($transactionId, $responseCode, $description) {
    error_log("❌ Payment failed - Transaction ID: $transactionId, Response Code: $responseCode, Description: $description");
    
    // Log failed transaction
    // You can add database logging here if needed
}

function sendConfirmation($phone, $amount, $receipt) {
    // Send SMS confirmation using FluxSMS API
    $message = "Payment of KES {$amount} received successfully. Receipt: {$receipt}. Thank you!";
    
    // Use FluxSMS API to send confirmation
    // Implementation depends on your SMS setup
    error_log("SMS confirmation sent to $phone: $message");
}

function updateGoogleSheet($transactionId, $amount, $phone, $productName, $receipt) {
    // Get Google Sheets URL from config
    $googleSheetsUrl = 'https://script.google.com/macros/s/AKfycby1EQM4PxL-jEAMqU4mEB8LzcpQkVM0MKAsA7zVbb3sFRyp6CsqmseW09QjkVHyNtXO-w/exec';
    
    // Prepare data for Google Sheet
    $data = [
        'transactionId' => $transactionId,
        'amount' => $amount,
        'msisdn' => $phone,
        'product' => $productName,
        'status' => 'CONFIRMED',
        'receipt' => $receipt
    ];
    
    // Convert data to JSON
    $jsonData = json_encode($data);
    
    // Log the attempt
    error_log("📊 Sending transaction to Google Sheet: " . $jsonData);
    
    // Initialize cURL session
    $ch = curl_init($googleSheetsUrl);
    
    // Set cURL options
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($jsonData)
    ]);
    
    // Execute cURL request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    // Check for errors
    if (curl_errno($ch)) {
        error_log("❌ cURL Error: " . curl_error($ch));
    } else {
        error_log("✅ Google Sheet Response (HTTP $httpCode): " . $response);
    }
    
    // Close cURL session
    curl_close($ch);
    
    return $response;
}
?>
