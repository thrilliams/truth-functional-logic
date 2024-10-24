import { Reason, ProofLineType } from "./Proof";

// assumes each number is a distinct group
const getNumbersFromMatch = (match: RegExpExecArray | null): number[] =>
	match ? match.slice(1).map((e) => parseInt(e) - 1) : [];

export function parseReason(reasonPart: string): Reason | null {
	// structural rules

	const premiseMatch = /^PR$/i.exec(reasonPart);
	if (premiseMatch !== null) return [ProofLineType.Premise];

	const assumptionMatch = /^AS$/i.exec(reasonPart);
	if (assumptionMatch !== null) return [ProofLineType.Assumption];

	// atomic rules

	const disjunctionIntroductionMatch = /^(?:∨|\\\/|\|)I *(\d+)$/i.exec(
		reasonPart
	);
	if (disjunctionIntroductionMatch !== null)
		return [
			ProofLineType.DisjunctionIntroduction,
			getNumbersFromMatch(disjunctionIntroductionMatch)[0],
		];

	const disjunctionEliminationMatch =
		/^(?:∨|\\\/|\|)E *(\d+) *, *(\d+) *- *(\d+) *, *(\d+) *- *(\d+)$/i.exec(
			reasonPart
		);
	const disjunctionEliminationNumbers = getNumbersFromMatch(
		disjunctionEliminationMatch
	);
	if (disjunctionEliminationMatch !== null)
		return [
			ProofLineType.DisjunctionElimination,
			disjunctionEliminationNumbers[0],
			[
				disjunctionEliminationNumbers[1],
				disjunctionEliminationNumbers[2],
			],
			[
				disjunctionEliminationNumbers[3],
				disjunctionEliminationNumbers[4],
			],
		];

	const conjunctionIntroductionMatch =
		/^(?:∧|\/\\|&)I *(\d+) *, *(\d+)$/i.exec(reasonPart);
	const conjunctionIntroductionNumbers = getNumbersFromMatch(
		conjunctionIntroductionMatch
	);
	if (conjunctionIntroductionMatch !== null)
		return [
			ProofLineType.ConjunctionIntroduction,
			conjunctionIntroductionNumbers[0],
			conjunctionIntroductionNumbers[1],
		];

	const conjunctionEliminationMatch = /^(?:∧|\/\\|&)E *(\d+)$/i.exec(
		reasonPart
	);
	const conjunctionEliminationNumbers = getNumbersFromMatch(
		conjunctionEliminationMatch
	);
	if (conjunctionEliminationMatch !== null)
		return [
			ProofLineType.ConjunctionElimination,
			conjunctionEliminationNumbers[0],
		];

	const implicationIntroductionMatch =
		/^(?:→|->|=>|>)I *(\d+) *- *(\d+)$/i.exec(reasonPart);
	const implicationIntroductionNumbers = getNumbersFromMatch(
		implicationIntroductionMatch
	);
	if (implicationIntroductionMatch !== null)
		return [
			ProofLineType.ImplicationIntroduction,
			[
				implicationIntroductionNumbers[0],
				implicationIntroductionNumbers[1],
			],
		];

	const implicationEliminationMatch =
		/^(?:→|->|=>|>)E *(\d+) *, *(\d+)$/i.exec(reasonPart);
	const implicationEliminationNumbers = getNumbersFromMatch(
		implicationEliminationMatch
	);
	if (implicationEliminationMatch !== null)
		return [
			ProofLineType.ImplicationElimination,
			implicationEliminationNumbers[0],
			implicationEliminationNumbers[1],
		];

	const biImplicationIntroductionMatch =
		/^(?:↔|<->|<=>|<>)I *(\d+) *- *(\d+) *, *(\d+) *- *(\d+)$/i.exec(
			reasonPart
		);
	const biImplicationIntroductionNumbers = getNumbersFromMatch(
		biImplicationIntroductionMatch
	);
	if (biImplicationIntroductionMatch !== null)
		return [
			ProofLineType.BiImplicationIntroduction,
			[
				biImplicationIntroductionNumbers[0],
				biImplicationIntroductionNumbers[1],
			],
			[
				biImplicationIntroductionNumbers[2],
				biImplicationIntroductionNumbers[3],
			],
		];

	const biImplicationEliminationMatch =
		/^(?:↔|<->|<=>|<>)E *(\d+) *, *(\d+)$/i.exec(reasonPart);
	const biImplicationEliminationNumbers = getNumbersFromMatch(
		biImplicationEliminationMatch
	);
	if (biImplicationEliminationMatch !== null)
		return [
			ProofLineType.BiImplicationElimination,
			biImplicationEliminationNumbers[0],
			biImplicationEliminationNumbers[1],
		];

	const negationIntroductionMatch = /^(?:¬|-|~)I *(\d+) *- *(\d+)$/i.exec(
		reasonPart
	);
	const negationIntroductionNumbers = getNumbersFromMatch(
		negationIntroductionMatch
	);
	if (negationIntroductionMatch !== null)
		return [
			ProofLineType.NegationIntroduction,
			[negationIntroductionNumbers[0], negationIntroductionNumbers[1]],
		];

	const indirectProofMatch = /^IP *(\d+) *- *(\d+)$/i.exec(reasonPart);
	const indirectProofNumbers = getNumbersFromMatch(indirectProofMatch);
	if (indirectProofMatch !== null)
		return [
			ProofLineType.IndirectProof,
			[indirectProofNumbers[0], indirectProofNumbers[1]],
		];

	const negationEliminationMatch = /^(?:¬|-|~)E *(\d+) *, *(\d+)$/i.exec(
		reasonPart
	);
	const negationEliminationNumbers = getNumbersFromMatch(
		negationEliminationMatch
	);
	if (negationEliminationMatch !== null)
		return [
			ProofLineType.NegationElimination,
			negationEliminationNumbers[0],
			negationEliminationNumbers[1],
		];

	const explosionMatch = /^X *(\d+)$/i.exec(reasonPart);
	if (explosionMatch !== null)
		return [
			ProofLineType.Explosion,
			getNumbersFromMatch(explosionMatch)[0],
		];

	// derived rules

	const reiterationMatch = /^R *(\d+)$/i.exec(reasonPart);
	if (reiterationMatch !== null)
		return [
			ProofLineType.Reiteration,
			getNumbersFromMatch(reiterationMatch)[0],
		];

	const disjunctiveSyllogismMatch = /^DS *(\d+) *, *(\d+)$/i.exec(reasonPart);
	const disjunctiveSyllogismNumbers = getNumbersFromMatch(
		disjunctiveSyllogismMatch
	);
	if (disjunctiveSyllogismMatch !== null)
		return [
			ProofLineType.DisjunctiveSyllogism,
			disjunctiveSyllogismNumbers[0],
			disjunctiveSyllogismNumbers[1],
		];

	const modusTollensMatch = /^MT *(\d+) *, *(\d+)$/i.exec(reasonPart);
	const modusTollensNumbers = getNumbersFromMatch(modusTollensMatch);
	if (modusTollensMatch !== null)
		return [
			ProofLineType.ModusTollens,
			modusTollensNumbers[0],
			modusTollensNumbers[1],
		];

	const doubleNegationMatch = /^DNE *(\d+)$/i.exec(reasonPart);
	if (doubleNegationMatch !== null)
		return [
			ProofLineType.DoubleNegationElimination,
			getNumbersFromMatch(doubleNegationMatch)[0],
		];

	const excludedMiddleMatch =
		/^LEM *(\d+) *- *(\d+) *, *(\d+) *- *(\d+)$/i.exec(reasonPart);
	const excludedMiddleNumbers = getNumbersFromMatch(excludedMiddleMatch);
	if (excludedMiddleMatch !== null)
		return [
			ProofLineType.ExcludedMiddle,
			[excludedMiddleNumbers[0], excludedMiddleNumbers[1]],
			[excludedMiddleNumbers[2], excludedMiddleNumbers[3]],
		];

	const deMorganMatch = /^DeM *(\d+)$/i.exec(reasonPart);
	if (deMorganMatch !== null)
		return [ProofLineType.DeMorgan, getNumbersFromMatch(deMorganMatch)[0]];

	return null;
}
