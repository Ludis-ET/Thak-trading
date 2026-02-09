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


$recaptcha_secret = getenv('RECAPTCHA_SECRET_KEY') ?: '6LehxGUsAAAAAMkEFb_mVXrhlm_tQLBX4LvsofpZ';
$email_user = getenv('EMAIL_USER') ?: 'leulsegedmelaku1020@gmail.com';
$bypass_recaptcha = getenv('BYPASS_RECAPTCHA') === 'true' || false;

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$company = $input['company'] ?? '';
$message = $input['message'] ?? '';
$captchaToken = $input['captchaToken'] ?? '';

// 1. Verify ReCAPTCHA
if (!$bypass_recaptcha && !empty($recaptcha_secret)) {
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
$to = $email_user; 
$subject = "New Inquiry from $name - " . ($company ?: 'Thak Trading Website');

// Best practice: Set 'From' to a domain-aligned email to avoid spoofing filters,
// and use 'Reply-To' for the user's email.
$from_email = "no-reply@" . $_SERVER['HTTP_HOST'];
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Thak Trading <$from_email>" . "\r\n";
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
