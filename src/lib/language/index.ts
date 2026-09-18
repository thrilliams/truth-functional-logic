import {
	indentService,
	LanguageSupport,
	LRLanguage,
} from "@codemirror/language";
import { placeholder } from "@codemirror/view";
import { parser } from "./logic";

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
]);
