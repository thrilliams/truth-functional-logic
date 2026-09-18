import { MountableElement, render } from "solid-js/web";
import { InteractiveProofValidator } from "../lib/proofValidator/InteractiveProofValidator";

export const proofValidator = (element: MountableElement) =>
	render(
		() => (
			<InteractiveProofValidator
				initial={`~(A | B) :PR
 A :AS
 A | B :|I2
 !? :~E1,3
~A :~I2-4
 B :AS
 A | B :|I6
 !? :~E1,7
~B :~I6-8
~A & ~B :&I5,9`}
			/>
		),
		element,
	);
