import { InteractiveTruthTable } from "./lib/logic/InteractiveTruthTable";

export function App() {
	return (
		<div
			className="grid min-h-[100svh] p-2"
			style={{
				gridTemplateColumns: "auto minmax(max-content, 32rem) auto",
				gridTemplateRows: "max-content auto max-content",
			}}
		>
			<InteractiveTruthTable />

			<span className="mx-auto mt-auto col-start-2 row-start-3 text-xs">
				<a href="https://github.com/thrilliams/truth-functional-logic">
					source
				</a>
			</span>
		</div>
	);
}
