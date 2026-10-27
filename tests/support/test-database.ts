import { readDevelopmentEnv, readTestBranchEnv } from "./env-files";

// the endpoint of a Neon address, the same for its direct and its pooled connection
const toEndpoint = (url: string | undefined) => {
	if (!url || !URL.canParse(url)) {
		return undefined;
	}

	return new URL(url).host.replace("-pooler", "");
};

/**
 * The addresses of the Neon test branch, only from .env.test.local. The tests empty
 * its tables, so an address that leads to the development database is refused
 */
export const readTestDatabase = () => {
	const { DATABASE_URL, DATABASE_URL_POOLED } = readTestBranchEnv();

	if (!toEndpoint(DATABASE_URL) || !toEndpoint(DATABASE_URL_POOLED)) {
		throw new Error(
			"Integration tests need .env.test.local with DATABASE_URL and DATABASE_URL_POOLED of the Neon test branch",
		);
	}

	const development = readDevelopmentEnv();
	const developmentEndpoints = [
		development.DATABASE_URL,
		development.DATABASE_URL_POOLED,
	].map(toEndpoint);

	if (
		[DATABASE_URL, DATABASE_URL_POOLED].some((url) =>
			developmentEndpoints.includes(toEndpoint(url)),
		)
	) {
		throw new Error(
			".env.test.local leads to the development database of .env.local, the tests would empty its tables",
		);
	}

	return { directUrl: DATABASE_URL as string, pooledUrl: DATABASE_URL_POOLED };
};
