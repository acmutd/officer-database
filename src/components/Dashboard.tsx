import { Officer } from "@/schemas/officer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface DashboardProps {
	officer: Officer;
}

const roleLabels: Record<number, string> = {
	1: "Officer",
	2: "Director",
	3: "Executive",
};

const getRoleDescription = (level: number): string => {
	const descriptions: Record<number, string> = {
		1: "Access to officer resources and forms",
		2: "Access to director resources and planning tools",
		3: "Full executive access with all permissions",
	};
	return descriptions[level] || "Standard access";
};

export function Dashboard({ officer }: DashboardProps) {
	const accessLevel = officer.accessLevel;
	const roleLabel = roleLabels[accessLevel];

	return (
		<div className="w-full max-w-6xl mx-auto space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-gray-600">
					Welcome, {officer.firstName}! You are logged in as{" "}
					<Badge>{roleLabel}</Badge>
				</p>
				<p className="text-sm text-gray-500">{getRoleDescription(accessLevel)}</p>
			</div>

			{/* Officer Dashboard */}
			{accessLevel >= 1 && (
				<div className="space-y-4">
					<h2 className="text-2xl font-semibold">Officer Resources</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{/* ACM Director Report Form */}
						<Card className="p-6 hover:shadow-lg transition-shadow">
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">ACM Director Report Form</h3>
								<p className="text-sm text-gray-600">
									Submit your monthly director report and updates
								</p>
								<Button
									variant="outline"
									className="w-full"
									onClick={() =>
										window.open(
											"https://forms.gle/directorReportForm",
											"_blank"
										)
									}
								>
									Open Form <ExternalLink className="ml-2 w-4 h-4" />
								</Button>
							</div>
						</Card>

						{/* Reimbursement Form */}
						<Card className="p-6 hover:shadow-lg transition-shadow">
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Reimbursement Form</h3>
								<p className="text-sm text-gray-600">
									Request reimbursement for ACM-related expenses
								</p>
								<Button
									variant="outline"
									className="w-full"
									onClick={() =>
										window.open(
											"https://forms.gle/reimbursementForm",
											"_blank"
										)
									}
								>
									Open Form <ExternalLink className="ml-2 w-4 h-4" />
								</Button>
							</div>
						</Card>

						{/* Finance FAQ */}
						<Card className="p-6 hover:shadow-lg transition-shadow">
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Finance FAQ</h3>
								<p className="text-sm text-gray-600">
									Frequently asked questions about ACM finances
								</p>
								<Button
									variant="outline"
									className="w-full"
									onClick={() =>
										window.open(
											"https://acmutd.co/finance-faq",
											"_blank"
										)
									}
								>
									View FAQ <ExternalLink className="ml-2 w-4 h-4" />
								</Button>
							</div>
						</Card>
					</div>
				</div>
			)}

			{/* Director Dashboard */}
			{accessLevel >= 2 && (
				<div className="space-y-4">
					<h2 className="text-2xl font-semibold">Director Resources</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{/* Budget Link Integration */}
						<Card className="p-6 hover:shadow-lg transition-shadow">
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Spring 2026 Budget</h3>
								<p className="text-sm text-gray-600">
									View and manage the Spring 2026 budget allocation
								</p>
								<Button
									variant="outline"
									className="w-full"
									onClick={() =>
										window.open(
											"https://docs.google.com/spreadsheets/d/budgetSheet",
											"_blank"
										)
									}
								>
									Open Budget <ExternalLink className="ml-2 w-4 h-4" />
								</Button>
							</div>
						</Card>

						{/* Media Request Form */}
						<Card className="p-6 hover:shadow-lg transition-shadow">
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Media Request Form</h3>
								<p className="text-sm text-gray-600">
									Request marketing and media resources for events
								</p>
								<Button
									variant="outline"
									className="w-full"
									onClick={() =>
										window.open(
											"https://forms.gle/mediaRequestForm",
											"_blank"
										)
									}
								>
									Open Form <ExternalLink className="ml-2 w-4 h-4" />
								</Button>
							</div>
						</Card>

						{/* Room Reservation Information */}
						<Card className="p-6 hover:shadow-lg transition-shadow">
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">
									Room Reservation Information
								</h3>
								<p className="text-sm text-gray-600">
									Access room booking system and login credentials
								</p>
								<div className="space-y-2">
									<Button
										variant="outline"
										className="w-full"
										onClick={() =>
											window.open(
												"https://utdallas.edu/rooms",
												"_blank"
											)
										}
									>
										Book Room <ExternalLink className="ml-2 w-4 h-4" />
									</Button>
									<details className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
										<summary className="cursor-pointer font-medium">
											Login Credentials
										</summary>
										<p className="mt-2 whitespace-pre-wrap">
											Contact the Executive team for login information.
										</p>
									</details>
								</div>
							</div>
						</Card>
					</div>
				</div>
			)}

			{/* Executive Dashboard */}
			{accessLevel >= 3 && (
				<div className="space-y-4">
					<h2 className="text-2xl font-semibold">Executive Controls</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Officer Status Management */}
						<Card className="p-6 hover:shadow-lg transition-shadow">
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">
									Officer Status Management
								</h3>
								<p className="text-sm text-gray-600">
									Add, modify, or remove officer statuses and access levels
								</p>
								<Button
									variant="outline"
									className="w-full"
									onClick={() => window.location.href = "/admin/officers"}
								>
									Manage Officers
								</Button>
							</div>
						</Card>

						{/* System Administration */}
						<Card className="p-6 hover:shadow-lg transition-shadow">
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">System Administration</h3>
								<p className="text-sm text-gray-600">
									Access administrative tools and system settings
								</p>
								<Button
									variant="outline"
									className="w-full"
									onClick={() => window.location.href = "/admin/system"}
									disabled
								>
									Administration (Coming Soon)
								</Button>
							</div>
						</Card>
					</div>
				</div>
			)}

			{/* Quick Links */}
			<div className="space-y-4 pt-8 border-t">
				<h2 className="text-2xl font-semibold">Quick Links</h2>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Button
						variant="ghost"
						className="justify-start"
						onClick={() => window.location.href = "/profile"}
					>
						View Your Profile
					</Button>
					<Button
						variant="ghost"
						className="justify-start"
						onClick={() => window.location.href = "/directory"}
					>
						Officer Directory
					</Button>
					<Button
						variant="ghost"
						className="justify-start"
						onClick={() =>
							window.open(
								"https://acmutd.co",
								"_blank"
							)
						}
					>
						ACM Website <ExternalLink className="ml-2 w-4 h-4" />
					</Button>
					<Button
						variant="ghost"
						className="justify-start"
						onClick={() =>
							window.open(
								"https://discord.gg/acmutd",
								"_blank"
							)
						}
					>
						Discord <ExternalLink className="ml-2 w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
