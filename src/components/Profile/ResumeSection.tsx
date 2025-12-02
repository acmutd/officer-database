import { useMutation, useQuery } from "@tanstack/react-query";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileText, Upload, Loader2, Eye } from "lucide-react";
import { uploadResumeMutation, getResumeUrlQuery } from "@/queries/resume";
import { getOfficerQuery } from "@/queries/officer";
import { toast } from "sonner";
import { useRef } from "react";

export function ResumeSection() {
	const { data: officer, isLoading: isOfficerLoading } =
		useQuery(getOfficerQuery);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { refetch: viewResume, isFetching: isViewing } = useQuery({
		...getResumeUrlQuery(officer?.id ?? ""),
		enabled: false,
	});

	const { mutate: uploadResume, isPending: isUploading } = useMutation({
		...uploadResumeMutation,
		onSuccess: (_, __, ___, context) => {
			context.client.refetchQueries(getOfficerQuery);
			toast.success("Resume uploaded successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to upload resume");
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) {
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error("Resume size must be less than 5MB");
			return;
		}

		if (!officer?.id) {
			toast.error("User ID not found");
			return;
		}
		uploadResume({ file, officerId: officer.id });
	};

	const handleViewResume = async () => {
		if (!officer?.id) return;

		try {
			const { data: resumeUrl, isError } = await viewResume();

			if (isError) {
				throw new Error("Failed to fetch resume");
			}

			if (resumeUrl) {
				window.open(resumeUrl, "_blank");
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to load resume");
		}
	};

	return (
		<Card className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 shadow-xl backdrop-blur-xl">
			<CardHeader className="flex flex-row items-center justify-between space-y-0">
				<div>
					<CardTitle className="text-xl font-semibold text-white">
						Resume
					</CardTitle>
					<CardDescription className="text-white/50">
						Upload and manage your resume
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-4">
					{isOfficerLoading ? (
						<div className="flex items-center justify-center py-4">
							<Loader2 className="h-6 w-6 animate-spin text-white/50" />
						</div>
					) : officer?.resumeUpdatedAt ? (
						<div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
							<div className="flex items-center gap-3">
								<div className="rounded-full bg-blue-500/10 p-2">
									<FileText className="h-6 w-6 text-blue-500" />
								</div>
								<div>
									<p className="font-medium text-white">Current Resume</p>
									<p className="text-xs text-white/50">
										Last updated:{" "}
										{new Date(officer.resumeUpdatedAt).toLocaleDateString()}
									</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="gap-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
								onClick={handleViewResume}
								disabled={isViewing}
							>
								{isViewing ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Eye className="h-4 w-4" />
								)}
								View
							</Button>
						</div>
					) : (
						<div className="text-center text-white/50 py-4">
							No resume uploaded
						</div>
					)}

					<div className="flex flex-col gap-2">
						<Label htmlFor="resume-upload" className="sr-only">
							{officer?.resumeUpdatedAt ? "Replace Resume" : "Upload Resume"}
						</Label>
						<Input
							id="resume-upload"
							type="file"
							accept=".PDF,.pdf"
							className="hidden"
							ref={fileInputRef}
							onChange={handleFileChange}
						/>
						<Button
							variant="secondary"
							className="w-full gap-2"
							onClick={() => fileInputRef.current?.click()}
							disabled={isUploading}
						>
							{isUploading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Upload className="h-4 w-4" />
							)}
							{officer?.resumeUpdatedAt ? "Replace Resume" : "Upload Resume"}
						</Button>
						<p className="text-center text-xs text-white/30">
							Supported format: PDF
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
