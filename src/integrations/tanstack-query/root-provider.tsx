import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const DEFAULT_QUERY_STALE_TIME_MS = 2 * 60 * 1000;
const DEFAULT_QUERY_GC_TIME_MS = 15 * 60 * 1000;
const PERSIST_MAX_AGE_MS = 12 * 60 * 60 * 1000;
const PERSIST_BUSTER = "v1";

const localStoragePersister =
	typeof window !== "undefined"
		? createSyncStoragePersister({
			storage: window.localStorage,
			key: "officer-db-query-cache",
			throttleTime: 1000,
		})
		: undefined;

export function getContext() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: DEFAULT_QUERY_STALE_TIME_MS,
				gcTime: DEFAULT_QUERY_GC_TIME_MS,
				refetchOnWindowFocus: false,
				refetchOnMount: false,
				refetchOnReconnect: false,
			},
		},
	});
	return {
		queryClient,
	};
}

export function Provider({
	children,
	queryClient,
}: {
	children: React.ReactNode;
	queryClient: QueryClient;
}) {
	if (!localStoragePersister) {
		return children;
	}

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{
				persister: localStoragePersister,
				maxAge: PERSIST_MAX_AGE_MS,
				buster: PERSIST_BUSTER,
				dehydrateOptions: {
					shouldDehydrateQuery: (query) => {
						const key = query.queryKey[0];
						if (query.state.status !== "success") {
							return false;
						}
						return key === "officer" || key === "officers";
					},
				},
			}}
		>
			{children}
		</PersistQueryClientProvider>
	);
}
