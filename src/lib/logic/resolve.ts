import {
	type Sentence,
	type Letter,
	SentenceType,
	includesLetter,
} from "./Sentence";

export function resolve(sentence: Sentence, model: Letter[]): boolean {
	if (sentence.type === SentenceType.Letter)
		return includesLetter(model, sentence.value);

	if (sentence.type === SentenceType.Negation)
		return !resolve(sentence.value, model);

	const a = resolve(sentence.value[0], model);
	const b = resolve(sentence.value[1], model);

	if (sentence.type === SentenceType.Conjunction) return a && b;
	if (sentence.type === SentenceType.Disjunction) return a || b;
	if (sentence.type === SentenceType.Implication) return a ? b : true;
	if (sentence.type === SentenceType.BiImplication) return a == b;

	throw "unexpected sentence type";
}
