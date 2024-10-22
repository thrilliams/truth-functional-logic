import { Sentence } from "../logic/Sentence";
import { ProofLine, ProofLineType, Reason } from "./Proof";

export const line = (
	sentence: Sentence,
	type: ProofLineType,
	references: (number | [number, number])[] = [],
	subproofIndex: number[] = []
): ProofLine => ({
	sentence,
	reason: [type, ...references] as Reason,
	subproofIndex,
});

export const subproof = (index: number[], ...lines: ProofLine[]): ProofLine[] =>
	lines.map((line) => ({
		...line,
		subproofIndex: [...index, ...line.subproofIndex],
	}));
