import { SentenceType, type Letter, type Sentence } from "./Sentence";

export const letter = (char: string, sub?: number): Sentence => ({
	type: SentenceType.Letter,
	value: [char, sub],
});

export const wrapLetter = (letter: Letter): Sentence => ({
	type: SentenceType.Letter,
	value: letter,
});

export const not = (a: Sentence): Sentence => ({
	type: SentenceType.Negation,
	value: a,
});

export const and = (a: Sentence, b: Sentence): Sentence => ({
	type: SentenceType.Conjunction,
	value: [a, b],
});

export const or = (a: Sentence, b: Sentence): Sentence => ({
	type: SentenceType.Disjunction,
	value: [a, b],
});

export const imp = (a: Sentence, b: Sentence): Sentence => ({
	type: SentenceType.Implication,
	value: [a, b],
});

export const biImp = (a: Sentence, b: Sentence): Sentence => ({
	type: SentenceType.BiImplication,
	value: [a, b],
});

export const entails = (
	premises: Sentence[],
	conclusion: Sentence
): Sentence => ({
	type: SentenceType.Implication,
	value: [
		premises
			.slice(0, -1)
			.reduceRight((acc, value) => and(value, acc), premises.at(-1)!),
		conclusion,
	],
});
