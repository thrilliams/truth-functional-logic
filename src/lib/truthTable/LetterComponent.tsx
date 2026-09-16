import { Letter } from "../logic/Letter";

interface LetterComponentProps {
	letter: Letter;
}

export function LetterComponent(props: LetterComponentProps) {
	return (
		<>
			{props.letter[0]}
			{props.letter[1] !== undefined && <sub>{props.letter[1]}</sub>}
		</>
	);
}
