import { Letter } from "./Letter";

export enum SentenceType {
	Letter,
	Negation,
	Conjunction,
	Disjunction,
	Implication,
	BiImplication,

	Contradiction,
}

export type Sentence = { type: SentenceType } & (
	| { type: SentenceType.Letter; value: Letter }
	| { type: SentenceType.Negation; value: Sentence }
	| { type: SentenceType.Conjunction; value: [Sentence, Sentence] }
	| { type: SentenceType.Disjunction; value: [Sentence, Sentence] }
	| { type: SentenceType.Implication; value: [Sentence, Sentence] }
	| { type: SentenceType.BiImplication; value: [Sentence, Sentence] }
	| { type: SentenceType.Contradiction }
);
