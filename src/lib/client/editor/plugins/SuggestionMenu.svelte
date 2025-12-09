<script lang="ts">
	import { onMount } from "svelte";
	import type { BlockNoteEditor } from "@blocknote/core";

	export let editor: BlockNoteEditor<any, any, any>;

	onMount(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "/" && editor) {
				event.preventDefault();

				editor.insertInlineContent([
					{
						type: "slashCommand",
						props: { text: "/" }
					}
				]);
			}
		};

		const editorElement = (editor as any)._tiptapEditor.view.dom;
		editorElement.addEventListener("keydown", handleKeyDown);

		return () => {
			editorElement.removeEventListener("keydown", handleKeyDown);
		};
	});
</script>
