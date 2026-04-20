import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { updateOfficerNameMutation } from "@/queries/officer";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const UpdateNameSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
});

type UpdateNameFormData = z.infer<typeof UpdateNameSchema>;

type Props = {
	officerId?: string;
	firstName: string;
	lastName: string;
	editable?: boolean;
};

export function UpdateName({ officerId, firstName, lastName, editable = false }: Props) {
	const initialValues = {
		firstName,
		lastName,
	};

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		reset,
	} = useForm<UpdateNameFormData>({
		resolver: zodResolver(UpdateNameSchema),
		defaultValues: initialValues,
	});

	const { mutateAsync: updateName, isPending } = useMutation(
		updateOfficerNameMutation
	);

	useEffect(() => {
		reset(initialValues);
	}, [firstName, lastName, reset]);

	const onSubmit = async (data: UpdateNameFormData) => {
		try {
			await updateName({ officerId, ...data });
			reset(data);
			toast.success("Name updated successfully");
		} catch (error) {
			toast.error("Failed to update name");
		}
	};

	if (!editable) {
		return (
			<div className="flex flex-col items-stretch gap-2 text-center">
				<h1 className="text-2xl font-bold text-white">
					{firstName} {lastName}
				</h1>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="mx-auto flex w-full flex-col gap-6 text-left"
		>
			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<label className="block text-sm font-medium text-white/70">
						First Name
					</label>
					<Input
						{...register("firstName")}
						placeholder="First Name"
						className="h-12 border-white/10 bg-white/5 text-lg text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/10 focus:border-white/20"
					/>
					{errors.firstName && (
						<p className="text-sm text-red-400">{errors.firstName.message}</p>
					)}
				</div>
				<div className="space-y-2">
					<label className="block text-sm font-medium text-white/70">Last Name</label>
					<Input
						{...register("lastName")}
						placeholder="Last Name"
						className="h-12 border-white/10 bg-white/5 text-lg text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/10 focus:border-white/20"
					/>
					{errors.lastName && (
						<p className="text-sm text-red-400">{errors.lastName.message}</p>
					)}
				</div>
			</div>
			<Button
				type="submit"
				disabled={isPending || !isDirty}
				className="sr-only"
				aria-hidden="true"
				tabIndex={-1}
			>
				{isPending ? "Saving..." : "Save Changes"}
			</Button>
		</form>
	);
}
