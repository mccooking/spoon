<script lang="ts">
	import { onMount } from "svelte";
	import { BlockNoteEditor } from "@blocknote/core";
	import SuggestionMenu from "./plugins/SuggestionMenu.svelte";
	import { schema } from "./schema";
	import type { TextEditor } from "./types";

	let editor: TextEditor | null = null;
	let editorElement: HTMLDivElement | null = null;

	onMount(() => {
		editor = BlockNoteEditor.create({ schema });
		editor.mount(editorElement!);
	});
</script>

{#if editor}
	<SuggestionMenu {editor} />
{/if}

<div class="outline-none min-h-screen px-16 py-8" bind:this={editorElement}></div>
