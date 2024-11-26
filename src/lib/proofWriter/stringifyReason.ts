import { ProofLineType, Reason } from "../proof/Proof";

export function stringifyReason([type, ...references]: Reason): string {
	const referenceString = references
		.map((e) => (e instanceof Array ? `${e[0] + 1}-${e[1] + 1}` : e + 1))
		.join(",");

	if (type === ProofLineType.Premise) return "PR";
	if (type === ProofLineType.Assumption) return "AS";

	if (type === ProofLineType.DisjunctionIntroduction)
		return "∨I" + referenceString;
	if (type === ProofLineType.DisjunctionElimination)
		return "∨E" + referenceString;
	if (type === ProofLineType.ConjunctionIntroduction)
		return "∧I" + referenceString;
	if (type === ProofLineType.ConjunctionElimination)
		return "∧E" + referenceString;
	if (type === ProofLineType.ImplicationIntroduction)
		return "→I" + referenceString;
	if (type === ProofLineType.ImplicationElimination)
		return "→E" + referenceString;
	if (type === ProofLineType.BiImplicationIntroduction)
		return "↔I" + referenceString;
	if (type === ProofLineType.BiImplicationElimination)
		return "↔E" + referenceString;

	if (type === ProofLineType.NegationIntroduction)
		return "¬I" + referenceString;
	if (type === ProofLineType.IndirectProof) return "IP" + referenceString;
	if (type === ProofLineType.NegationElimination)
		return "¬E" + referenceString;
	if (type === ProofLineType.Explosion) return "X" + referenceString;

	if (type === ProofLineType.Reiteration) return "R" + referenceString;
	if (type === ProofLineType.DisjunctiveSyllogism)
		return "DS" + referenceString;
	if (type === ProofLineType.ModusTollens) return "MT" + referenceString;
	if (type === ProofLineType.DoubleNegationElimination)
		return "DNE" + referenceString;
	if (type === ProofLineType.ExcludedMiddle) return "LEM" + referenceString;
	if (type === ProofLineType.DeMorgan) return "DeM" + referenceString;

	throw "unexpected proof line type!";
}
