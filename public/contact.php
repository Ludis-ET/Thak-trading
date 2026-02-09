<?php
// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

// Configuration - EDIT THESE VALUES OR SET THEM IN YOUR SERVER ENVIRONMENT
// SECURITY WARNING: Ideally, set these in your hosting control panel's environment variable manager, specific to PHP.
// If you must hardcode them here, ensure this file is not publicly readable or accessible via git.
$recaptcha_secret = getenv('RECAPTCHA_SECRET_KEY') ?: 'YOUR_RECAPTCHA_SECRET_KEY';
$email_user = getenv('EMAIL_USER') ?: 'info@yourdomain.com';
/* 
   NOTE: For standard cPanel hosting using 'mail()', you typically don't need a password if sending from the server itself.
   If using SMTP (e.g., Gmail), you need a password. This script defaults to standard mail().
*/

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$company = $input['company'] ?? '';
$message = $input['message'] ?? '';
$captchaToken = $input['captchaToken'] ?? '';

// 1. Verify ReCAPTCHA
if (!empty($recaptcha_secret) && $recaptcha_secret !== 'YOUR_RECAPTCHA_SECRET_KEY') {
    $verifyUrl = "https://www.google.com/recaptcha/api/siteverify?secret={$recaptcha_secret}&response={$captchaToken}";
    $verifyResponse = file_get_contents($verifyUrl);
    $responseData = json_decode($verifyResponse);

    if (!$responseData->success) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "ReCAPTCHA verification failed"]);
        exit;
    }
}

// 2. Prepare Email
$to = $email_user; // Send to the site owner
$subject = "New Inquiry from $name - " . ($company ?: 'Thak Trading Website');

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: $email" . "\r\n"; // Send FROM the user's email so you can reply directly
$headers .= "Reply-To: $email" . "\r\n";

$email_content = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; }
        .header { background-color: #f8f9fa; padding: 15px; text-align: center; border-bottom: 1px solid #eee; }
        .content { padding: 20px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #555; }
        .footer { margin-top: 20px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
    </style>
</head>
<body>
    <div class='container'>
    <div class='header'>
        <h2>New Website Inquiry</h2>
    </div>
    <div class='content'>
        <div class='field'>
        <span class='label'>Name:</span> " . htmlspecialchars($name) . "
        </div>
        <div class='field'>
        <span class='label'>Email:</span> " . htmlspecialchars($email) . "
        </div>
        <div class='field'>
        <span class='label'>Company:</span> " . htmlspecialchars($company ?: 'Not specified') . "
        </div>
        <div class='field'>
        <span class='label'>Message:</span><br>
        <div style='background-color: #f9f9f9; padding: 10px; border-radius: 4px; margin-top: 5px;'>
            " . nl2br(htmlspecialchars($message)) . "
        </div>
        </div>
    </div>
    <div class='footer'>
        <p>This email was sent from the Thak Trading website contact form.</p>
    </div>
    </div>
</body>
</html>
";

// 3. Send Email
// Using standard PHP mail() which works on most cPanel hosts
if (mail($to, $subject, $email_content, $headers)) {
    echo json_encode(["success" => true, "message" => "Email sent successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to send email. Server mail() command failed."]);
}
?>
