import { Accessor, createSignal } from "solid-js";

const PREFIX = "ae-logic-";

export function createPersistentSignal<T extends string>(
	path: string,
	defaultValue: T,
): [Accessor<T>, (value: T) => void] {
	const key = PREFIX + path;

	const [accessor, setter] = createSignal(
		(localStorage.getItem(key) as T) || defaultValue,
	);

	const persistentSetter = (value: T) => {
		localStorage.setItem(key, value);
		setter(() => value);
	};

	return [accessor, persistentSetter];
}
