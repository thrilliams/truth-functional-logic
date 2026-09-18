import clsx from "clsx";
import { basicSetup } from "codemirror";
import {
	createCodeMirror,
	createEditorControlledValue,
	createEditorFocus,
} from "solid-codemirror";
import { createEffect, createMemo } from "solid-js";
import { Mode } from "../../App";
import { createPersistentSignal } from "../createPersistentSignal";
import { logic } from "../language";
import { parseProof } from "../proof/parseProof";
import { ProofComponent } from "./ProofComponent";

export function InteractiveProofWriter(props: { initial?: string }) {
	const editorClasses =
		"col-start-1 row-start-1 m-4 rounded border overflow-hidden";

	const [input, setInput] = createPersistentSignal(
		Mode.Proof,
		props?.initial || "",
	);

	const { ref, editorView, createExtension } = createCodeMirror({
		value: input(),
		onValueChange: setInput,
	});

	createEditorControlledValue(editorView, input);
	createExtension([basicSetup, logic]);

	const { setFocused } = createEditorFocus(editorView);
	createEffect(() => setFocused(true));

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
