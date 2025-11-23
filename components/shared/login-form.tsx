"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { loginSchema, verifyOTPSchema } from "@/lib/validation/otp.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import apiService from "@/lib/api-service/api.service";

interface LoginFormProps {
	onSuccess?: () => void;
	className?: string;
}

type LoginFormData = z.infer<typeof loginSchema>;
type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;

export function LoginForm({ onSuccess, className }: LoginFormProps) {
	const { t } = useTranslation();
	const router = useRouter();
	const [step, setStep] = useState<"email" | "otp">("email");
	const [email, setEmail] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);

	// Email form
	const emailForm = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
		},
	});

	// OTP form
	const otpForm = useForm<VerifyOTPFormData>({
		resolver: zodResolver(verifyOTPSchema),
		defaultValues: {
			email: "",
			otpCode: "",
		},
	});

	const onEmailSubmit = async (data: LoginFormData) => {
		setIsLoading(true);
		try {
			const result = await apiService.post("/api/public/auth/login", data);

			if (!result.success) {
				toast.error(result.message || t("auth.login.error"));
				setIsLoading(false);
				return;
			}

			// Only proceed to OTP step if successful
			setEmail(data.email);
			otpForm.setValue("email", data.email);
			otpForm.setValue("otpCode", ""); // Reset OTP field
			setStep("otp");
			toast.success(t("auth.login.otpSent"));
		} catch (error) {
			console.error("Login error:", error);
			toast.error(t("auth.login.error"));
		} finally {
			setIsLoading(false);
		}
	};

	const onOTPSubmit = async (data: VerifyOTPFormData) => {
		setIsLoading(true);
		try {
			const result = await apiService.post(
				"/api/public/auth/verify-otp",
				data
			);

			if (!result.success) {
				toast.error(result.message || t("auth.verifyOtp.error"));
				return;
			}

			toast.success(t("auth.verifyOtp.success"));
			onSuccess?.();
			router.refresh();
		} catch (error) {
			console.error("Verify OTP error:", error);
			toast.error(t("auth.verifyOtp.error"));
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendOTP = async () => {
		if (!email) return;
		setIsLoading(true);
		try {
			const result = await apiService.post("/api/public/auth/login", {
				email,
			});

			if (!result.success) {
				toast.error(result.message || t("auth.login.error"));
				return;
			}

			toast.success(t("auth.login.otpResent"));
		} catch (error) {
			console.error("Resend OTP error:", error);
			toast.error(t("auth.login.error"));
		} finally {
			setIsLoading(false);
		}
	};

	if (step === "otp") {
		return (
			<div className={className}>
				<Form {...otpForm}>
					<form onSubmit={otpForm.handleSubmit(onOTPSubmit)}>
						<div className="space-y-6">
							<div>
								<h2 className="text-2xl font-semibold">
									{t("auth.verifyOtp.title")}
								</h2>
								<Label className="text-muted-foreground text-sm font-normal mt-1">
									{t("auth.verifyOtp.description").replace("{email}", email)}
								</Label>
							</div>

							<FormField
								control={otpForm.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("auth.login.emailLabel")}</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder={t("auth.login.emailPlaceholder")}
												disabled={true}
												{...field}
											/>
										</FormControl>
										<FormDescription>
											{t("auth.login.emailDescription")}
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={otpForm.control}
								name="otpCode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("auth.verifyOtp.otpLabel")}</FormLabel>
										<FormControl>
											<InputOTP
												maxLength={6}
												value={field.value}
												onChange={field.onChange}
												disabled={isLoading}
											>
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<FormDescription>
											{t("auth.verifyOtp.otpDescription")}
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex flex-col gap-3">
								<Button type="submit" disabled={isLoading}>
									{isLoading
										? t("auth.verifyOtp.verifying")
										: t("auth.verifyOtp.submit")}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => setStep("email")}
									disabled={isLoading}
								>
									{t("auth.verifyOtp.back")}
								</Button>
								<Button
									type="button"
									variant="ghost"
									onClick={handleResendOTP}
									disabled={isLoading}
									className="text-sm"
								>
									{t("auth.verifyOtp.resend")}
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</div>
		);
	}

	return (
		<div className={className}>
			<Form {...emailForm}>
				<form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
					<div className="space-y-6">
						<div>
							<h2 className="text-2xl font-semibold">
								{t("auth.login.title")}
							</h2>
							<Label className="text-muted-foreground text-sm font-normal mt-1">
								{t("auth.login.description")}
							</Label>
						</div>

						<FormField
							control={emailForm.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("auth.login.emailLabel")}</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder={t("auth.login.emailPlaceholder")}
											disabled={isLoading}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										{t("auth.login.emailDescription")}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isLoading} className="w-full">
							{isLoading
								? t("auth.login.sending")
								: t("auth.login.submit")}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

