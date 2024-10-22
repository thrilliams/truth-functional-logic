import { useState } from "react";

export function useLocalStorageState<T extends string>(
	key: string,
	defaultValue: T
): [T, (newValue: T) => void] {
	const [value, setValueRaw] = useState(
		(localStorage.getItem(key) as T) || defaultValue
	);

	const setValue = (newValue: T) => {
		localStorage.setItem(key, newValue);
		setValueRaw(newValue);
	};

	return [value, setValue];
}
