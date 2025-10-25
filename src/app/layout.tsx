import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/lib/providers";
import { Toaster } from "@/components/ui/sonner";

const gilroy = localFont({
	src: [
		{
			path: "./fonts/Gilroy-Light.otf",
			weight: "300",
			style: "normal",
		},
		{
			path: "./fonts/Gilroy-LightItalic.otf",
			weight: "300",
			style: "italic",
		},
		{
			path: "./fonts/Gilroy-Regular.otf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/Gilroy-RegularItalic.otf",
			weight: "400",
			style: "italic",
		},
		{
			path: "./fonts/Gilroy-Medium.otf",
			weight: "500",
			style: "normal",
		},
		{
			path: "./fonts/Gilroy-MediumItalic.otf",
			weight: "500",
			style: "italic",
		},
		{
			path: "./fonts/Gilroy-SemiBold.otf",
			weight: "600",
			style: "normal",
		},
		{
			path: "./fonts/Gilroy-SemiBoldItalic.otf",
			weight: "600",
			style: "italic",
		},
		{
			path: "./fonts/Gilroy-Bold.otf",
			weight: "700",
			style: "normal",
		},
		{
			path: "./fonts/Gilroy-BoldItalic.otf",
			weight: "700",
			style: "italic",
		},
		{
			path: "./fonts/Gilroy-ExtraBold.otf",
			weight: "800",
			style: "normal",
		},
		{
			path: "./fonts/Gilroy-ExtraBoldItalic.otf",
			weight: "800",
			style: "italic",
		},
		{
			path: "./fonts/Gilroy-Black.otf",
			weight: "900",
			style: "normal",
		},
		{
			path: "./fonts/Gilroy-BlackItalic.otf",
			weight: "900",
			style: "italic",
		},
	],
	variable: "--font-gilroy",
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
				<div className="fixed inset-0 -z-10 bg-[url('/Background.png')] bg-cover bg-center bg-no-repeat" />
				<Providers>{children}</Providers>
				<Toaster richColors />
			</body>
		</html>
	);
}
