import { type Sentence } from "./Sentence";
import { type Letter } from "./Letter";

export const letter = (char: string, sub?: number): Sentence => ({
	type: "letter",
	value: [char, sub],
});

export const wrapLetter = (letter: Letter): Sentence => ({
	type: "letter",
	value: letter,
});

export const not = (a: Sentence): Sentence => ({
	type: "negation",
	value: a,
});

export const and = (a: Sentence, b: Sentence): Sentence => ({
	type: "conjunction",
	value: [a, b],
});

export const or = (a: Sentence, b: Sentence): Sentence => ({
	type: "disjunction",
	value: [a, b],
});

export const imp = (a: Sentence, b: Sentence): Sentence => ({
	type: "implication",
	value: [a, b],
});

export const biImp = (a: Sentence, b: Sentence): Sentence => ({
	type: "bi_implication",
	value: [a, b],
});

export const con = (): Sentence => ({
	type: "contradiction",
});
