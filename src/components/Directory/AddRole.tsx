import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RoleSchema } from "@/schemas/officer";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { divisions } from "@/schemas/officer";
import { addOfficerRoleMutation } from "@/queries/roles";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

type RoleFormData = z.infer<typeof RoleSchema>;

type Props = {
	officerId: string;
};

export function AddRole({ officerId }: Props) {
	const [isOpen, setIsOpen] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		reset,
	} = useForm<RoleFormData>({
		resolver: zodResolver(RoleSchema),
		defaultValues: {
			title: "",
			division: "",
			level: 1,
			startDate: {
				term: "Fall",
				year: new Date().getFullYear(),
			},
			endDate: null,
		},
	});

	const { mutateAsync: addRole, isPending } = useMutation(
		addOfficerRoleMutation(officerId)
	);

	const onSubmit = async (data: RoleFormData) => {
		try {
			await addRole({ role: data, officerId });
			setIsOpen(false);
			reset();
			toast.success("Role added successfully");
		} catch (error) {
			toast.error("Failed to add role");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
				>
					<Plus className="h-4 w-4 text-white" />
				</Button>
			</DialogTrigger>
			<DialogContent className="border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl">
				<DialogHeader>
					<DialogTitle className="text-white">Add New Role</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<FieldGroup>
						<Field>
							<FieldContent>
								<FieldLabel htmlFor="title" className="text-white/70">
									Title
								</FieldLabel>
								<Input
									id="title"
									{...register("title")}
									className="border-white/10 bg-white/5 text-white"
									placeholder="Officer title"
								/>
								<FieldError errors={[errors.title]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldContent>
								<FieldLabel htmlFor="division" className="text-white/70">
									Division
								</FieldLabel>
								<Controller
									name="division"
									control={control}
									render={({ field }) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="border-white/10 bg-white/5 text-white">
												<SelectValue placeholder="Select division" />
											</SelectTrigger>
											<SelectContent className="border-white/10 bg-black/30 backdrop-blur-xl">
												{divisions.map((division) => (
													<SelectItem
														key={division}
														value={division}
														className="text-white"
													>
														{division}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								<FieldError errors={[errors.division]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldContent>
								<FieldLabel htmlFor="level" className="text-white/70">
									Level
								</FieldLabel>
								<Controller
									name="level"
									control={control}
									render={({ field }) => (
										<Select
											value={field.value.toString()}
											onValueChange={(value) => field.onChange(parseInt(value))}
										>
											<SelectTrigger className="border-white/10 bg-white/5 text-white">
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="border-white/10 bg-black/30 backdrop-blur-xl">
												<SelectItem value="1" className="text-white">
													Officer
												</SelectItem>
												<SelectItem value="2" className="text-white">
													Director
												</SelectItem>
												<SelectItem value="3" className="text-white">
													Executive
												</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
								<FieldError errors={[errors.level]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldContent>
								<FieldLabel className="text-white/70">Start Date</FieldLabel>
								<div className="flex space-x-2">
									<div className="flex-1">
										<Controller
											name="startDate.term"
											control={control}
											render={({ field }) => (
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger className="border-white/10 bg-white/5 text-white">
														<SelectValue />
													</SelectTrigger>
													<SelectContent className="border-white/10 bg-black/30 backdrop-blur-xl">
														<SelectItem value="Fall" className="text-white">
															Fall
														</SelectItem>
														<SelectItem value="Spring" className="text-white">
															Spring
														</SelectItem>
														<SelectItem value="Summer" className="text-white">
															Summer
														</SelectItem>
													</SelectContent>
												</Select>
											)}
										/>
									</div>
									<div className="flex-1">
										<Input
											type="number"
											min={2020}
											{...register("startDate.year", {
												valueAsNumber: true,
											})}
											className="border-white/10 bg-white/5 text-white"
											placeholder="Year"
										/>
									</div>
								</div>
								<FieldError
									errors={[errors.startDate?.term, errors.startDate?.year]}
								/>
							</FieldContent>
						</Field>
					</FieldGroup>

					<Button
						type="submit"
						disabled={isPending}
						className="w-full bg-white/10 text-white hover:bg-white/20"
					>
						{isPending ? "Adding..." : "Add Role"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
