import { JSXElement } from "solid-js";

interface ProofLineComponentProps {
	index: number;
	sentence?: JSXElement;
	reason?: JSXElement;
	validity?: JSXElement;
	validityMessage?: string;
}

export function ProofLineComponent(props: ProofLineComponentProps) {
	return (
		<>
			<span class="inline-flex justify-end text-right">
				{props.index + 1}
				<span class="font-mono whitespace-pre"> </span>
			</span>
			<div class="flex">{props.sentence}</div>
			<span class="text-right">{props.reason}</span>
			<span class="text-center" title={props.validityMessage}>
				{props.validity}
			</span>
		</>
	);
}
