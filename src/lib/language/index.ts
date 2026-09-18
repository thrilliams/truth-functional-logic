import {
	indentService,
	indentUnit,
	LanguageSupport,
	LRLanguage,
} from "@codemirror/language";
import { keymap, placeholder } from "@codemirror/view";
import { parser } from "./logic";
import { indentWithTab } from "@codemirror/commands";

const logicLanguage = LRLanguage.define({
	name: "logic",
	parser,
	languageData: {
		closeBrackets: { brackets: ["(", "["] },
	},
});

export const logic = new LanguageSupport(logicLanguage, [
	indentService.of(() => null),
	placeholder("awaiting input..."),
	keymap.of([indentWithTab]),
	indentUnit.of(" "),
]);
