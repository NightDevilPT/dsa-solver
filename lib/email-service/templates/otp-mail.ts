// OTP Email Template
// Template for sending OTP codes to users

import { EmailOptions } from '../email.service';

interface OTPMailData {
	email: string;
	otpCode: string;
	userName?: string;
	isNewUser?: boolean;
}

/**
 * Generate OTP email options
 */
export function buildOTPEmail(data: OTPMailData): EmailOptions {
	const { email, otpCode, userName, isNewUser = false } = data;

	const greeting = userName ? `Hello ${userName},` : 'Hello,';
	const introText = isNewUser
		? 'Welcome to DSA Solver! We\'re excited to have you on board.'
		: 'You requested a login code for your DSA Solver account.';

	const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Your Login Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
	<table role="presentation" style="width: 100%; border-collapse: collapse;">
		<tr>
			<td style="padding: 20px 0; text-align: center; background-color: #ffffff;">
				<h1 style="margin: 0; color: #333333;">DSA Solver</h1>
			</td>
		</tr>
		<tr>
			<td style="padding: 40px 20px; background-color: #f4f4f4;">
				<table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
					<tr>
						<td style="padding: 40px 30px;">
							<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
								${greeting}
							</p>
							<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
								${introText}
							</p>
							<p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #333333;">
								Your login code is:
							</p>
							<div style="text-align: center; margin: 30px 0;">
								<div style="display: inline-block; padding: 20px 40px; background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px;">
									<code style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #007bff; font-family: 'Courier New', monospace;">
										${otpCode}
									</code>
								</div>
							</div>
							<p style="margin: 30px 0 0 0; font-size: 14px; line-height: 1.6; color: #666666;">
								This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
							</p>
							<p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.6; color: #666666;">
								Best regards,<br>
								The DSA Solver Team
							</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
				<p style="margin: 0; font-size: 12px; color: #999999;">
					© ${new Date().getFullYear()} DSA Solver. All rights reserved.
				</p>
			</td>
		</tr>
	</table>
</body>
</html>
	`.trim();

	const text = `
${greeting}

${introText}

Your login code is: ${otpCode}

This code will expire in 10 minutes. If you didn't request this code, please ignore this email.

Best regards,
The DSA Solver Team
	`.trim();

	return {
		to: email,
		subject: isNewUser ? 'Welcome to DSA Solver - Your Login Code' : 'Your DSA Solver Login Code',
		html,
		text,
	};
}

