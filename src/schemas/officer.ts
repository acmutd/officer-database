import { z } from "zod";

export const StandingSchema = z.enum([
	"Freshman",
	"Sophomore",
	"Junior",
	"Senior",
	"Graduate",
	"Alumni",
]);

export const divisions = [
	"Media",
	"Research",
	"Development",
	"Projects",
	"Education",
	"Executive",
	"Community",
	"HackUTD",
	"Industry",
];

export const DivisionSchema = z.enum(divisions);

export const SocialLinksSchema = z.object({
	linkedin: z.url().optional(),
	github: z.url().optional(),
	personalEmail: z.email().optional(),
});

export const TermSchema = z.object({
	term: z.enum(["Fall", "Spring", "Summer"]),
	year: z.number().int().min(2020),
});

export const InternshipsSchema = z.object({
	title: z.string().min(1),
	company: z.string().min(1),
	startDate: z.string().min(1),
	endDate: z.string().optional(),
});

export const ResearchSchema = z.object({
	title: z.string().min(1),
	lab: z.string().min(1),
	principalInvestigator: z.array(z.string().min(1)),
	startDate: z.string().min(1),
	endDate: z.string().optional(),
});

export const RoleSchema = z.object({
	title: z.string().min(1),
	division: z.string().min(1),
	level: z.number().int().min(1).max(3),
	startDate: TermSchema,
	endDate: TermSchema.nullable(),
});

export const OfficerSchema = z.object({
	id: z.string().min(1),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	netId: z.string().min(1),
	resume: z.string().optional(),
	socialLinks: SocialLinksSchema,
	creditStanding: StandingSchema,
	yearStanding: StandingSchema,
	expectedGrad: TermSchema,
	internships: z.array(InternshipsSchema),
	research: z.array(ResearchSchema),
	joinDate: TermSchema,
	roles: z.array(RoleSchema),
	accessLevel: z.number().int().min(1).max(3),
	isActive: z.boolean(),
});

export type SocialLinks = z.infer<typeof SocialLinksSchema>;
export type ExpectedGrad = z.infer<typeof TermSchema>;
export type Internships = z.infer<typeof InternshipsSchema>;
export type Research = z.infer<typeof ResearchSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type Officer = z.infer<typeof OfficerSchema>;
export type Division = z.infer<typeof divisions>;
