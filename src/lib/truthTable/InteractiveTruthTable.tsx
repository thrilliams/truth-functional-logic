import { createMemo, createSignal, Match, Switch } from "solid-js";
import { createPersistentSignal } from "../createPersistentSignal";
import { parseSentence } from "../logic/parseSentence";
import { TruthTable } from "./TruthTable";

export function InteractiveTruthTable(props: { initial?: string }) {
	const labelClasses = "block text-right text-xs italic";

	const [input, setInput] = createPersistentSignal<string>(
		"truth_table",
		props?.initial || "",
	);

	let sentence = createMemo(() => parseSentence(input()));

	const [onlyTrue, setOnlyTrue] = createSignal(false);

	return (
		<div class="col-start-2 w-full flex flex-col gap-4 py-2 px-4 border rounded mx-auto">
			<div>
				<label class={labelClasses} for="tfl-input">
					tfl input
				</label>
				<input
					id="tfl-input"
					class="px-1 border rounded w-full font-mono"
					type="text"
					placeholder="(A > B) | C"
					value={input()}
					onInput={(event) => setInput(event.target.value)}
				/>
			</div>
			<div class="min-h-32">
				<span class={labelClasses}>truth table</span>
				<Switch
					fallback={
						<pre class="text-center text-xs">
							[ungrammatical input]
						</pre>
					}
				>
					<Match when={input() === ""}>
						<p class="text-center text-xs">awaiting input...</p>
					</Match>
					<Match when={sentence()}>
						{(sentence) => (
							<TruthTable
								sentence={sentence()}
								onlyTrue={onlyTrue()}
							/>
						)}
					</Match>
				</Switch>
			</div>

			<div class="flex gap-4 justify-end">
				<div class="space-x-1">
					<input
						type="checkbox"
						id="show-only-true"
						class="h-3"
						checked={onlyTrue()}
						onChange={(event) => setOnlyTrue(event.target.checked)}
					/>
					<label for="show-only-true">
						<span
							class="text-xs cursor-help underline decoration-dotted"
							title="show only cases where the primary connective is satisfied"
						>
							only true
						</span>
					</label>
				</div>
			</div>
		</div>
	);
}
