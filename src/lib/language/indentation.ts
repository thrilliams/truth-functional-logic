import { ContextTracker, ExternalTokenizer } from "@lezer/lr";
import { dedent, indent } from "./logic.terms";

interface IndentLevel {
	parent?: IndentLevel;
	depth: number;
}

const hash = ({ parent, depth }: IndentLevel): number =>
	(parent ? (hash(parent) + hash(parent)) << 8 : 0) + depth + (depth << 4);

export const trackIndentation = new ContextTracker<IndentLevel>({
	start: { depth: 0 },
	shift(context, term, stack, input) {
		if (term === dedent) return context.parent!;
		if (term === indent)
			return {
				depth: stack.pos - input.pos,
				parent: context,
			};
		return context;
	},
	hash,
});

const NEWLINE = 10,
	SPACE = 32;
export const indentation = new ExternalTokenizer((input, stack) => {
	const prev = input.peek(-1);
	if (prev !== -1 && prev !== NEWLINE) return;

	let spaces = 0;
	while (input.next === SPACE) {
		input.advance();
		spaces++;
	}

	if (spaces > stack.context.depth) {
		input.acceptToken(indent);
	} else if (spaces < stack.context.depth) {
		input.acceptToken(dedent, -spaces);
	}
});
