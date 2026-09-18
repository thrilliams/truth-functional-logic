import { Extension } from "@codemirror/state";
import { EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { Accessor, onSettled, Setter, untrack } from "solid-js";

interface CreateEditorOptions {
	input: Accessor<string>;
	setInput?: Setter<string>;
	extensions?: Extension | undefined;
}

export const createEditor = (options: CreateEditorOptions) => {
	const extensions: Extension[] = [
		ViewPlugin.fromClass(
			class {
				update(update: ViewUpdate) {
					if (update.docChanged)
						options?.setInput?.(update.state.doc.toString());
				}
			},
		),
	];

	if (options?.extensions) extensions.push(options?.extensions);

	const view = new EditorView({
		doc: untrack(options.input),
		extensions,
	});

	let ref!: HTMLElement;
	onSettled(() => {
		ref.appendChild(view.dom);
		view.focus();
	});

	return <T extends HTMLElement>(element: T) => (ref = element);
};
