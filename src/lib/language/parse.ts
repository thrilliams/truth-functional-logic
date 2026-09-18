import { parser } from "./logic";

export const parseProof = (input: string) => parser.parse(input.toLowerCase());
export const parseSentence = (input: string) =>
	parser.configure({ top: "Proposition" }).parse(input.toLowerCase());
