import { auth } from "#/server/auth.server";

/**
 * A POST to an endpoint of Better Auth as the browser sends it, answered in this
 * process through the handler the server mounts, so no server is started
 */
export const postToAuth = async (path: string, body: unknown) => {
	const baseUrl = process.env.BETTER_AUTH_URL;
	const response = await auth.handler(
		new Request(new URL(`/api/auth${path}`, baseUrl), {
			method: "POST",
			headers: { "content-type": "application/json", origin: baseUrl ?? "" },
			body: JSON.stringify(body),
		}),
	);

	return { status: response.status, body: await response.json() };
};
