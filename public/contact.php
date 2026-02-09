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
$email_user = getenv('EMAIL_USER') ?: 'thaktrading@gmail.com';
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

// Using a professional sender email as requested. 
// Note: It's best if this domain matches your actual website domain.
$from_email = "admin@thaktrading.com"; 

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Thak Trading Support <$from_email>" . "\r\n";
$headers .= "Reply-To: $name <$email>" . "\r\n";
$headers .= "Return-Path: <$from_email>" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$email_content = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .wrapper { background-color: #f4f4f4; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background-color: #1c1917; padding: 30px; text-align: center; color: #f9f8f6; }
        .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
        .header span { color: #f1a310; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: bold; color: #1c1917; margin-bottom: 20px; border-bottom: 2px solid #45a069; padding-bottom: 10px; display: inline-block; }
        .info-grid { display: block; width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .info-row { border-bottom: 1px solid #eee; }
        .info-label { padding: 12px 0; font-weight: bold; color: #666; width: 120px; vertical-align: top; font-size: 14px; text-transform: uppercase; }
        .info-value { padding: 12px 0; color: #333; vertical-align: top; font-size: 16px; }
        .message-box { background-color: #f9f9f9; padding: 25px; border-radius: 8px; border-left: 4px solid #f1a310; margin-top: 20px; }
        .message-label { font-weight: bold; color: #1c1917; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
        .message-text { color: #444; font-style: italic; white-space: pre-wrap; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 13px; color: #888; border-top: 1px solid #eee; }
        .footer p { margin: 5px 0; }
        .accent-bar { height: 5px; background: linear-gradient(90deg, #45a069 0%, #f1a310 100%); }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="accent-bar"></div>
            <div class="header">
                <h1><span style="color: #f1a310;">THAK</span> TRADING</h1>
                <p style="margin: 5px 0 0; font-size: 12px; opacity: 0.8; color: #f9f8f6;">Inquiry Management System</p>
            </div>
            <div class="content">
                <div class="greeting">New Business Inquiry</div>
                <p style="color: #666; margin-bottom: 30px;">A new contact request has been received from the website. Details are provided below:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 12px 0; font-weight: bold; color: #666; width: 120px; vertical-align: top; font-size: 12px; text-transform: uppercase;">Contact Name</td>
                        <td style="padding: 12px 0; color: #333; vertical-align: top; font-size: 16px;"><strong>{$name}</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 12px 0; font-weight: bold; color: #666; width: 120px; vertical-align: top; font-size: 12px; text-transform: uppercase;">Email Address</td>
                        <td style="padding: 12px 0; color: #333; vertical-align: top; font-size: 16px;"><a href="mailto:{$email}" style="color: #45a069; text-decoration: none;">{$email}</a></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 12px 0; font-weight: bold; color: #666; width: 120px; vertical-align: top; font-size: 12px; text-transform: uppercase;">Company</td>
                        <td style="padding: 12px 0; color: #333; vertical-align: top; font-size: 16px;">" . ($company ?: 'Not specified') . "</td>
                    </tr>
                </table>

                <div class="message-box">
                    <div class="message-label">Detailed Requirements</div>
                    <div class="message-text">" . nl2br(htmlspecialchars($message)) . "</div>
                </div>

                <div style="margin-top: 40px; text-align: center;">
                    <a href="mailto:{$email}" style="background-color: #45a069; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Quick Reply</a>
                </div>
            </div>
            <div class="footer">
                <p><strong>Thak Trading One Member PLC</strong></p>
                <p>Sister Company of Tsion Alemayehu</p>
                <p style="font-size: 11px; margin-top: 15px;">This is an automated notification from thaktrading.com</p>
            </div>
        </div>
    </div>
</body>
</html>
HTML;

// 3. Send Email
// Using standard PHP mail() which works on most cPanel hosts
if (mail($to, $subject, $email_content, $headers)) {
    echo json_encode(["success" => true, "message" => "Email sent successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to send email. Server mail() command failed."]);
}
?>
