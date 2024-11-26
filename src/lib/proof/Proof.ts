import { Sentence } from "../logic/Sentence";

export type ProofLineType =
	// structural rules
	| "premise"
	| "assumption"

	// atomic rules
	| "disjunction_introduction"
	| "disjunction_elimination"
	| "conjunction_introduction"
	| "conjunction_elimination"
	| "implication_introduction"
	| "implication_elimination"
	| "bi_implication_introduction"
	| "bi_implication_elimination"
	| "negation_introduction"
	| "indirect_proof"
	| "negation_elimination"
	| "explosion"

	// derived rules
	| "reiteration"
	| "disjunctive_syllogism"
	| "modus_tollens"
	| "double_negation_elimination"
	| "excluded_middle"
	| "de_morgan";

// PR
type Premise = ["premise"];
// AS
type Assumption = ["assumption"];

// |I i
type DisjunctionIntroduction = ["disjunction_introduction", number];
// |E i,j-k,l-m
type DisjunctionElimination = [
	"disjunction_elimination",
	number,
	[number, number],
	[number, number]
];
// &I i,j
type ConjunctionIntroduction = ["conjunction_introduction", number, number];
// &E i
type ConjunctionElimination = ["conjunction_elimination", number];
// >I i-j
type ImplicationIntroduction = ["implication_introduction", [number, number]];
// >E i,j
type ImplicationElimination = ["implication_elimination", number, number];
// <>I i-j,k-l
type BiImplicationIntroduction = [
	"bi_implication_introduction",
	[number, number],
	[number, number]
];
// <>E i,j
type BiImplicationElimination = ["bi_implication_elimination", number, number];

// ~I i-j
type NegationIntroduction = ["negation_introduction", [number, number]];
// IP i-j
type IndirectProof = ["indirect_proof", [number, number]];
// ~E i,j
type NegationElimination = ["negation_elimination", number, number];
// X i
type Explosion = ["explosion", number];

// R i
type Reiteration = ["reiteration", number];
// DS i,j
type DisjunctiveSyllogism = ["disjunctive_syllogism", number, number];
// MT i,j
type ModusTollens = ["modus_tollens", number, number];
// DNE i
type DoubleNegationElimination = ["double_negation_elimination", number];
// LEM i-j,k-l
type ExcludedMiddle = ["excluded_middle", [number, number], [number, number]];
// DeM i
type DeMorgan = ["de_morgan", number];

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
