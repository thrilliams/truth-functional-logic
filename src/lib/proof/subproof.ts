import { findLastIndex } from "./findLastIndex";
import { Proof, ProofLine, ProofLineType } from "./Proof";
import { validateProofLine } from "./validateProofLine";

export function validateSubproofIndices(
	referree: number[],
	referent: number[]
) {
	// if referree index is shorter than referent index, referent is a closed
	// subproof and cannot be referenced
	if (referree.length < referent.length) return false;

	// iterate over referree index;
	for (let i = 0; i < referent.length; i++) {
		// if items do not match, referent is in another scope and cannot be referenced
		if (referree[i] !== referent[i]) return false;
	}

	// otherwise, referent can be referenced
	return true;
}

// returns true if firstArray and secondArray have the same elements in the same
// order (using ===, so not deep for objects)
export function arraysEqual<T>(firstArray: T[], secondArray: T[]): boolean {
	if (firstArray.length !== secondArray.length) return false;

	for (let i = 0; i < firstArray.length; i++) {
		if (firstArray[i] !== secondArray[i]) return false;
	}

	return true;
}

// returns true if firstArray starts with the elements in secondArray
export function startsWith<T>(firstArray: T[], secondArray: T[]): boolean {
	if (firstArray.length > secondArray.length) return false;

	for (let i = 0; i < firstArray.length; i++) {
		if (firstArray[i] !== secondArray[i]) return false;
	}

	return true;
}

export function referToSubproof(
	line: ProofLine,
	precedingProof: Proof,
	range: [number, number]
): [ProofLine, ProofLine] {
	if (range[0] > precedingProof.length || range[1] > precedingProof.length)
		throw [false, "the subproof range is not within the proof"];

	const subproofStart = precedingProof[range[0]];
	const subproofIndex = subproofStart.subproofIndex;

	const subproofStartIndex = precedingProof.findIndex((line) =>
		arraysEqual(subproofIndex, line.subproofIndex)
	);
	if (range[0] !== subproofStartIndex)
		throw [false, "the referent line is not the start of the subproof"];

	const subproofEndIndex = findLastIndex(precedingProof, (line) =>
		arraysEqual(subproofIndex, line.subproofIndex)
	);
	if (range[1] !== subproofEndIndex)
		throw [false, "the referent line is not the end of the subproof"];

	const subproofEnd = precedingProof[range[1]];

	if (!startsWith(line.subproofIndex, subproofIndex))
		throw [false, "the referent subproof is in a closed subproof"];

	if (subproofStart.reason[0] !== ProofLineType.Assumption)
		throw [
			false,
			"the referent subproof does not start with an assumption",
		];

	if (
		!validateProofLine(
			subproofStart,
			precedingProof.slice(0, range[0])
		)[0] ||
		!validateProofLine(subproofEnd, precedingProof.slice(0, range[1]))[0]
	)
		throw [false, "the referent subproof is not valid"];

	return [subproofStart, subproofEnd];
}
