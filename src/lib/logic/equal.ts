import { Sentence, SentenceType } from "./Sentence";

// does not check for commutativity
export function equal(a: Sentence, b: Sentence): boolean {
	if (a.type !== b.type) return false;
	if (a.type === SentenceType.Letter && b.type === SentenceType.Letter)
		return a.value[0] === b.value[0] && a.value[1] === b.value[1];
	if (a.type === SentenceType.Negation && b.type === SentenceType.Negation)
		return equal(a.value, b.value);
	if (
		(a.type === SentenceType.Conjunction &&
			b.type === SentenceType.Conjunction) ||
		(a.type === SentenceType.Disjunction &&
			b.type === SentenceType.Disjunction) ||
		(a.type === SentenceType.Implication &&
			b.type === SentenceType.Implication) ||
		(a.type === SentenceType.BiImplication &&
			b.type === SentenceType.BiImplication)
	)
		return equal(a.value[0], b.value[0]) && equal(a.value[1], b.value[1]);

	if (
		a.type === SentenceType.Contradiction &&
		b.type === SentenceType.Contradiction
	)
		return true;

	throw "unexpected sentence type!";
}
