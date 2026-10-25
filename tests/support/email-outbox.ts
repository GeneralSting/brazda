import type { Email } from "#/types/email";

// every email sent while a test runs, in the order it was sent
const outbox: Email[] = [];

// takes the place of sending, see setup.ts
export const keepInOutbox = (email: Email) => {
	outbox.push(email);
};

// what was sent so far, a copy, so a test cannot change the outbox by accident
export const readOutbox = () => [...outbox];

// emptied before every test, so each one reads only its own emails
export const clearOutbox = () => {
	outbox.length = 0;
};
