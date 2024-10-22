import { Sentence } from "../logic/Sentence";

export enum ProofLineType {
	// structural rules
	Premise,
	Assumption,

	// atomic rules
	DisjunctionIntroduction,
	DisjunctionElimination,
	ConjunctionIntroduction,
	ConjunctionElimination,
	ImplicationIntroduction,
	ImplicationElimination,
	BiImplicationIntroduction,
	BiImplicationElimination,

	NegationIntroduction,
	IndirectProof,
	NegationElimination,
	Explosion,

	// derived rules
	Reiteration,
	DisjunctiveSyllogism,
	ModusTollens,
	DoubleNegationElimination,
	ExcludedMiddle,
	DeMorgan,
}

// PR
type Premise = [ProofLineType.Premise];
// AS
type Assumption = [ProofLineType.Assumption];

// |I i
type DisjunctionIntroduction = [ProofLineType.DisjunctionIntroduction, number];
// |E i,j-k,l-m
type DisjunctionElimination = [
	ProofLineType.DisjunctionElimination,
	number,
	[number, number],
	[number, number]
];
// &I i,j
type ConjunctionIntroduction = [
	ProofLineType.ConjunctionIntroduction,
	number,
	number
];
// &E i
type ConjunctionElimination = [ProofLineType.ConjunctionElimination, number];
// >I i-j
type ImplicationIntroduction = [
	ProofLineType.ImplicationIntroduction,
	[number, number]
];
// >E i,j
type ImplicationElimination = [
	ProofLineType.ImplicationElimination,
	number,
	number
];
// <>I i-j,k-l
type BiImplicationIntroduction = [
	ProofLineType.BiImplicationIntroduction,
	[number, number],
	[number, number]
];
// <>E i,j
type BiImplicationElimination = [
	ProofLineType.BiImplicationElimination,
	number,
	number
];

// ~I i-j
type NegationIntroduction = [
	ProofLineType.NegationIntroduction,
	[number, number]
];
// IP i-j
type IndirectProof = [ProofLineType.IndirectProof, [number, number]];
// ~E i,j
type NegationElimination = [ProofLineType.NegationElimination, number, number];
// X i
type Explosion = [ProofLineType.Explosion, number];

// R i
type Reiteration = [ProofLineType.Reiteration, number];
// DS i,j
type DisjunctiveSyllogism = [
	ProofLineType.DisjunctiveSyllogism,
	number,
	number
];
// MT i,j
type ModusTollens = [ProofLineType.ModusTollens, number, number];
// DNE i
type DoubleNegationElimination = [
	ProofLineType.DoubleNegationElimination,
	number
];
// LEM i-j,k-l
type ExcludedMiddle = [
	ProofLineType.ExcludedMiddle,
	[number, number],
	[number, number]
];
// DeM i
type DeMorgan = [ProofLineType.DeMorgan, number];

export type Reason =
	| Premise
	| Assumption
	//
	| DisjunctionIntroduction
	| DisjunctionElimination
	| ConjunctionIntroduction
	| ConjunctionElimination
	| ImplicationIntroduction
	| ImplicationElimination
	| BiImplicationIntroduction
	| BiImplicationElimination
	//
	| NegationIntroduction
	| IndirectProof
	| NegationElimination
	| Explosion
	//
	| Reiteration
	| DisjunctiveSyllogism
	| ModusTollens
	| DoubleNegationElimination
	| ExcludedMiddle
	| DeMorgan;

export interface ProofLine {
	subproofIndex: number[];
	sentence: Sentence;
	reason: Reason;
}

export type Proof = ProofLine[];
