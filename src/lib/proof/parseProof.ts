import { parseSentence } from "../logic/parseSentence";
// import { findLastIndex } from "./findLastIndex";
import { parseReason } from "./parseReason";
import { ProofLine, ProofLineType, Reason } from "./Proof";

type Stringable<T, K extends keyof T> = {
	[P in keyof T]: P extends K ? T[P] | string : T[P];
};

export type IncompleteProofLine = Stringable<ProofLine, "reason" | "sentence">;
export type IncompleteProof = IncompleteProofLine[];

export function parseProof(string: string): IncompleteProof {
	let lines = string.split("\n");
	// const lastNonEmpty = findLastIndex(lines, (line) => line.trim().length > 0);
	// if (lastNonEmpty !== -1) lines = lines.slice(0, lastNonEmpty + 1);
	// const firstNonEmpty = lines.findIndex((line) => line.trim().length > 0);
	// if (firstNonEmpty !== -1) lines = lines.slice(firstNonEmpty);

	const proofLines: IncompleteProof = [];

	const subproofIndexStack = [];
	for (const line of lines) {
		const incompleteProofLine: Partial<IncompleteProofLine> = {};

		const reasonIndex = line.indexOf(":");
		let attemptParseReason = reasonIndex !== -1;

		let reason: Reason | null = null;
		if (attemptParseReason) {
			const reasonPart = line.slice(reasonIndex + 1).trim();
			reason = parseReason(reasonPart);
			incompleteProofLine.reason = reason || reasonPart;
		} else {
			incompleteProofLine.reason = "";
		}

		const sentencePart = line
			.slice(0, attemptParseReason ? reasonIndex : undefined)
			.trim();
		incompleteProofLine.sentence =
			parseSentence(sentencePart) || sentencePart;

		let indentationAmount = 0;
		const indentationMatch = /^(?:\t| )*/.exec(line);
		if (indentationMatch !== null)
			indentationAmount = indentationMatch[0].length;
		while (subproofIndexStack.length < indentationAmount)
			subproofIndexStack.push(-1);
		if (reason !== null && reason[0] === ProofLineType.Assumption)
			subproofIndexStack[indentationAmount - 1] += 1;

		incompleteProofLine.subproofIndex = subproofIndexStack.slice(
			0,
			indentationAmount
		);

		proofLines.push(incompleteProofLine as IncompleteProofLine);
	}

	return proofLines;
}
