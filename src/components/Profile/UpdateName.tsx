import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { updateOfficerNameMutation } from "@/queries/officer";
import { toast } from "@/lib/toast";
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
};

export function UpdateName({ officerId, firstName, lastName }: Props) {
	const [isEditing, setIsEditing] = useState(false);
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
			setIsEditing(false);
		} catch (error) {
			toast.error("Failed to update name");
		}
	};

	const handleCancel = () => {
		reset(initialValues);
		setIsEditing(false);
	};

	if (!isEditing) {
		return (
			<div className="flex flex-col items-stretch gap-2 text-center">
				<h1 className="text-2xl font-bold text-white">
					{firstName} {lastName}
				</h1>
				<Button
					data-haptic="selection"
					onClick={() => {
						reset(initialValues);
						setIsEditing(true);
					}}
					variant="outline"
					size="sm"
					className="border-white/20 bg-white/10 text-sm text-white hover:bg-white/20 hover:text-white/20"
				>
					Edit
				</Button>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="mx-auto flex w-full flex-col gap-6"
		>
			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<label className="text-sm font-medium text-white/70">
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
					<label className="text-sm font-medium text-white/70">Last Name</label>
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
			<div className="flex gap-3">
				<Button
					type="button"
					onClick={handleCancel}
					variant="outline"
					className="border-white/20 bg-white/10 px-6 text-white hover:bg-white/20"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					data-haptic="success"
					disabled={isPending || !isDirty}
					className="bg-acm-gradient px-6"
				>
					{isPending ? "Saving..." : "Save Changes"}
				</Button>
			</div>
		</form>
	);
}

