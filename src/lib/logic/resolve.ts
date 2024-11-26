import { type Sentence } from "./Sentence";
import { type Letter, includesLetter } from "./Letter";

export function resolve(sentence: Sentence, model: Letter[]): boolean {
	if (sentence.type === "contradiction") return false;

	if (sentence.type === "letter")
		return includesLetter(model, sentence.value);

	if (sentence.type === "negation") return !resolve(sentence.value, model);

	const a = resolve(sentence.value[0], model);
	const b = resolve(sentence.value[1], model);

	if (sentence.type === "conjunction") return a && b;
	if (sentence.type === "disjunction") return a || b;
	if (sentence.type === "implication") return a ? b : true;
	if (sentence.type === "bi_implication") return a == b;

	throw "unexpected sentence type";
}
