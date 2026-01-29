import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useWizard } from "@/context/WizardContext";
import {
	categories,
	customerTags,
	ruleTypes,
	type Step2Data,
	step2Schema,
} from "@/lib/promotionSchema";

export function Step2Rules() {
	const { formData, updateFormData, nextStep, prevStep } = useWizard();

	const form = useForm<Step2Data>({
		resolver: zodResolver(step2Schema),
		defaultValues: {
			rules: formData.rules?.length ? formData.rules : [],
		},
		mode: "onChange",
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "rules",
	});

	const addRule = () => {
		append({
			id: crypto.randomUUID(),
			type: "minAmount",
			value: "",
		});
	};

	const onSubmit = (data: Step2Data) => {
		updateFormData(data);
		nextStep();
	};

	const handleBack = () => {
		updateFormData({ rules: form.getValues().rules });
		prevStep();
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold text-text-dark">
					Condiciones para activar
				</h2>
				<p className="text-text-gray">
					Define las reglas que deben cumplirse para aplicar esta promoción
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Rules List */}
					<div className="space-y-4">
						{fields.map((field, index) => (
							<div key={field.id}>
								{/* AND Connector */}
								{index > 0 && (
									<div className="flex items-center justify-center my-4">
										<div className="flex-1 h-px bg-connector-line" />
										<span className="mx-4 px-3 py-1 text-xs font-medium text-brand-teal bg-brand-teal/10 rounded-full border border-brand-teal/20">
											Y (AND)
										</span>
										<div className="flex-1 h-px bg-connector-line" />
									</div>
								)}

								<Card className="border-border hover:border-brand-teal/40 transition-colors">
									<CardContent className="pt-6">
										<div className="flex flex-col md:flex-row gap-4">
											{/* Rule Type Select */}
											<FormField
												control={form.control}
												name={`rules.${index}.type`}
												render={({ field: typeField }) => (
													<FormItem className="flex-1">
														<FormLabel className="text-text-dark font-medium">
															Tipo de regla
														</FormLabel>
														<Select
															value={typeField.value}
															onValueChange={(value) => {
																typeField.onChange(value);
																// Reset value when type changes
																form.setValue(`rules.${index}.value`, "");
															}}
														>
															<FormControl>
																<SelectTrigger className="border-border focus:ring-brand-teal">
																	<SelectValue placeholder="Selecciona tipo" />
																</SelectTrigger>
															</FormControl>
															<SelectContent className="bg-background border-border">
																{ruleTypes.map((type) => (
																	<SelectItem
																		key={type.value}
																		value={type.value}
																	>
																		{type.label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											{/* Dynamic Value Field */}
											<FormField
												control={form.control}
												name={`rules.${index}.value`}
												render={({ field: valueField }) => {
													const ruleType = form.watch(`rules.${index}.type`);

													if (ruleType === "minAmount") {
														return (
															<FormItem className="flex-1">
																<FormLabel className="text-text-dark font-medium">
																	Monto mínimo ($)
																</FormLabel>
																<FormControl>
																	<Input
																		type="number"
																		min={0}
																		placeholder="Ej: 50"
																		className="border-border focus:border-brand-teal focus:ring-brand-teal"
																		value={valueField.value as string}
																		onChange={(e) =>
																			valueField.onChange(
																				Number(e.target.value),
																			)
																		}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														);
													}

													if (ruleType === "category") {
														return (
															<FormItem className="flex-1">
																<FormLabel className="text-text-dark font-medium">
																	Categoría
																</FormLabel>
																<Select
																	value={valueField.value as string}
																	onValueChange={valueField.onChange}
																>
																	<FormControl>
																		<SelectTrigger className="border-border focus:ring-brand-teal">
																			<SelectValue placeholder="Selecciona categoría" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent className="bg-background border-border">
																		{categories.map((cat) => (
																			<SelectItem
																				key={cat.value}
																				value={cat.value}
																			>
																				{cat.label}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														);
													}

													if (ruleType === "customerTag") {
														return (
															<FormItem className="flex-1">
																<FormLabel className="text-text-dark font-medium">
																	Etiqueta de cliente
																</FormLabel>
																<Select
																	value={valueField.value as string}
																	onValueChange={valueField.onChange}
																>
																	<FormControl>
																		<SelectTrigger className="border-border focus:ring-brand-teal">
																			<SelectValue placeholder="Selecciona etiqueta" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent className="bg-background border-border">
																		{customerTags.map((tag) => (
																			<SelectItem
																				key={tag.value}
																				value={tag.value}
																			>
																				{tag.label}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														);
													}

													return (
														<FormItem className="flex-1">
															<FormLabel className="text-text-dark font-medium">
																Valor
															</FormLabel>
															<FormControl>
																<Input
																	placeholder="Valor"
																	className="border-border"
																	{...valueField}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													);
												}}
											/>

											{/* Delete Button */}
											<div className="flex items-end">
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="text-destructive hover:text-destructive hover:bg-destructive/10"
													onClick={() => remove(index)}
												>
													<Trash2 className="h-5 w-5" />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						))}
					</div>

					{/* Add Rule Button */}
					<Button
						type="button"
						variant="outline"
						className="w-full border-dashed border-brand-teal text-brand-teal hover:bg-brand-teal/5 hover:text-brand-teal"
						onClick={addRule}
					>
						<Plus className="mr-2 h-4 w-4" />
						Añadir Regla
					</Button>

					{form.formState.errors.rules && (
						<p className="text-sm text-destructive">
							{form.formState.errors.rules.message}
						</p>
					)}

					{/* Navigation Buttons */}
					<div className="flex justify-between pt-4">
						<Button
							type="button"
							variant="outline"
							className="border-border text-text-dark hover:bg-secondary"
							onClick={handleBack}
						>
							Anterior
						</Button>
						<Button
							type="submit"
							className="bg-brand-orange hover:bg-brand-orange-hover text-white font-medium px-8"
						>
							Siguiente
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
