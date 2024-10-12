import { con, not, wrapLetter } from "./helpers";
import { SentenceType, type Sentence } from "./Sentence";

export function parseSentence(string: string): Sentence | null {
	const [sentence, _remainder] = matchSentence(string, true);
	return sentence || null;
}

type MatchResult = [Sentence, string] | [];

const resultValid = (
	result: MatchResult,
	matchFull = false
): result is [Sentence, string] =>
	result[0] !== undefined &&
	result[1] !== undefined &&
	(matchFull ? result[1].length === 0 : true);

const matchSentence = (input: string, topLevel = false): MatchResult => {
	const conjunctionResult = matchConjunction(input, !topLevel);
	if (resultValid(conjunctionResult, topLevel)) return conjunctionResult;

	const disjunctionResult = matchDisjunction(input, !topLevel);
	if (resultValid(disjunctionResult, topLevel)) return disjunctionResult;

	const implicationResult = matchImplication(input, !topLevel);
	if (resultValid(implicationResult, topLevel)) return implicationResult;

	const biImplicationResult = matchBiImplication(input, !topLevel);
	if (resultValid(biImplicationResult, topLevel)) return biImplicationResult;

	const negationResult = matchNegation(input);
	if (resultValid(negationResult, topLevel)) return negationResult;

	const letterResult = matchLetter(input);
	if (resultValid(letterResult, topLevel)) return letterResult;

	const contradictionResult = matchContradiction(input);
	if (resultValid(contradictionResult, topLevel)) return contradictionResult;

	return [];
};

const matchContradiction = (input: string): MatchResult => {
	const match = /^!\?/.exec(input);
	if (match === null) return [];

	return [con(), input.slice(match[0].length)];
};

const matchLetter = (input: string): MatchResult => {
	const match = /^(?<char>[A-Za-z])(?:_?(?<sub>[0-9]+))?/.exec(input);
	if (match === null) return [];

	return [
		wrapLetter([
			match.groups?.char.toUpperCase()!,
			match.groups?.sub ? parseInt(match.groups?.sub) : undefined,
		]),
		input.slice(match[0].length),
	];
};

const matchNegation = (input: string): MatchResult => {
	const match = /^(?:¬|-|~|not ) */.exec(input);
	if (match === null) return [];

	const remainder = input.slice(match[0].length);

	const sentenceResult = matchSentence(remainder);
	if (resultValid(sentenceResult))
		return [not(sentenceResult[0]), sentenceResult[1]];

	return [];
};

const matchConnectiveInner = (
	type:
		| SentenceType.Conjunction
		| SentenceType.Disjunction
		| SentenceType.Implication
		| SentenceType.BiImplication,
	connective: RegExp,
	input: string,
	rightBracket?: string
): MatchResult => {
	const leftResults = matchSentence(input);
	if (!resultValid(leftResults)) return [];
	const [leftSentence, leftRemainder] = leftResults;

	const connectivePattern = new RegExp(`^ *(?:${connective.source}) *`);
	const connectiveMatch = connectivePattern.exec(leftRemainder);
	if (connectiveMatch === null) return [];
	const connectiveRemainder = leftRemainder.slice(connectiveMatch[0].length);

	const rightResults = matchSentence(connectiveRemainder);
	if (!resultValid(rightResults)) return [];
	let [rightSentence, rightRemainder] = rightResults;

	if (rightBracket !== undefined) {
		const closeParenPattern = new RegExp(`^ *\\${rightBracket}`);
		const closeParenMatch = closeParenPattern.exec(rightRemainder);
		if (closeParenMatch === null) return [];

		rightRemainder = rightRemainder.slice(closeParenMatch[0].length);
	}

	return [{ type, value: [leftSentence, rightSentence] }, rightRemainder];
};

const matchConnective =
	(
		type:
			| SentenceType.Conjunction
			| SentenceType.Disjunction
			| SentenceType.Implication
			| SentenceType.BiImplication,
		connective: RegExp
	): ((input: string, requireBrackets?: boolean) => MatchResult) =>
	(input, requireBrackets = true) => {
		// if brackets are optional, attempt to match without first
		if (!requireBrackets) {
			const innerMatch = matchConnectiveInner(type, connective, input);
			if (resultValid(innerMatch)) return innerMatch;
		}

		const leftBracketMatch = /^(?<bracket>\(|\[) */.exec(input);
		if (leftBracketMatch === null) return [];

		const leftBracket = leftBracketMatch.groups?.bracket!;
		const bracketRemainder = input.slice(leftBracketMatch[0].length);

		const innerMatch = matchConnectiveInner(
			type,
			connective,
			bracketRemainder,
			leftBracket === "(" ? ")" : "]"
		);
		if (resultValid(innerMatch)) return innerMatch;

		return [];
	};

const matchConjunction = matchConnective(
	SentenceType.Conjunction,
	/∧|\/\\|&| and /
);

const matchDisjunction = matchConnective(
	SentenceType.Disjunction,
	/∨|\\\/|\|| or /
);

const matchImplication = matchConnective(SentenceType.Implication, /→|->|=>|>/);

const matchBiImplication = matchConnective(
	SentenceType.BiImplication,
	// <> is non-standard by the criteria of forall x: Calgary
	// thankfully i like it so who cares
	/↔|<->|<=>|<>/
);
