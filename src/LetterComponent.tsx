import { Letter } from "./lib/logic/Sentence";

interface LetterComponentProps {
	letter: Letter;
}

export function LetterComponent({ letter }: LetterComponentProps) {
	return (
		<>
			{letter[0]}
			{letter[1] !== undefined && <sub>{letter[1]}</sub>}
		</>
	);
}
