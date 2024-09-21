import { clsx } from "clsx";
import { LetterComponent } from "./LetterComponent";
import { getLetters, getModels } from "./lib/logic/getModels";
import { resolve } from "./lib/logic/resolve";
import { includesLetter, Sentence, SentenceType } from "./lib/logic/Sentence";
import { Fragment } from "react/jsx-runtime";

function getColumnHeaders(sentence: Sentence): React.ReactNode[] {
	if (sentence.type === SentenceType.Letter) {
		return [<LetterComponent letter={sentence.value} />];
	}

	if (sentence.type === SentenceType.Negation)
		return ["¬", ...getColumnHeaders(sentence.value)];

	const leftNodes = getColumnHeaders(sentence.value[0]);
	const rightNodes = getColumnHeaders(sentence.value[1]);

	let connective: string;
	if (sentence.type === SentenceType.Conjunction) connective = "∧";
	else if (sentence.type === SentenceType.Disjunction) connective = "∨";
	else if (sentence.type === SentenceType.Implication) connective = "→";
	else connective = "↔";

	leftNodes[0] = <>({leftNodes[0]}</>;
	rightNodes[rightNodes.length - 1] = (
		<>{rightNodes[rightNodes.length - 1]})</>
	);

	return [...leftNodes, connective, ...rightNodes];
}

function getArrayOfSentence(sentence: Sentence): Sentence[] {
	if (sentence.type === SentenceType.Letter) return [sentence];
	if (sentence.type === SentenceType.Negation)
		return [sentence, ...getArrayOfSentence(sentence.value)];
	return [
		...getArrayOfSentence(sentence.value[0]),
		sentence,
		...getArrayOfSentence(sentence.value[1]),
	];
}

function getPrimaryConnectiveIndex(sentence: Sentence): number {
	if (sentence.type === SentenceType.Letter) return 0;
	if (sentence.type === SentenceType.Negation) return 0;
	return getArrayOfSentence(sentence.value[0]).length;
}

interface TruthTableProps {
	sentence: Sentence;
	onlyTrue?: boolean;
}

export function TruthTable({ sentence, onlyTrue = false }: TruthTableProps) {
	const letters = getLetters(sentence);
	const models = getModels(sentence);

	const headers = getColumnHeaders(sentence);
	const columns = getArrayOfSentence(sentence);

	const primaryIndex = getPrimaryConnectiveIndex(sentence);

	return (
		<div
			className="text-center grid justify-center"
			style={{
				gridTemplateColumns: `repeat(${letters.length}, ${Math.max(
					4 / letters.length,
					2
				)}rem) repeat(${headers.length}, ${Math.max(
					6 / headers.length,
					2
				)}rem)`,
			}}
		>
			<div
				className="border-r min-w-16"
				style={{ gridColumn: `span ${letters.length}` }}
			>
				model
			</div>
			<div
				className="min-w-24"
				style={{ gridColumn: `span ${headers.length}` }}
			>
				sentence
			</div>

			{letters.map((letter, i) => (
				<div
					key={i}
					className={clsx(
						"border-b",
						i === letters.length - 1 && "border-r"
					)}
				>
					<LetterComponent letter={letter} />
				</div>
			))}

			{headers.map((node, i) => (
				<div
					key={i + letters.length}
					className={clsx(
						"border-b",
						i === primaryIndex && "font-bold"
					)}
				>
					{node}
				</div>
			))}

			{(onlyTrue
				? models.filter((model) => resolve(sentence, model))
				: models
			).map((model, i) => (
				<Fragment key={i}>
					{letters.map((letter, i) => (
						<div
							key={i}
							className={clsx(
								i === letters.length - 1 && "border-r"
							)}
						>
							{includesLetter(model, letter) ? "T" : "F"}
						</div>
					))}

					{columns.map((part, i) => (
						<div
							key={i + letters.length}
							className={clsx(i === primaryIndex && "font-bold")}
						>
							{resolve(part, model) ? "T" : "F"}
						</div>
					))}
				</Fragment>
			))}
		</div>
	);
}
