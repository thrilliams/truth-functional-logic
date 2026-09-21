import { Accessor, createSignal, Setter } from "solid-js";

const PREFIX = "ae-logic-";

export function createPersistentSignal<T extends string>(
	path: string,
	defaultValue: T,
): [Accessor<T>, Setter<T>] {
	const key = PREFIX + path;

	const [accessor, setter] = createSignal<T>(
		() => (localStorage.getItem(key) as T) || defaultValue,
	);

	const persistentSetter = ((value) => {
		if (value === undefined) return localStorage.removeItem(key);
		const newValue = (
			typeof value === "function" ? value(accessor()) : value
		) as T;
		localStorage.setItem(key, newValue);
		setter(() => newValue);
	}) as Setter<T>;

	return [accessor, persistentSetter];
}
