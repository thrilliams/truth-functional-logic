import { SentenceType, type Sentence } from "./Sentence";
import { includesLetter, type Letter } from "./Letter";

export function getLetters(sentence: Sentence): Letter[] {
	if (sentence.type === SentenceType.Letter) return [sentence.value];
	if (sentence.type === SentenceType.Negation)
		return getLetters(sentence.value);

	let letters = getLetters(sentence.value[0]);

	for (const letter of getLetters(sentence.value[1])) {
		if (includesLetter(letters, letter)) continue;
		letters.push(letter);
	}

	letters.sort((a, b) => {
		let alphabetical = a[0].localeCompare(b[0]);
		if (alphabetical !== 0) return alphabetical;
		return (a[1] || 0) - (b[1] || 0);
	});

	return letters;
}

export function powerSet<T>(array: T[]): T[][] {
	return array.reduceRight<T[][]>(
		(acc, entry) => acc.map((subset) => [entry, ...subset]).concat(acc),
		[[]]
	);
}

export function getModels(sentence: Sentence) {
	return powerSet(getLetters(sentence));
}
