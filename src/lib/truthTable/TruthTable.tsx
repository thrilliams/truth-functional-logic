import { clsx } from "clsx";
import { JSXElement } from "solid-js";
import { getLetters, getModels } from "../logic/getModels";
import { includesLetter } from "../logic/Letter";
import { resolve } from "../logic/resolve";
import { Sentence } from "../logic/Sentence";
import { LetterComponent } from "./LetterComponent";

function getColumnHeaders(sentence: Sentence): JSXElement[] {
	if (sentence.type === "contradiction") return ["⊥"];

	if (sentence.type === "letter") {
		return [<LetterComponent letter={sentence.value} />];
	}

	if (sentence.type === "negation")
		return ["¬", ...getColumnHeaders(sentence.value)];

	const leftNodes = getColumnHeaders(sentence.value[0]);
	const rightNodes = getColumnHeaders(sentence.value[1]);

	let connective: string;
	if (sentence.type === "conjunction") connective = "∧";
	else if (sentence.type === "disjunction") connective = "∨";
	else if (sentence.type === "implication") connective = "→";
	else connective = "↔";

	leftNodes[0] = <>({leftNodes[0]}</>;
	rightNodes[rightNodes.length - 1] = (
		<>{rightNodes[rightNodes.length - 1]})</>
	);

	return [...leftNodes, connective, ...rightNodes];
}

function getArrayOfSentence(sentence: Sentence): Sentence[] {
	if (sentence.type === "letter" || sentence.type === "contradiction")
		return [sentence];
	if (sentence.type === "negation")
		return [sentence, ...getArrayOfSentence(sentence.value)];
	return [
		...getArrayOfSentence(sentence.value[0]),
		sentence,
		...getArrayOfSentence(sentence.value[1]),
	];
}

function getPrimaryConnectiveIndex(sentence: Sentence): number {
	if (
		sentence.type === "letter" ||
		sentence.type === "negation" ||
		sentence.type === "contradiction"
	)
		return 0;
	return getArrayOfSentence(sentence.value[0]).length;
}

interface TruthTableProps {
	sentence: Sentence;
	onlyTrue?: boolean;
}

export function TruthTable(props: TruthTableProps) {
	const letters = getLetters(props.sentence);
	const models = getModels(props.sentence);

	const headers = getColumnHeaders(props.sentence);
	const columns = getArrayOfSentence(props.sentence);

	const primaryIndex = getPrimaryConnectiveIndex(props.sentence);

	return (
		<div
			class="text-center grid justify-center"
			style={{
				"grid-template-columns": `repeat(${letters.length}, ${Math.max(
					4 / letters.length,
					2,
				)}rem) repeat(${headers.length}, ${Math.max(
					6 / headers.length,
					2,
				)}rem)`,
			}}
		>
			{letters.length > 0 && (
				<div
					class="border-r min-w-16"
					style={{ "grid-column": `span ${letters.length}` }}
				>
					model
				</div>
			)}
			<div
				class="min-w-24"
				style={{ "grid-column": `span ${headers.length}` }}
			>
				sentence
			</div>

			{letters.map((letter, i) => (
				<div
					class={clsx(
						"border-b",
						i === letters.length - 1 && "border-r",
					)}
				>
					<LetterComponent letter={letter} />
				</div>
			))}

			{headers.map((node, i) => (
				<div
					class={clsx("border-b", i === primaryIndex && "font-bold")}
				>
					{node}
				</div>
			))}

			{(props.onlyTrue
				? models.filter((model) => resolve(props.sentence, model))
				: models
			).map((model) => (
				<>
					{letters.map((letter, i) => (
						<div
							class={clsx(i === letters.length - 1 && "border-r")}
						>
							{includesLetter(model, letter) ? "T" : "F"}
						</div>
					))}

					{columns.map((part, i) => (
						<div class={clsx(i === primaryIndex && "font-bold")}>
							{resolve(part, model) ? "T" : "F"}
						</div>
					))}
				</>
			))}
		</div>
	);
}
