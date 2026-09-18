import clsx from "clsx";
import { basicSetup } from "codemirror";
import { createMemo } from "solid-js";
import { Mode } from "../../App";
import { createPersistentSignal } from "../createPersistentSignal";
import { logic } from "../language";
import { parseProof } from "../proof/parseProof";
import { createEditor } from "./createEditor";
import { ProofComponent } from "./ProofComponent";

export function InteractiveProofValidator(props: { initial?: string }) {
	const editorClasses =
		"col-start-1 row-start-1 rounded border overflow-hidden";

	const [input, setInput] = createPersistentSignal(
		Mode.Proof,
		props?.initial || "",
	);

	const ref = createEditor({
		input,
		setInput,
		extensions: [basicSetup, logic],
	});

	const proof = createMemo(() => parseProof(input()));

	return (
		<div class="col-span-3 row-span-2 grid grid-cols-2 gap-4 relative">
			<div
				ref={ref}
				class={clsx(
					editorClasses,
					"pointer-events-auto text-base *:h-full",
				)}
			/>
			<div class={clsx(editorClasses, "z-10 pointer-events-none")} />
			<ProofComponent proof={proof()} />
		</div>
	);
}
