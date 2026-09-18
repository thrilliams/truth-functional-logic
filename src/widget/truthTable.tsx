import { MountableElement, render } from "solid-js/web";
import { InteractiveTruthTable } from "../lib/truthTable/InteractiveTruthTable";

export const truthTable = (element: MountableElement) =>
	render(() => <InteractiveTruthTable initial="(A | B) <> C" />, element);
