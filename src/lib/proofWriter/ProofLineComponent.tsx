import { ReactNode } from "react";

interface ProofLineComponentProps {
	index: number;
	sentence?: ReactNode;
	reason?: ReactNode;
	validity?: ReactNode;
	validityMessage?: string;
}

export function ProofLineComponent({
	index,
	sentence,
	reason,
	validity,
	validityMessage,
}: ProofLineComponentProps) {
	return (
		<>
			<span className="inline-flex justify-end text-right">
				{index + 1}
				<span className="font-mono whitespace-pre"> </span>
			</span>
			<div className="flex">{sentence}</div>
			<span className="text-right">{reason}</span>
			<span className="text-center" title={validityMessage}>
				{validity}
			</span>
		</>
	);
}
