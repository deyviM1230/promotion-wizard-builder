import { zodResolver } from "@hookform/resolvers/zod";
import { Gift, Plus, Trash2 } from "lucide-react";
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
	giftProducts,
	rewardTypes,
	type Step3Data,
	step3Schema,
} from "@/lib/promotionSchema";

export function Step3Rewards() {
	const { formData, updateFormData, nextStep, prevStep } = useWizard();

	const form = useForm<Step3Data>({
		resolver: zodResolver(step3Schema),
		defaultValues: {
			rewards: formData.rewards?.length ? formData.rewards : [],
		},
		mode: "onChange",
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "rewards",
	});

	const addReward = () => {
		append({
			id: crypto.randomUUID(),
			type: "percentDiscount",
			value: "",
		});
	};

	const onSubmit = (data: Step3Data) => {
		updateFormData(data);
		nextStep();
	};

	const handleBack = () => {
		updateFormData({ rewards: form.getValues().rewards });
		prevStep();
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold text-text-dark">
					Beneficios a otorgar
				</h2>
				<p className="text-text-gray">
					Define los premios que recibirá el cliente al cumplir las condiciones
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Rewards List */}
					<div className="space-y-4">
						{fields.map((field, index) => (
							<Card
								key={field.id}
								className="border-border hover:border-brand-teal/40 transition-colors"
							>
								<CardContent className="pt-6">
									<div className="flex items-start gap-3 mb-4">
										<div className="p-2 rounded-lg bg-brand-orange/10">
											<Gift className="h-5 w-5 text-brand-orange" />
										</div>
										<span className="text-sm font-medium text-text-gray mt-2">
											Premio #{index + 1}
										</span>
									</div>

									<div className="flex flex-col md:flex-row gap-4">
										{/* Reward Type Select */}
										<FormField
											control={form.control}
											name={`rewards.${index}.type`}
											render={({ field: typeField }) => (
												<FormItem className="flex-1">
													<FormLabel className="text-text-dark font-medium">
														Tipo de premio
													</FormLabel>
													<Select
														value={typeField.value}
														onValueChange={(value) => {
															typeField.onChange(value);
															form.setValue(`rewards.${index}.value`, "");
														}}
													>
														<FormControl>
															<SelectTrigger className="border-border focus:ring-brand-teal">
																<SelectValue placeholder="Selecciona tipo" />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="bg-background border-border">
															{rewardTypes.map((type) => (
																<SelectItem key={type.value} value={type.value}>
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
											name={`rewards.${index}.value`}
											render={({ field: valueField }) => {
												const rewardType = form.watch(`rewards.${index}.type`);

												if (rewardType === "percentDiscount") {
													return (
														<FormItem className="flex-1">
															<FormLabel className="text-text-dark font-medium">
																Porcentaje (%)
															</FormLabel>
															<FormControl>
																<Input
																	type="number"
																	min={1}
																	max={100}
																	placeholder="Ej: 10"
																	className="border-border focus:border-brand-teal focus:ring-brand-teal"
																	value={valueField.value as string}
																	onChange={(e) => {
																		const val = Math.min(
																			100,
																			Math.max(0, Number(e.target.value)),
																		);
																		valueField.onChange(val);
																	}}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													);
												}

												if (rewardType === "fixedDiscount") {
													return (
														<FormItem className="flex-1">
															<FormLabel className="text-text-dark font-medium">
																Monto fijo ($)
															</FormLabel>
															<FormControl>
																<Input
																	type="number"
																	min={0}
																	placeholder="Ej: 500"
																	className="border-border focus:border-brand-teal focus:ring-brand-teal"
																	value={valueField.value as string}
																	onChange={(e) =>
																		valueField.onChange(Number(e.target.value))
																	}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													);
												}

												if (rewardType === "freeProduct") {
													return (
														<FormItem className="flex-1">
															<FormLabel className="text-text-dark font-medium">
																Producto de regalo
															</FormLabel>
															<Select
																value={valueField.value as string}
																onValueChange={valueField.onChange}
															>
																<FormControl>
																	<SelectTrigger className="border-border focus:ring-brand-teal">
																		<SelectValue placeholder="Selecciona producto" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent className="bg-background border-border">
																	{giftProducts.map((product) => (
																		<SelectItem
																			key={product.value}
																			value={product.value}
																		>
																			{product.label}
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
						))}
					</div>

					{/* Add Reward Button */}
					<Button
						type="button"
						variant="outline"
						className="w-full border-dashed border-brand-orange text-brand-orange hover:bg-brand-orange/5 hover:text-brand-orange"
						onClick={addReward}
					>
						<Plus className="mr-2 h-4 w-4" />
						Añadir Premio
					</Button>

					{form.formState.errors.rewards && (
						<p className="text-sm text-destructive">
							{form.formState.errors.rewards.message}
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
