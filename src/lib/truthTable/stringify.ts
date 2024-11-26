import { type Sentence, SentenceType } from "../logic/Sentence";

function stringifyRecursive(sentence: Sentence, p = true): string {
	if (sentence.type === SentenceType.Contradiction) return "⊥";

	if (sentence.type === SentenceType.Letter)
		return (
			sentence.value[0] +
			(sentence.value[1] !== undefined ? sentence.value[1] : "")
		);
	if (sentence.type === SentenceType.Negation)
		return "¬" + stringifyRecursive(sentence.value);

	let a = stringifyRecursive(sentence.value[0]);
	let b = stringifyRecursive(sentence.value[1]);

	if (sentence.type === SentenceType.Conjunction)
		return `${p ? "(" : ""}${a} ∧ ${b}${p ? ")" : ""}`;
	if (sentence.type === SentenceType.Disjunction)
		return `${p ? "(" : ""}${a} ∨ ${b}${p ? ")" : ""}`;
	if (sentence.type === SentenceType.Implication)
		return `${p ? "(" : ""}${a} → ${b}${p ? ")" : ""}`;
	if (sentence.type === SentenceType.BiImplication)
		return `${p ? "(" : ""}${a} ↔ ${b}${p ? ")" : ""}`;

	throw "unexpected sentence type";
}

export function stringify(sentence: Sentence): string {
	return stringifyRecursive(sentence, false);
}
