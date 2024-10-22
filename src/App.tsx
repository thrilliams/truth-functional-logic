import { InteractiveProofWriter } from "./lib/proof/InteractiveProofWriter";
import { InteractiveTruthTable } from "./lib/logic/InteractiveTruthTable";
import { useLocalStorageState } from "./lib/useLocalStorageState";

export enum Mode {
	Proof = "proof",
	TruthTable = "truth_table",
}

function stringifyMode(mode: Mode) {
	return mode === Mode.Proof ? "writing proofs" : "evaluating sentences";
}

export function App() {
	const [mode, setMode] = useLocalStorageState<Mode>("mode", Mode.Proof);
	const nextMode = mode === Mode.Proof ? Mode.TruthTable : Mode.Proof;

	return (
		<div
			className="grid min-h-[100svh] p-2"
			style={{
				gridTemplateColumns: "1fr minmax(max-content, 32rem) 1fr",
				gridTemplateRows: "max-content auto max-content",
			}}
		>
			{mode === Mode.Proof ? (
				<InteractiveProofWriter />
			) : (
				<InteractiveTruthTable />
			)}

			<span className="col-start-1 col-span-3 row-start-3 text-xs grid grid-cols-[1fr_min-content_1fr] mx-4">
				<span className="col-start-2 flex justify-center items-center">
					<a
						href="https://github.com/thrilliams/truth-functional-logic"
						target="_blank"
						className="text-nowrap underline decoration-dashed"
					>
						source ↗
					</a>
				</span>

				<span className="col-start-3 flex gap-2 justify-end items-center">
					<span>{stringifyMode(mode)}.</span>
					<button
						className="border rounded px-1 transition-colors hover:bg-[#e5e7eb]"
						onClick={() => setMode(nextMode)}
						title="work is automatically saved"
					>
						switch to {stringifyMode(nextMode)}
					</button>
				</span>
			</span>
		</div>
	);
}
