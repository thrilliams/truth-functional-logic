import { parseProof } from "./parseProof";
import { ProofComponent } from "./ProofComponent";
import ReactCodeMirror from "@uiw/react-codemirror";
import clsx from "clsx";
import createTheme from "@uiw/codemirror-themes";
import { Mode } from "../../App";
import { useLocalStorageState } from "../useLocalStorageState";

const theme = createTheme({
	theme: "light",
	settings: { gutterBorder: "#e5e7eb" },
	styles: [],
});

export function InteractiveProofWriter() {
	const [input, setInput] = useLocalStorageState(Mode.Proof, "");

	const proof = parseProof(input);
	const editorClasses =
		"col-start-1 row-start-1 m-4 rounded border overflow-hidden";

	return (
		<div className="col-span-3 row-span-2 grid grid-cols-2 relative">
			<ReactCodeMirror
				className={clsx(editorClasses, "pointer-events-auto text-base")}
				value={input}
				onChange={setInput}
				height="100%"
				basicSetup={{ tabSize: 1 }}
				placeholder={"awaiting input..."}
				theme={theme}
				autoFocus
			/>
			<div className={clsx(editorClasses, "z-10 pointer-events-none")} />
			<ProofComponent proof={proof} />
		</div>
	);
}
