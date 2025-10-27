import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/lib/providers";
import { Toaster } from "@/components/ui/sonner";

const gilroy = localFont({
	src: [
		{
			path: "./fonts/Gilroy-Regular.otf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/Gilroy-Medium.otf",
			weight: "500",
			style: "normal",
		},
		{
			path: "./fonts/Gilroy-SemiBold.otf",
			weight: "600",
			style: "normal",
		},
		{
			path: "./fonts/Gilroy-Bold.otf",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-gilroy",
	display: "swap",
	preload: true,
	fallback: ["system-ui", "arial"],
	adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
	title: "ACM UTD - Officer Database",
	description: "ACM UTD - Officer Database",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${gilroy.variable} bg-[#151515] bg-cover bg-center`}>
				<div className="fixed inset-0 -z-10 bg-[url('/background.webp')] bg-cover bg-center bg-no-repeat" />
				<Providers>{children}</Providers>
				<Toaster richColors />
			</body>
		</html>
	);
}
