import { equal } from "../logic/equal";
import { imp } from "../logic/helpers";
import { Sentence } from "../logic/Sentence";
import { IncompleteProofLine } from "./parseProof";
import { Proof, ProofLine } from "./Proof";
import {
	arraysEqual,
	referToSubproof,
	validateSubproofIndices,
} from "./subproof";

function referToLine(
	line: ProofLine,
	precedingProof: Proof,
	index: number
): ProofLine {
	const precedingLine = precedingProof[index];

	const [precedingLineValid] = validateProofLine(
		precedingLine,
		precedingProof.slice(0, index)
	);
	if (!precedingLineValid)
		throw [false, "the referent sentence is not itself valid"];

	if (
		!validateSubproofIndices(
			line.subproofIndex,
			precedingLine.subproofIndex
		)
	)
		throw [false, "the referent sentence is in an unaccessible subproof"];

	return precedingLine;
}

// this function allows helpers to throw failure reasons, which are caught by
// the wrapper
function validateProofLineWithErrors(
	line: ProofLine,
	precedingProof: Proof
): [true, string?] {
	// very weird error that occurs sometimes when deleting an invalid line
	if (line === undefined) throw [false, "line is malformed"];

	const type = line.reason[0];

	// structural rules

	if (type === "premise") {
		const precedingNonPremise = precedingProof.find(
			({ reason }) => reason[0] !== "premise"
		);
		if (precedingNonPremise !== undefined)
			throw [false, "premises must only appear at the start of a proof"];

		return [true];
	}

	if (type === "assumption") {
		const precedingLineOfSameSubproof = precedingProof.find(
			({ subproofIndex }) =>
				arraysEqual(line.subproofIndex, subproofIndex)
		);
		if (precedingLineOfSameSubproof !== undefined)
			throw [false, "subproofs must start with exactly one assumption"];

		return [true];
	}

	// atomic rules

	if (type === "disjunction_introduction") {
		if (line.sentence.type !== "disjunction")
			throw [
				false,
				"disjunction introduction can only be used to create disjunction sentences",
			];

		const referent = referToLine(line, precedingProof, line.reason[1]);

		const leftHandEqual = equal(line.sentence.value[0], referent.sentence);
		const rightHandEqual = equal(line.sentence.value[1], referent.sentence);

		if (!(leftHandEqual || rightHandEqual))
			throw [
				false,
				"the referree is not comprised of the referent sentence",
			];

		return [true];
	}

	if (type === "disjunction_elimination") {
		const referent = referToLine(line, precedingProof, line.reason[1]);

		if (referent.sentence.type !== "disjunction")
			throw [false, "the referent is not a disjunction statement"];

		const [leftHandSentence, rightHandSentence] = referent.sentence.value;

		const [firstStart, firstEnd] = referToSubproof(
			line,
			precedingProof,
			line.reason[2]
		);
		const [secondStart, secondEnd] = referToSubproof(
			line,
			precedingProof,
			line.reason[3]
		);

		if (!equal(firstEnd.sentence, secondEnd.sentence))
			throw [
				false,
				"the referent subproofs do not show the same sentence",
			];

		const startsEqual =
			equal(leftHandSentence, firstStart.sentence) &&
			equal(rightHandSentence, secondStart.sentence);
		const startsEqualReversed =
			equal(rightHandSentence, firstStart.sentence) &&
			equal(leftHandSentence, secondStart.sentence);

		if (!(startsEqual || startsEqualReversed))
			throw [
				false,
				"the referent subproofs do not assume the two sides of the disjunction",
			];

		return [true];
	}

	if (type === "conjunction_introduction") {
		if (line.sentence.type !== "conjunction")
			throw [
				false,
				"conjunction introduction can only be used to create conjunction sentences",
			];

		const leftHandSentence = line.sentence.value[0];
		const rightHandSentence = line.sentence.value[1];

		const firstReferent = referToLine(line, precedingProof, line.reason[1]);
		const secondReferent = referToLine(
			line,
			precedingProof,
			line.reason[2]
		);

		const sentencesEqual =
			equal(leftHandSentence, firstReferent.sentence) &&
			equal(rightHandSentence, secondReferent.sentence);
		const sentencesEqualReversed =
			equal(rightHandSentence, firstReferent.sentence) &&
			equal(leftHandSentence, secondReferent.sentence);

		if (!(sentencesEqual || sentencesEqualReversed))
			throw [
				false,
				"the referree is not comprised of the referent sentences",
			];

		return [true];
	}

	if (type === "conjunction_elimination") {
		const referent = referToLine(line, precedingProof, line.reason[1]);
		const referentSentence = referent.sentence;

		if (referentSentence.type !== "conjunction")
			throw [false, "the referent sentence is not a conjunction"];

		const leftHandEqual = equal(line.sentence, referentSentence.value[0]);
		const rightHandEqual = equal(line.sentence, referentSentence.value[1]);

		if (!(leftHandEqual || rightHandEqual))
			throw [
				false,
				"neither side of the referent sentence is the same as the referree",
			];

		return [true];
	}

	if (type === "implication_introduction") {
		if (line.sentence.type !== "implication")
			throw [
				false,
				"conditional introduction can only be used to create conditional sentences",
			];

		const [start, end] = referToSubproof(
			line,
			precedingProof,
			line.reason[1]
		);

		if (!equal(line.sentence, imp(start.sentence, end.sentence)))
			throw [
				false,
				"the referent subproof does assume the antecedent and demonstrate the consequent",
			];

		return [true];
	}

	if (type === "implication_elimination") {
		const firstReferent = referToLine(line, precedingProof, line.reason[1]);
		const secondReferent = referToLine(
			line,
			precedingProof,
			line.reason[2]
		);

		let firstImplication = true;
		if (firstReferent.sentence.type !== "implication") {
			if (secondReferent.sentence.type !== "implication")
				throw [false, "the referent sentence is not a conditional"];
			firstImplication = false;
		}

		// abstract logic to a helper function so it can be retried
		function validateImplicationElimination(
			firstImplication: boolean,
			tryAgain = true
		): string | null {
			// little ts jank for a small amount of type safety later
			const implicationLine: ProofLine & {
				sentence: {
					type: "implication";
					value: [Sentence, Sentence];
				};
			} = (firstImplication ? firstReferent : secondReferent) as any;
			const eliminationLine = firstImplication
				? secondReferent
				: firstReferent;

			const [antecedent, consequent] = implicationLine.sentence.value;

			let failureReason: string | null = null;

			if (!equal(antecedent, eliminationLine.sentence))
				failureReason = "the referent is not the antecedent";
			else if (!equal(consequent, line.sentence))
				failureReason = "the referree is not the consequent";

			if (
				tryAgain &&
				failureReason !== null &&
				eliminationLine.sentence.type === "implication"
			)
				return validateImplicationElimination(!firstImplication, false);

			return failureReason;
		}

		let failureReason = validateImplicationElimination(firstImplication);
		if (failureReason !== null) throw [false, failureReason];

		return [true];
	}

	if (line.reason[0] === "bi_implication_introduction") {
		if (line.sentence.type !== "bi_implication")
			throw [
				false,
				"biconditional introduction can only be used to create biconditional sentences",
			];

		const [leftHandSentence, rightHandSentence] = line.sentence.value;

		const [firstStart, firstEnd] = referToSubproof(
			line,
			precedingProof,
			line.reason[1]
		);
		const [secondStart, secondEnd] = referToSubproof(
			line,
			precedingProof,
			line.reason[2]
		);

		if (
			!equal(firstStart.sentence, secondEnd.sentence) ||
			!equal(firstEnd.sentence, secondStart.sentence)
		)
			throw [false, "the referent subproofs do not mirror each other"];

		const sentencesEqual =
			equal(leftHandSentence, firstStart.sentence) &&
			equal(rightHandSentence, secondStart.sentence);
		const sentencesEqualReversed =
			equal(leftHandSentence, secondStart.sentence) &&
			equal(rightHandSentence, firstStart.sentence);
		if (!(sentencesEqual || sentencesEqualReversed))
			throw [
				false,
				"the referree is not comprised of the terms present in the referent subproofs",
			];

		return [true];
	}

	if (line.reason[0] === "bi_implication_elimination") {
		const firstReferent = referToLine(line, precedingProof, line.reason[1]);
		const secondReferent = referToLine(
			line,
			precedingProof,
			line.reason[2]
		);

		let firstBiImplication = true;
		if (firstReferent.sentence.type !== "bi_implication") {
			if (secondReferent.sentence.type !== "bi_implication")
				throw [false, "the referent sentence is not a conditional"];
			firstBiImplication = false;
		}

		function validateBiImplicationElimination(
			firstBiImplication: boolean,
			tryAgain = true
		): string | null {
			const biImplicationLine: ProofLine & {
				sentence: {
					type: "bi_implication";
					value: [Sentence, Sentence];
				};
			} = (firstBiImplication ? firstReferent : secondReferent) as any;
			const eliminationLine = firstBiImplication
				? secondReferent
				: firstReferent;

			const [leftHandSentence, rightHandSentence] =
				biImplicationLine.sentence.value;

			let failureReason: string | null = null;

			const sentencesEqual =
				equal(leftHandSentence, line.sentence) &&
				equal(rightHandSentence, eliminationLine.sentence);
			const sentencesEqualReversed =
				equal(leftHandSentence, eliminationLine.sentence) &&
				equal(rightHandSentence, line.sentence);
			if (!(sentencesEqual || sentencesEqualReversed))
				failureReason =
					"the referent and referree do not comprise the two sides of the biconditional";

			if (
				tryAgain &&
				failureReason !== null &&
				eliminationLine.sentence.type === "bi_implication"
			)
				return validateBiImplicationElimination(
					!firstBiImplication,
					false
				);

			return failureReason;
		}

		let failureReason =
			validateBiImplicationElimination(firstBiImplication);
		if (failureReason !== null) throw [false, failureReason];

		return [true];
	}

	if (line.reason[0] === "negation_introduction") {
		if (line.sentence.type !== "negation")
			throw [
				false,
				"negation introduction can only be used to create negated sentences",
			];

		const [start, end] = referToSubproof(
			line,
			precedingProof,
			line.reason[1]
		);

		if (end.sentence.type !== "contradiction")
			throw [
				false,
				"the referent subproof does not demonstrate a contradiction",
			];

		if (!equal(start.sentence, line.sentence.value))
			throw [
				false,
				"the referent subproof doesn't show that the referree is contradictory",
			];

		return [true];
	}

	if (line.reason[0] === "indirect_proof") {
		const [start, end] = referToSubproof(
			line,
			precedingProof,
			line.reason[1]
		);

		if (start.sentence.type !== "negation")
			throw [false, "the referent subproof does not assume a negation"];

		if (end.sentence.type !== "contradiction")
			throw [
				false,
				"the referent subproof does not demonstrate a contradiction",
			];

		if (!equal(start.sentence.value, line.sentence))
			throw [
				false,
				"the referent subproof doesn't show that the negated referree is contradictory",
			];

		return [true];
	}

	if (line.reason[0] === "negation_elimination") {
		if (line.sentence.type !== "contradiction")
			throw [
				false,
				"negation elimination can only be used to demonstrate a contradiction",
			];

		const firstReferent = referToLine(line, precedingProof, line.reason[1]);
		const secondReferent = referToLine(
			line,
			precedingProof,
			line.reason[2]
		);

		let firstNegation = true;
		if (firstReferent.sentence.type !== "negation") {
			if (secondReferent.sentence.type !== "negation")
				throw [false, "the referent sentence is not a negation"];
			firstNegation = false;
		}

		function validateNegationElimination(
			firstNegation: boolean,
			tryAgain = true
		): string | null {
			const negationLine: ProofLine & {
				sentence: {
					type: "negation";
					value: Sentence;
				};
			} = (firstNegation ? firstReferent : secondReferent) as any;
			const eliminationLine = firstNegation
				? secondReferent
				: firstReferent;

			let failureReason: string | null = null;
			if (!equal(negationLine.sentence.value, eliminationLine.sentence))
				failureReason =
					"the first referent is not the negation of the other";

			if (
				tryAgain &&
				failureReason !== null &&
				eliminationLine.sentence.type === "negation"
			)
				return validateNegationElimination(!firstNegation, false);

			return failureReason;
		}

		let failureReason = validateNegationElimination(firstNegation);
		if (failureReason !== null) throw [false, failureReason];

		return [true];
	}

	if (line.reason[0] === "explosion") {
		const referent = referToLine(line, precedingProof, line.reason[1]);
		if (referent.sentence.type !== "contradiction")
			throw [false, "the referent is not a contradiction"];

		return [true];
	}

	// derived rules

	if (type === "reiteration") {
		const referent = referToLine(line, precedingProof, line.reason[1]);

		if (!equal(line.sentence, referent.sentence))
			throw [
				false,
				"the referent sentence is not the same as the referree",
			];

		return [true];
	}

	if (type === "disjunctive_syllogism") {
		const firstReferent = referToLine(line, precedingProof, line.reason[1]);
		const secondReferent = referToLine(
			line,
			precedingProof,
			line.reason[2]
		);

		let firstDisjunction = true;
		if (firstReferent.sentence.type !== "disjunction") {
			if (secondReferent.sentence.type !== "disjunction")
				throw [false, "the referent sentence is not a disjunction"];
			firstDisjunction = false;
		}

		const disjunctionLine: ProofLine & {
			sentence: {
				type: "disjunction";
				value: [Sentence, Sentence];
			};
		} = (firstDisjunction ? firstReferent : secondReferent) as any;
		const eliminationLine = firstDisjunction
			? secondReferent
			: firstReferent;

		if (eliminationLine.sentence.type !== "negation")
			throw [false, "the referent sentence is not a negation"];

		const [leftHandSentence, rightHandSentence] =
			disjunctionLine.sentence.value;

		const sentencesEqual =
			equal(line.sentence, leftHandSentence) &&
			equal(eliminationLine.sentence.value, rightHandSentence);
		const sentencesEqualReversed =
			equal(line.sentence, rightHandSentence) &&
			equal(eliminationLine.sentence.value, leftHandSentence);

		if (!(sentencesEqual || sentencesEqualReversed))
			throw [
				false,
				"the referent and referree do not make up both sides of the disjunction",
			];

		return [true];
	}

	if (line.reason[0] === "modus_tollens") {
		if (line.sentence.type !== "negation")
			throw [
				false,
				"modus tollens can only be used to introduce a negation",
			];

		const firstReferent = referToLine(line, precedingProof, line.reason[1]);
		const secondReferent = referToLine(
			line,
			precedingProof,
			line.reason[2]
		);

		let firstImplication = true;
		if (firstReferent.sentence.type !== "implication") {
			if (secondReferent.sentence.type !== "implication")
				throw [false, "the referent sentence is not a conditional"];
			firstImplication = false;
		}

		const implicationLine: ProofLine & {
			sentence: {
				type: "implication";
				value: [Sentence, Sentence];
			};
		} = (firstImplication ? firstReferent : secondReferent) as any;
		const eliminationLine = firstImplication
			? secondReferent
			: firstReferent;

		if (eliminationLine.sentence.type !== "negation")
			throw [false, "the referent sentence is not a negation"];

		const [antecedent, consequent] = implicationLine.sentence.value;

		if (!equal(consequent, eliminationLine.sentence.value))
			throw [false, "the referent does not negate the consequent"];

		if (!equal(antecedent, line.sentence.value))
			throw [false, "the referree does not negate the antecedent"];

		return [true];
	}

	if (line.reason[0] === "double_negation_elimination") {
		const referent = referToLine(line, precedingProof, line.reason[1]);

		if (
			referent.sentence.type !== "negation" ||
			referent.sentence.value.type !== "negation"
		)
			throw [false, "the referent sentence is not a double negation"];

		if (!equal(line.sentence, referent.sentence.value.value))
			throw [
				false,
				"the referent is not the double negation of the referree",
			];

		return [true];
	}

	if (line.reason[0] === "excluded_middle") {
		const [firstStart, firstEnd] = referToSubproof(
			line,
			precedingProof,
			line.reason[1]
		);
		const [secondStart, secondEnd] = referToSubproof(
			line,
			precedingProof,
			line.reason[2]
		);

		if (!equal(firstEnd.sentence, secondEnd.sentence))
			throw [
				false,
				"the referent subproofs do not demonstrate the same conclusion",
			];

		if (!equal(firstEnd.sentence, line.sentence))
			throw [
				false,
				"the referent subproofs do not demonstrate the referree",
			];

		const assumptionsEqual =
			firstStart.sentence.type === "negation" &&
			equal(firstStart.sentence.value, secondStart.sentence);
		const assumptionsEqualReversed =
			secondStart.sentence.type === "negation" &&
			equal(secondStart.sentence.value, firstStart.sentence);

		if (!(assumptionsEqual || assumptionsEqualReversed))
			throw [
				false,
				"the referent assumptions are not negations of each other",
			];

		return [true];
	}

	if (line.reason[0] === "de_morgan") {
		const referent = referToLine(line, precedingProof, line.reason[1]);

		const failureReason =
			"the referree and referent do not comprise one of De Morgan's laws";

		let negatedReferent = true;
		if (referent.sentence.type !== "negation") {
			if (line.sentence.type !== "negation") throw [false, failureReason];
			negatedReferent = false;
		}

		const negationLine: ProofLine & {
			sentence: {
				type: "negation";
				value: Sentence;
			};
		} = (negatedReferent ? referent : line) as any;
		const transformedLine = negatedReferent ? line : referent;

		if (
			// ~(A & B) > (~A | ~B)
			(negationLine.sentence.value.type === "conjunction" &&
				transformedLine.sentence.type === "disjunction" &&
				transformedLine.sentence.value[0].type === "negation" &&
				transformedLine.sentence.value[1].type === "negation") ||
			// ~(A | B) > (~A & ~B)
			(negationLine.sentence.value.type === "disjunction" &&
				transformedLine.sentence.type === "conjunction" &&
				transformedLine.sentence.value[0].type === "negation" &&
				transformedLine.sentence.value[1].type === "negation")
		) {
			const [firstLeft, firstRight] = negationLine.sentence.value.value;
			const [secondLeft, secondRight] = negationLine.sentence.value.value;
			const sentencesEqual =
				equal(firstLeft, secondLeft) && equal(firstRight, secondRight);
			const sentencesEqualReversed =
				equal(firstLeft, secondRight) && equal(firstRight, secondLeft);
			if (sentencesEqual || sentencesEqualReversed) return [true];
		}

		throw [false, failureReason];
	}

	throw "unexpected proof line type!";
}

// this catches failure reasons thrown by helper functions and presents them as
// valid failure states
export function validateProofLine(
	line: ProofLine,
	precedingProof: Proof
): [boolean, string] {
	try {
		const [valid, reason] = validateProofLineWithErrors(
			line,
			precedingProof
		);
		return [valid, reason || "this line is valid"];
	} catch (e: unknown) {
		if (
			!(
				e instanceof Array &&
				e.length === 2 &&
				typeof e[0] === "boolean" &&
				typeof e[1] === "string"
			)
		)
			throw e;
		return e as [false, string];
	}
}

export function validateIncompleteProofLine(
	line: IncompleteProofLine,
	precedingProof: Proof
): [boolean, string] {
	if (typeof line.reason === "string")
		return [false, "the reason for this line was not able to be parsed"];
	if (typeof line.sentence === "string")
		return [false, "the sentence for this line was not able to be parsed"];
	return validateProofLine(line as ProofLine, precedingProof);
}
