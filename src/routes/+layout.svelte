<script lang="ts">
	import "./layout.css";

	let { children } = $props();
</script>

<main class="bg-bg text-text">
	{@render children()}
</main>
