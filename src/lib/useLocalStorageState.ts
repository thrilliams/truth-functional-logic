import { useState } from "react";

export function useLocalStorageState(
	key: string,
	defaultValue: string
): [string, React.Dispatch<React.SetStateAction<string>>] {
	const [value, setValueRaw] = useState(
		localStorage.getItem(key) || defaultValue
	);

	const setValue = (newValue: string | ((oldValue: string) => string)) => {
		if (newValue instanceof Function) newValue = newValue(value);
		localStorage.setItem(key, newValue);
		setValueRaw(newValue);
	};

	return [value, setValue];
}
