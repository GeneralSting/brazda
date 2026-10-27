import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { readFakeEnv, readTestBranchEnv } from "./support/env-files.ts";

/**
 * Tests run without the plugins of vite.config.ts, they import plain TypeScript
 * modules. The root is the project, so `#/` and the paths below start from there
 */
export default defineConfig({
	root: fileURLToPath(new URL("..", import.meta.url)),
	test: {
		setupFiles: ["tests/support/setup.ts"],
		environment: "node",
		env: readFakeEnv(), // tests/.env.test
		projects: [
			{
				extends: true,
				test: { name: "unit", include: ["tests/unit/**/*.test.ts"] },
			},
			/**
			 * Against the Neon test branch of .env.test.local, which the global setup checks and
			 * migrates first. Files run one after another, every one of them empties the same tables
			 */
			{
				extends: true,
				test: {
					name: "integration",
					include: ["tests/integration/**/*.test.ts"],
					globalSetup: ["tests/support/database-global-setup.ts"],
					setupFiles: ["tests/support/database-setup.ts"],
					env: readTestBranchEnv(), // .env.test.local on top of the fake values
					fileParallelism: false,
					testTimeout: 20_000, // a branch that slept wakes up in a few seconds
					hookTimeout: 20_000,
				},
			},
		],
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
