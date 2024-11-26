import { Letter } from "./Letter";

export type SentenceType =
	| "letter"
	| "negation"
	| "conjunction"
	| "disjunction"
	| "implication"
	| "bi_implication"
	| "contradiction";

export type Sentence = { type: SentenceType } & (
	| { type: "letter"; value: Letter }
	| { type: "negation"; value: Sentence }
	| { type: "conjunction"; value: [Sentence, Sentence] }
	| { type: "disjunction"; value: [Sentence, Sentence] }
	| { type: "implication"; value: [Sentence, Sentence] }
	| { type: "bi_implication"; value: [Sentence, Sentence] }
	| { type: "contradiction" }
);
