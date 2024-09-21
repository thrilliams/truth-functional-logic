import { getLetters, powerSet } from "./getModels";
import { and, not, or, wrapLetter } from "./helpers";
import { resolve } from "./resolve";
import { includesLetter, type Sentence } from "./Sentence";

export function toCnfSyntactic(_sentence: Sentence): Sentence {
	throw "not implemented!";
}

export function toCnfSemantic(sentence: Sentence): Sentence {
	const letters = getLetters(sentence);
	const models = powerSet(letters);

	const falsifyingClauses = [];

	for (const model of models) {
		if (resolve(sentence, model)) continue;

		const modifiedLetters: Sentence[] = letters.map((letter) => {
			if (includesLetter(model, letter)) return not(wrapLetter(letter));
			return wrapLetter(letter);
		});

		falsifyingClauses.push(
			modifiedLetters
				.slice(0, -1)
				.reduceRight(
					(acc, value) => or(value, acc),
					modifiedLetters[modifiedLetters.length - 1]
				)
		);
	}

	if (falsifyingClauses.length === 0) {
		console.warn("tautology!");
		return or(wrapLetter(letters[0]), not(wrapLetter(letters[0])));
	}

	return falsifyingClauses
		.slice(0, -1)
		.reduceRight(
			(acc, value) => and(value, acc),
			falsifyingClauses[falsifyingClauses.length - 1]
		);
}
