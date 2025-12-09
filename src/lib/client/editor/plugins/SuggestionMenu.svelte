<script lang="ts">
	import { onMount } from "svelte";
	import type { BlockNoteEditor } from "@blocknote/core";
	import {
		BlockNoteSchema,
		defaultInlineContentSpecs,
		createInlineContentSpec
	} from "@blocknote/core";

	export let editor: BlockNoteEditor<any, any, any>;

	const slashCommandSpec = createInlineContentSpec(
		{
			type: "slashCommand" as const,
			propSchema: {
				text: {
					default: "/"
				}
			},
			content: "styled"
		},
		{
			render: (inlineContent) => {
				const span = document.createElement("span");
				span.className =
					"slash-command bg-bg-secondary px-1.5 py-1 rounded-sm border border-border";
				span.setAttribute("contenteditable", "true");
				span.textContent = inlineContent.props.text;

				return {
					dom: span,
					contentDOM: span
				};
			}
		}
	);

	const schema = BlockNoteSchema.create({
		inlineContentSpecs: {
			...defaultInlineContentSpecs,
			slashCommand: slashCommandSpec
		}
	});

	onMount(() => {
		(editor as any)._tiptapEditor.schema = schema;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "/" && editor) {
				event.preventDefault();

				editor.insertInlineContent([
					{
						type: "slashCommand",
						props: {
							text: "/"
						}
					}
				]);

				return true;
			}
		};

		const editorElement = (editor as any)._tiptapEditor.view.dom;
		editorElement.addEventListener("keydown", handleKeyDown);

		return () => {
			editorElement.removeEventListener("keydown", handleKeyDown);
		};
	});
</script>
