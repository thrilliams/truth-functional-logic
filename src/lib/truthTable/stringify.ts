import { type Sentence } from "../logic/Sentence";

function stringifyRecursive(sentence: Sentence, p = true): string {
	if (sentence.type === "contradiction") return "⊥";

	if (sentence.type === "letter")
		return (
			sentence.value[0] +
			(sentence.value[1] !== undefined ? sentence.value[1] : "")
		);
	if (sentence.type === "negation")
		return "¬" + stringifyRecursive(sentence.value);

	let a = stringifyRecursive(sentence.value[0]);
	let b = stringifyRecursive(sentence.value[1]);

	if (sentence.type === "conjunction")
		return `${p ? "(" : ""}${a} ∧ ${b}${p ? ")" : ""}`;
	if (sentence.type === "disjunction")
		return `${p ? "(" : ""}${a} ∨ ${b}${p ? ")" : ""}`;
	if (sentence.type === "implication")
		return `${p ? "(" : ""}${a} → ${b}${p ? ")" : ""}`;
	if (sentence.type === "bi_implication")
		return `${p ? "(" : ""}${a} ↔ ${b}${p ? ")" : ""}`;

	throw "unexpected sentence type";
}

export function stringify(sentence: Sentence): string {
	return stringifyRecursive(sentence, false);
}
