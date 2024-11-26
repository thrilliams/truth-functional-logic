import { Sentence } from "./Sentence";

// does not check for commutativity
export function equal(a: Sentence, b: Sentence): boolean {
	if (a.type !== b.type) return false;
	if (a.type === "letter" && b.type === "letter")
		return a.value[0] === b.value[0] && a.value[1] === b.value[1];
	if (a.type === "negation" && b.type === "negation")
		return equal(a.value, b.value);
	if (
		(a.type === "conjunction" && b.type === "conjunction") ||
		(a.type === "disjunction" && b.type === "disjunction") ||
		(a.type === "implication" && b.type === "implication") ||
		(a.type === "bi_implication" && b.type === "bi_implication")
	)
		return equal(a.value[0], b.value[0]) && equal(a.value[1], b.value[1]);

	if (a.type === "contradiction" && b.type === "contradiction") return true;

	throw "unexpected sentence type!";
}
