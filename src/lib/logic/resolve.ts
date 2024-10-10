import { type Sentence, SentenceType } from "./Sentence";
import { type Letter, includesLetter } from "./Letter";

export function resolve(sentence: Sentence, model: Letter[]): boolean {
	if (sentence.type === SentenceType.Contradiction) return false;

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
