import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./globals.css";
import reportWebVitals from "./reportWebVitals.ts";
import { AuthContextProvider, useAuth } from "./lib/auth.tsx";

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
	routeTree,
	context: {
		...TanStackQueryProviderContext,
		auth: undefined!,
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function InnerApp() {
	const auth = useAuth();

	if (auth.isInitialLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center p-4">
				<div className="size-10 rounded-full border-4 border-gray-200 border-t-foreground animate-spin" />
			</div>
		);
	}

	return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
	return (
		<TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
			<AuthContextProvider>
				<InnerApp />
			</AuthContextProvider>
		</TanStackQueryProvider.Provider>
	);
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<div className="fixed inset-0 -z-10 bg-[url('/background.webp')] bg-cover bg-center bg-no-repeat" />
			<App />
		</StrictMode>
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
