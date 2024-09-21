export enum SentenceType {
	Letter,
	Negation,
	Conjunction,
	Disjunction,
	Implication,
	BiImplication,
}

export type Letter = [string, number?];

export const includesLetter = (letters: Letter[], letter: Letter) =>
	letters.some((l: Letter) => letter[0] === l[0] && letter[1] === l[1]);

export type Sentence = { type: SentenceType } & (
	| { type: SentenceType.Letter; value: Letter }
	| { type: SentenceType.Negation; value: Sentence }
	| { type: SentenceType.Conjunction; value: [Sentence, Sentence] }
	| { type: SentenceType.Disjunction; value: [Sentence, Sentence] }
	| { type: SentenceType.Implication; value: [Sentence, Sentence] }
	| { type: SentenceType.BiImplication; value: [Sentence, Sentence] }
);
