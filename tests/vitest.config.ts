import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Values of the right shape for every variable `getServerEnv` checks, none of them real.
 * The database address leads nowhere, so a unit test that reaches the database fails
 * at once instead of writing into the development data
 */
const TEST_ENV = {
	DATABASE_URL_POOLED: "postgresql://unit:tests@127.0.0.1:1/no-database",
	BETTER_AUTH_SECRET: "a-secret-for-unit-tests-only-32-chars",
	BETTER_AUTH_URL: "http://localhost:3000",
	GOOGLE_CLIENT_ID: "000000000000-unit-tests.apps.googleusercontent.com",
	GOOGLE_CLIENT_SECRET: "GOCSPX-unit-tests",
};

/**
 * Tests run without the plugins of vite.config.ts, they import plain TypeScript
 * modules. The root is the project, so `#/` and the paths below start from there
 */
export default defineConfig({
	root: fileURLToPath(new URL("..", import.meta.url)),
	test: {
		include: ["tests/unit/**/*.test.ts"],
		setupFiles: ["tests/support/setup.ts"],
		environment: "node",
		env: TEST_ENV,
		/**
		 * Counts every file of src, also those no test touches, so the share is never
		 * flattered. A map for finding untested branches, not a target the run has to meet
		 */
		coverage: {
			provider: "v8",
			include: ["src/**/*.{ts,tsx}"],
			exclude: ["src/app/routeTree.gen.ts", "src/types/**"],
			reporter: ["text", "html"],
			reportsDirectory: "tests/coverage",
		},
	},
});
