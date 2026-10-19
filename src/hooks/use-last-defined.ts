import { useState } from "react";

// the last value that was not undefined, so content can stay on screen while it animates out
export const useLastDefined = <TValue>(value: TValue | undefined) => {
	const [last, setLast] = useState(value);

	if (value !== undefined && value !== last) {
		setLast(value);
	}
	return value ?? last;
};
