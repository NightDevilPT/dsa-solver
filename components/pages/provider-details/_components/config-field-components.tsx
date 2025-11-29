"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Check, X, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ConfigToggleProps {
	title: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	disabled?: boolean;
}

export function ConfigToggle({
	title,
	description,
	checked,
	onCheckedChange,
	disabled = false,
}: ConfigToggleProps) {
	const handleClick = () => {
		if (!disabled) {
			onCheckedChange(!checked);
		}
	};

	return (
		<div
			onClick={handleClick}
			className={cn(
				"relative flex items-start justify-between gap-4 p-4 border rounded-lg bg-card hover:bg-muted/30 hover:border-primary/20 transition-all duration-200 group h-full cursor-pointer",
				disabled && "cursor-not-allowed opacity-50",
				checked && "border-primary/40 bg-primary/5"
			)}
		>
			{/* Check/Uncheck indicator at the top */}
			<div className="absolute top-2 right-2">
				{checked ? (
					<div className="flex items-center justify-center size-5 rounded-full bg-primary text-primary-foreground">
						<Check className="size-3" />
					</div>
				) : (
					<div className="flex items-center justify-center size-5 rounded-full bg-muted border-2 border-muted-foreground/30"></div>
				)}
			</div>
			<div className="flex-1 space-y-1.5 min-w-0 pr-3">
				<Label className="text-sm font-semibold leading-snug text-foreground block">
					{title}
				</Label>
				<Label className="text-xs text-muted-foreground leading-relaxed block line-clamp-2">
					{description}
				</Label>
			</div>
		</div>
	);
}

interface ConfigInputProps {
	title: string;
	description: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	type?: string;
	min?: number;
	max?: number;
	disabled?: boolean;
}

export function ConfigInput({
	title,
	description,
	value,
	onChange,
	placeholder,
	type = "text",
	min,
	max,
	disabled = false,
}: ConfigInputProps) {
	return (
		<div className="flex flex-col gap-1.5 p-4 border rounded-lg bg-card hover:bg-muted/30 hover:border-primary/20 transition-all duration-200 h-full">
			<div className="space-y-1.5">
				<Label className="text-sm font-semibold leading-snug text-foreground block">
					{title}
				</Label>
				<Label className="text-xs text-muted-foreground leading-relaxed block line-clamp-2">
					{description}
				</Label>
			</div>
			<Input
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				min={min}
				max={max}
				disabled={disabled}
				className="w-full mt-2"
			/>
		</div>
	);
}

interface ConfigSelectProps {
	title: string;
	description: string;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
	disabled?: boolean;
}

export function ConfigSelect({
	title,
	description,
	value,
	onChange,
	options,
	disabled = false,
}: ConfigSelectProps) {
	return (
		<div className="flex flex-col gap-1.5 p-4 border rounded-lg bg-card hover:bg-muted/30 hover:border-primary/20 transition-all duration-200 h-full">
			<div className="space-y-1.5">
				<Label className="text-sm font-semibold leading-snug text-foreground block">
					{title}
				</Label>
				<Label className="text-xs text-muted-foreground leading-relaxed block line-clamp-2">
					{description}
				</Label>
			</div>
			<Select value={value} onValueChange={onChange} disabled={disabled}>
				<SelectTrigger className="w-full mt-2">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

interface ConfigArrayProps {
	title: string;
	description: string;
	value: string[];
	onChange: (value: string[]) => void;
	options?: string[];
	placeholder?: string;
	disabled?: boolean;
}

export function ConfigArray({
	title,
	description,
	value,
	onChange,
	options,
	placeholder,
	disabled = false,
}: ConfigArrayProps) {
	const [inputValue, setInputValue] = useState("");

	const handleAdd = () => {
		if (inputValue.trim() && !value.includes(inputValue.trim())) {
			onChange([...value, inputValue.trim()]);
			setInputValue("");
		}
	};

	const handleRemove = (item: string) => {
		onChange(value.filter((v) => v !== item));
	};

	const handleSelectOption = (option: string) => {
		if (!value.includes(option)) {
			onChange([...value, option]);
		}
	};

	return (
		<div className="flex flex-col gap-1.5 p-4 border rounded-lg bg-card hover:bg-muted/30 hover:border-primary/20 transition-all duration-200 h-full">
			<div className="space-y-1.5">
				<Label className="text-sm font-semibold leading-snug text-foreground block">
					{title}
				</Label>
				<Label className="text-xs text-muted-foreground leading-relaxed block line-clamp-2">
					{description}
				</Label>
			</div>
			<div className="space-y-2 mt-2">
				{/* Selected items */}
				{value.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{value.map((item) => (
							<Badge
								key={item}
								variant="secondary"
								className="gap-1 pr-1"
							>
								{item}
								<button
									type="button"
									onClick={() => handleRemove(item)}
									disabled={disabled}
									className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
								>
									<X className="size-3" />
								</button>
							</Badge>
						))}
					</div>
				)}
				{/* Add input */}
				<div className="flex gap-2">
					{options ? (
						<Select
							value=""
							onValueChange={handleSelectOption}
							disabled={disabled}
						>
							<SelectTrigger className="flex-1">
								<SelectValue
									placeholder={
										placeholder || "Select an option"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{options
									.filter((opt) => !value.includes(opt))
									.map((option) => (
										<SelectItem key={option} value={option}>
											{option}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					) : (
						<>
							<Input
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleAdd();
									}
								}}
								placeholder={
									placeholder || "Enter value and press Enter"
								}
								disabled={disabled}
								className="flex-1"
							/>
							<Button
								type="button"
								onClick={handleAdd}
								disabled={disabled || !inputValue.trim()}
								size="icon"
								variant="outline"
							>
								<Plus className="size-4" />
							</Button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

