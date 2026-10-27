import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const toPath = (file: string) =>
	fileURLToPath(new URL(`../../${file}`, import.meta.url));

// the variables of an env file, none when the file does not exist
const readEnvFile = (file: string) => {
	const path = toPath(file);
	return existsSync(path) ? parseEnv(readFileSync(path, "utf8")) : {};
};

// the fake values every test runs with
export const readFakeEnv = () => readEnvFile("tests/.env.test");

// the Neon test branch of the integration tests, none on a machine without it
export const readTestBranchEnv = () => readEnvFile(".env.test.local");

// the development database, read only to refuse it as the database of the tests
export const readDevelopmentEnv = () => readEnvFile(".env.local");
