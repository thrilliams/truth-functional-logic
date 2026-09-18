import { Accessor, createSignal, Setter } from "solid-js";

const PREFIX = "ae-logic-";

export function createPersistentSignal(
	path: string,
	defaultValue: string,
): [Accessor<string>, Setter<string>] {
	const key = PREFIX + path;

	const [accessor, setter] = createSignal(
		() => localStorage.getItem(key) || defaultValue,
	);

	const persistentSetter: Setter<string> = (value) => {
		if (value === undefined) return localStorage.removeItem(key);
		const newValue =
			typeof value === "function" ? value(accessor()) : value;
		localStorage.setItem(key, newValue);
		setter(() => newValue);
	};

	return [accessor, persistentSetter];
}
