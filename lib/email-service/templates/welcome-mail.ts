// Welcome Email Template
// Template for welcoming new users

import { EmailOptions } from '../email.service';

interface WelcomeMailData {
	email: string;
	userName?: string;
}

/**
 * Generate welcome email options
 */
export function buildWelcomeEmail(data: WelcomeMailData): EmailOptions {
	const { email, userName } = data;

	const greeting = userName ? `Hello ${userName},` : 'Hello,';

	const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Welcome to DSA Solver</title>
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
								Welcome to DSA Solver! We're thrilled to have you join our community of problem solvers.
							</p>
							<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
								With DSA Solver, you can:
							</p>
							<ul style="margin: 0 0 20px 0; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #333333;">
								<li>Schedule daily DSA problems from LeetCode, GFG, and more</li>
								<li>Receive automated problem deliveries via email</li>
								<li>Track your progress and improve your coding skills</li>
							</ul>
							<p style="margin: 30px 0 0 0; font-size: 16px; line-height: 1.6; color: #333333;">
								Get started by configuring your providers and setting up your first scheduled task!
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

Welcome to DSA Solver! We're thrilled to have you join our community of problem solvers.

With DSA Solver, you can:
- Schedule daily DSA problems from LeetCode, GFG, and more
- Receive automated problem deliveries via email
- Track your progress and improve your coding skills

Get started by configuring your providers and setting up your first scheduled task!

Best regards,
The DSA Solver Team
	`.trim();

	return {
		to: email,
		subject: 'Welcome to DSA Solver!',
		html,
		text,
	};
}

