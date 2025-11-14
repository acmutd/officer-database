import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import type { QueryClient } from "@tanstack/react-query";
import type { AuthContextType } from "@/lib/auth";
import { Toaster } from "sonner";

interface MyRouterContext {
	queryClient: QueryClient;
	auth: AuthContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<>
			<Outlet />
			<Toaster richColors />
		</>
	),
});
