import { Reason } from "../proof/Proof";

export function stringifyReason([type, ...references]: Reason): string {
	const referenceString = references
		.map((e) => (e instanceof Array ? `${e[0] + 1}-${e[1] + 1}` : e + 1))
		.join(",");

	if (type === "premise") return "PR";
	if (type === "assumption") return "AS";

	if (type === "disjunction_introduction") return "∨I" + referenceString;
	if (type === "disjunction_elimination") return "∨E" + referenceString;
	if (type === "conjunction_introduction") return "∧I" + referenceString;
	if (type === "conjunction_elimination") return "∧E" + referenceString;
	if (type === "implication_introduction") return "→I" + referenceString;
	if (type === "implication_elimination") return "→E" + referenceString;
	if (type === "bi_implication_introduction") return "↔I" + referenceString;
	if (type === "bi_implication_elimination") return "↔E" + referenceString;

	if (type === "negation_introduction") return "¬I" + referenceString;
	if (type === "indirect_proof") return "IP" + referenceString;
	if (type === "negation_elimination") return "¬E" + referenceString;
	if (type === "explosion") return "X" + referenceString;

	if (type === "reiteration") return "R" + referenceString;
	if (type === "disjunctive_syllogism") return "DS" + referenceString;
	if (type === "modus_tollens") return "MT" + referenceString;
	if (type === "double_negation_elimination") return "DNE" + referenceString;
	if (type === "excluded_middle") return "LEM" + referenceString;
	if (type === "de_morgan") return "DeM" + referenceString;

	throw "unexpected proof line type!";
}
