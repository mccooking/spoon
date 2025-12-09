<script lang="ts">
	import { onMount } from "svelte";
	import { BlockNoteEditor } from "@blocknote/core";

	let editor: null | BlockNoteEditor = null;
	let editorElement: HTMLDivElement | null = null;

	onMount(() => {
		editor = BlockNoteEditor.create();

		if (editorElement) {
			editor.mount(editorElement);
		}
	});
</script>

{#if editor}
	<!-- Plugins -->
{/if}

<div class="outline-none min-h-screen px-16 py-8" bind:this={editorElement}></div>
