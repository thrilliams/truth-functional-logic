// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex
export function findLastIndex<T>(
	array: T[],
	predicate: (value: T, index: number, array: T[]) => boolean
) {
	const reversedArray = [...array].reverse();
	const reversedIndex = reversedArray.findIndex(predicate);
	if (reversedIndex === -1) return -1;
	return array.length - 1 - reversedIndex;
}
