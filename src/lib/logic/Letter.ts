export type Letter = [string, number?];

export const includesLetter = (letters: Letter[], letter: Letter) =>
	letters.some((l: Letter) => letter[0] === l[0] && letter[1] === l[1]);
