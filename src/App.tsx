import { createPersistentSignal } from "./lib/createPersistentSignal";
import { InteractiveProofValidator } from "./lib/proofValidator/InteractiveProofValidator";
import { InteractiveTruthTable } from "./lib/truthTable/InteractiveTruthTable";

export enum Mode {
	Proof = "proof",
	TruthTable = "truth_table",
}

function stringifyMode(mode: Mode) {
	return mode === Mode.Proof ? "writing proofs" : "evaluating sentences";
}

export function App() {
	const [mode, setMode] = createPersistentSignal<Mode>("mode", Mode.Proof);
	const nextMode = () =>
		mode() === Mode.Proof ? Mode.TruthTable : Mode.Proof;

	return (
		<div
			class="grid min-h-svh p-2"
			style={{
				"grid-template-columns": "1fr minmax(max-content, 32rem) 1fr",
				"grid-template-rows": "max-content auto max-content",
			}}
		>
			{mode() === Mode.Proof ? (
				<InteractiveProofValidator />
			) : (
				<InteractiveTruthTable />
			)}

			<span class="col-start-1 col-span-3 row-start-3 text-xs grid grid-cols-[1fr_min-content_1fr] mx-4">
				<span class="col-start-2 flex justify-center items-center">
					<a
						href="https://github.com/thrilliams/truth-functional-logic"
						target="_blank"
						class="text-nowrap underline decoration-dashed"
					>
						source ↗
					</a>
				</span>

				<span class="col-start-3 flex gap-2 justify-end items-center">
					<span>{stringifyMode(mode())}.</span>
					<button
						class="border rounded px-1 transition-colors hover:bg-[#e5e7eb]"
						onClick={() => setMode(nextMode())}
						title="work is automatically saved"
					>
						switch to {stringifyMode(nextMode())}
					</button>
				</span>
			</span>
		</div>
	);
}
