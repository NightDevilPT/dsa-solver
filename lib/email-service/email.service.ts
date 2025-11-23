// Email Service
// Main email service using nodemailer
// Handles sending emails using only auth configuration

import nodemailer, { Transporter } from "nodemailer";

// Email options interface
export interface EmailOptions {
	to: string | string[];
	from?: string;
	subject: string;
	html?: string;
	text?: string;
	cc?: string | string[];
	bcc?: string | string[];
	replyTo?: string;
	attachments?: Array<{
		filename: string;
		content?: string | Buffer;
		path?: string;
		contentType?: string;
	}>;
}

class EmailService {
	private transporter: Transporter | null = null;

	/**
	 * Initialize email service from environment variables
	 * Uses only auth configuration (service-based, e.g., Gmail)
	 */
	initializeFromEnv(): void {
		const emailId = process.env.EMAIL_ID || "";
		const emailPassword = process.env.EMAIL_PASSWORD || "";

		if (!emailId || !emailPassword) {
			throw new Error(
				"Email credentials not configured. Please set EMAIL_ID and EMAIL_PASSWORD environment variables."
			);
		}

		// Use service-based configuration (Gmail) with only auth
		this.transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: emailId,
				pass: emailPassword,
			},
		});
	}

	/**
	 * Send email using email options
	 * Auto-initializes if not already initialized
	 */
	async sendEmail(options: EmailOptions): Promise<void> {
		// Auto-initialize if not already done
		if (!this.transporter) {
			try {
				this.initializeFromEnv();
			} catch (error) {
				throw new Error(
					"Email service not initialized. Please set EMAIL_ID and EMAIL_PASSWORD environment variables."
				);
			}
		}

		// Type guard: transporter should be initialized now
		if (!this.transporter) {
			throw new Error("Email service initialization failed.");
		}

		const mailOptions = {
			from: options.from || process.env.EMAIL_ID,
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
		};

		try {
			const info = await this.transporter.sendMail(mailOptions);
			console.log("Email sent successfully:", info.messageId);
		} catch (error) {
			console.error("Failed to send email:", error);
			throw error;
		}
	}

	/**
	 * Verify SMTP connection
	 */
	async verifyConnection(): Promise<boolean> {
		if (!this.transporter) {
			throw new Error("Email service not initialized.");
		}

		try {
			await this.transporter.verify();
			return true;
		} catch (error) {
			console.error("SMTP connection verification failed:", error);
			return false;
		}
	}
}

// Singleton instance
const emailService = new EmailService();

// Initialize from environment variables on module load
if (process.env.EMAIL_ID && process.env.EMAIL_PASSWORD) {
	try {
		emailService.initializeFromEnv();
	} catch (error) {
		console.warn("Email service initialization failed:", error);
	}
}

export default emailService;
