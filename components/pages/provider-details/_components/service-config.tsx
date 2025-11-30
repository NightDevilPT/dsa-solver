"use client";

import {
	ConfigToggle,
	ConfigInput,
	ConfigSelect,
	ConfigArray,
} from "./config-field-components";
import {
	ServiceConfigProps,
	ServiceConfigSchema,
	SchemaProperty,
} from "@/interface/provider-details.interface";
import { Save } from "lucide-react";
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProviderServiceContext } from "@/components/context/provider-service-context";

// Using shared components from config-field-components.tsx

export function ServiceConfig({
	service,
	userProviderService,
}: ServiceConfigProps) {
	const { t } = useTranslation();
	const { updateServiceConfig, loading: contextLoading } =
		useProviderServiceContext();
	const [config, setConfig] = useState<Record<string, any>>({});
	const [saving, setSaving] = useState(false);

	// Parse serviceConfigSchema
	const schema = useMemo<ServiceConfigSchema | null>(() => {
		if (!service.serviceConfigSchema) return null;
		try {
			return typeof service.serviceConfigSchema === "string"
				? JSON.parse(service.serviceConfigSchema)
				: service.serviceConfigSchema;
		} catch {
			return null;
		}
	}, [service.serviceConfigSchema]);

	// Initialize default config from schema
	const defaultConfig = useMemo(() => {
		if (!schema?.properties) return {};
		const defaults: Record<string, any> = {};
		Object.entries(schema.properties).forEach(([key, prop]) => {
			if (prop.default !== undefined) {
				defaults[key] = prop.default;
			} else if (prop.type === "array") {
				defaults[key] = [];
			} else if (prop.type === "boolean") {
				defaults[key] = false;
			} else if (prop.type === "number") {
				defaults[key] = prop.minimum || 0;
			} else {
				defaults[key] = "";
			}
		});
		return defaults;
	}, [schema]);

	// Initialize config from userProviderService or default
	useMemo(() => {
		if (userProviderService?.serviceConfig) {
			setConfig(userProviderService.serviceConfig);
		} else {
			setConfig(defaultConfig);
		}
	}, [userProviderService, defaultConfig]);

	const handleFieldChange = (field: string, value: any) => {
		setConfig((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = async () => {
		try {
			setSaving(true);
			await updateServiceConfig({ serviceConfig: config });
		} catch (error: any) {
			console.error("Error saving config:", error);
		} finally {
			setSaving(false);
		}
	};

	// Group fields by type for better organization
	const groupedFields = useMemo(() => {
		if (!schema?.properties)
			return { toggles: [], inputs: [], selects: [], arrays: [] };

		const groups = {
			toggles: [] as Array<{ key: string; prop: SchemaProperty }>,
			inputs: [] as Array<{ key: string; prop: SchemaProperty }>,
			selects: [] as Array<{ key: string; prop: SchemaProperty }>,
			arrays: [] as Array<{ key: string; prop: SchemaProperty }>,
		};

		Object.entries(schema.properties).forEach(([key, prop]) => {
			if (prop.type === "boolean") {
				groups.toggles.push({ key, prop });
			} else if (prop.type === "array") {
				groups.arrays.push({ key, prop });
			} else if (
				prop.enum ||
				prop.format === "time" ||
				key.toLowerCase().includes("timezone")
			) {
				groups.selects.push({ key, prop });
			} else {
				groups.inputs.push({ key, prop });
			}
		});

		return groups;
	}, [schema]);

	if (contextLoading) {
		return (
			<div className="space-y-6">
				{Array.from({ length: 5 }).map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-6 w-48" />
						</CardHeader>
						<CardContent className="space-y-4">
							{Array.from({ length: 3 }).map((_, j) => (
								<Skeleton key={j} className="h-20 w-full" />
							))}
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (!schema || !schema.properties) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 py-12">
				<Label className="text-lg text-muted-foreground">
					{t("providers.serviceDetail.config.noSchema")}
				</Label>
			</div>
		);
	}

	const hasUserRelation = !!userProviderService;
	const isDisabled = saving || contextLoading;

	return (
		<div className="space-y-6">
			{/* Header with Save Button */}
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<Label className="text-2xl font-bold">
						{t("providers.serviceDetail.tabs.config")}
					</Label>
					<Label className="text-sm text-muted-foreground">
						{t("providers.serviceDetail.config.pageDescription")}
					</Label>
				</div>
				<Button
					onClick={handleSave}
					disabled={isDisabled}
					className="gap-2"
					size="lg"
				>
					<Save className="size-4" />
					<Label>
						{t("providers.serviceDetail.config.saveButton")}
					</Label>
				</Button>
			</div>

			{/* Info Banner */}
			{!hasUserRelation && (
				<Card className="border-primary/20 bg-primary/5 shadow-sm">
					<CardContent className="pt-4 pb-4">
						<div className="flex items-start gap-3">
							<div className="flex-1 space-y-1">
								<Label className="text-sm font-semibold text-foreground">
									{t(
										"providers.serviceDetail.config.noRelationTitle"
									)}
								</Label>
								<Label className="text-xs text-muted-foreground block leading-relaxed">
									{t(
										"providers.serviceDetail.config.noRelationMessage"
									)}
								</Label>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Boolean Toggles */}
			{groupedFields.toggles.length > 0 && (
				<Card className="border-border/50 shadow-sm">
					<CardHeader className="pb-4 border-b">
						<CardTitle className="text-lg font-semibold">
							{t("providers.serviceDetail.config.togglesSection")}
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{groupedFields.toggles.map(({ key, prop }) => (
								<ConfigToggle
									key={key}
									title={
										key.charAt(0).toUpperCase() +
										key.slice(1).replace(/([A-Z])/g, " $1")
									}
									description={prop.description || ""}
									checked={
										config[key] ?? prop.default ?? false
									}
									onCheckedChange={(checked) =>
										handleFieldChange(key, checked)
									}
									disabled={isDisabled}
								/>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Text and Number Inputs */}
			{groupedFields.inputs.length > 0 && (
				<Card className="border-border/50 shadow-sm">
					<CardHeader className="pb-4 border-b">
						<CardTitle className="text-lg font-semibold">
							{t("providers.serviceDetail.config.inputsSection")}
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{groupedFields.inputs.map(({ key, prop }) => (
								<ConfigInput
									key={key}
									title={
										key.charAt(0).toUpperCase() +
										key.slice(1).replace(/([A-Z])/g, " $1")
									}
									description={prop.description || ""}
									value={String(
										config[key] ?? prop.default ?? ""
									)}
									onChange={(value) =>
										handleFieldChange(
											key,
											prop.type === "number"
												? value
													? Number(value)
													: prop.minimum || 0
												: value
										)
									}
									type={
										prop.type === "number"
											? "number"
											: "text"
									}
									min={prop.minimum}
									max={prop.maximum}
									placeholder={prop.description}
									disabled={isDisabled}
								/>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Select Fields (Enum and Time) */}
			{groupedFields.selects.length > 0 && (
				<Card className="border-border/50 shadow-sm">
					<CardHeader className="pb-4 border-b">
						<CardTitle className="text-lg font-semibold">
							{t("providers.serviceDetail.config.selectsSection")}
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{groupedFields.selects.map(({ key, prop }) => {
								let options: {
									value: string;
									label: string;
								}[] = [];

								// Use enum from schema if available
								const propEnum = prop.enum as
									| string[]
									| undefined;
								if (
									propEnum &&
									Array.isArray(propEnum) &&
									propEnum.length > 0
								) {
									// Use enum values directly from schema, format labels
									options = propEnum.map((val: string) => ({
										value: val,
										label:
											val.charAt(0).toUpperCase() +
											val.slice(1).replace(/_/g, " "),
									}));
								} else if (prop.format === "time") {
									// Generate time options (00:00 to 23:59 in 15-minute intervals)
									options = Array.from(
										{ length: 96 },
										(_, i) => {
											const hours = Math.floor(i / 4);
											const minutes = (i % 4) * 15;
											const time = `${String(
												hours
											).padStart(2, "0")}:${String(
												minutes
											).padStart(2, "0")}`;
											return { value: time, label: time };
										}
									);
								}

								return (
									<ConfigSelect
										key={key}
										title={
											key.charAt(0).toUpperCase() +
											key
												.slice(1)
												.replace(/([A-Z])/g, " $1")
										}
										description={prop.description || ""}
										value={String(
											config[key] ?? prop.default ?? ""
										)}
										onChange={(value) =>
											handleFieldChange(key, value)
										}
										options={options}
										disabled={isDisabled}
									/>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Array Fields */}
			{groupedFields.arrays.length > 0 && (
				<Card className="border-border/50 shadow-sm">
					<CardHeader className="pb-4 border-b">
						<CardTitle className="text-lg font-semibold">
							{t("providers.serviceDetail.config.arraysSection")}
						</CardTitle>
					</CardHeader>
					<CardContent className="">
						<div className="grid grid-cols-1 gap-4">
							{groupedFields.arrays.map(({ key, prop }) => {
								const arrayValue =
									config[key] ?? prop.default ?? [];
								const enumOptions = prop.items?.enum as
									| string[]
									| undefined;

								return (
									<ConfigArray
										key={key}
										title={
											key.charAt(0).toUpperCase() +
											key
												.slice(1)
												.replace(/([A-Z])/g, " $1")
										}
										description={prop.description || ""}
										value={
											Array.isArray(arrayValue)
												? arrayValue
												: []
										}
										onChange={(value) =>
											handleFieldChange(key, value)
										}
										options={enumOptions}
										placeholder={prop.description}
										disabled={isDisabled}
									/>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
