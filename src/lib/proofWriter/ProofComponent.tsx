import clsx from "clsx";
import { findLastIndex } from "../proof/findLastIndex";
import { IncompleteProof } from "../proof/parseProof";
import { Proof } from "../proof/Proof";
import { arraysEqual } from "../proof/subproof";
import { validateIncompleteProofLine } from "../proof/validateProofLine";
import { stringify } from "../truthTable/stringify";
import { ProofLineComponent } from "./ProofLineComponent";
import { stringifyReason } from "./stringifyReason";

interface ProofComponentProps {
	proof: IncompleteProof;
}

export function ProofComponent(props: ProofComponentProps) {
	const lines = () => {
		const lines = [];

		const indexOfLastPremise = findLastIndex(
			props.proof,
			(line) => line.reason[0] === "premise",
		);

		for (let i = 0; i < props.proof.length; i++) {
			const line = props.proof[i];

			const proofDepth = line.subproofIndex.length + 1;

			const underline =
				i === indexOfLastPremise || line.reason[0] === "assumption";

			let [valid, validityMessage] = [
				false,
				"the preceding proof could not be parsed in its entirety",
			];
			const precedingProof = props.proof.slice(0, i);
			if (
				precedingProof.find(
					(line) =>
						typeof line.reason === "string" ||
						typeof line.sentence === "string",
				) === undefined
			) {
				[valid, validityMessage] = validateIncompleteProofLine(
					line,
					precedingProof as Proof,
				);
			}

			const subproofIndex = line.subproofIndex;
			const isStart =
				i ===
				props.proof.findIndex((line) =>
					arraysEqual(subproofIndex, line.subproofIndex),
				);
			const isEnd =
				i ===
				findLastIndex(props.proof, (line) =>
					arraysEqual(subproofIndex, line.subproofIndex),
				);

			lines.push(
				<ProofLineComponent
					index={i}
					sentence={
						<>
							{Array(proofDepth)
								.fill(null)
								.map((_, i) => (
									<span
										class={clsx(
											"border-l border-black",
											i !== 0 && "ml-1",
											i === proofDepth - 1 &&
												i !== 0 &&
												isStart
												? "mt-1"
												: "pt-1",
											i === proofDepth - 1 &&
												i !== 0 &&
												isEnd &&
												!underline
												? "mb-1"
												: "pb-1",
										)}
									/>
								))}
							<span
								class={clsx(
									"px-1",
									underline
										? "border-black border-b"
										: "mb-px",
								)}
							>
								{typeof line.sentence !== "string" ? (
									stringify(line.sentence)
								) : (
									<pre>{line.sentence}</pre>
								)}
							</span>
						</>
					}
					reason={
						typeof line.reason !== "string" ? (
							stringifyReason(line.reason)
						) : (
							<pre>{line.reason}</pre>
						)
					}
					validity={
						typeof line.sentence !== "string" &&
						typeof line.reason !== "string"
							? valid
								? "+"
								: "-"
							: "!"
					}
					validityMessage={validityMessage}
				/>,
			);
		}

		return lines;
	};

	return (
		<div class="py-1 px-4 border rounded m-4 row-start-1">
			<div class="grid grid-cols-[min-content_1fr_min-content_min-content] gap-x-1 h-min">
				{lines()}
			</div>
		</div>
	);
}
