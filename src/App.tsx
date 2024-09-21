import { useState } from "react";
import { parse } from "./lib/logic/parse";
import { TruthTable } from "./TruthTable";

export function App() {
	const [input, setInput] = useState("");
	let sentence = parse(input);

	const [onlyTrue, setOnlyTrue] = useState(false);

	const labelClasses = "block text-right text-xs italic";

	return (
		<div
			className="grid min-h-[100svh] p-2"
			style={{
				gridTemplateColumns: "auto minmax(max-content, 32rem) auto",
				gridTemplateRows: "max-content auto max-content",
			}}
		>
			<div className="col-start-2 w-full flex flex-col gap-4 mt-8 py-2 px-4 border rounded mx-auto">
				<div>
					<label className={labelClasses} htmlFor="tfl-input">
						tfl input
					</label>
					<input
						id="tfl-input"
						className="px-1 border rounded w-full"
						type="text"
						placeholder="(A > B) | C"
						value={input}
						onChange={(event) => setInput(event.target.value)}
					/>
				</div>
				<div className="h-[257px] overflow-auto">
					<span className={labelClasses}>truth table</span>
					{input === "" ? (
						<p className="text-center text-xs">awaiting input...</p>
					) : sentence ? (
						<TruthTable sentence={sentence} onlyTrue={onlyTrue} />
					) : (
						<pre className="text-center text-xs">
							[ungrammatical input]
						</pre>
					)}
				</div>
				<div className="flex gap-4 justify-end">
					<div className="space-x-1">
						<input
							type="checkbox"
							id="show-only-true"
							className="h-3"
							checked={onlyTrue}
							onChange={(event) =>
								setOnlyTrue(event.target.checked)
							}
						/>
						<label htmlFor="show-only-true">
							<span
								className="text-xs italic cursor-help underline decoration-dotted"
								title="show only cases where the primary connective is satisfied"
							>
								only true
							</span>
						</label>
					</div>
				</div>
			</div>

			<span className="mx-auto mt-auto col-start-2 row-start-3 text-xs">
				<a href="https://github.com/thrilliams/truth-functional-logic">
					source
				</a>
			</span>
		</div>
	);
}
