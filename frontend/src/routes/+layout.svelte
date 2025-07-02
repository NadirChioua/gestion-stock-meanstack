<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

{#if $page.url.pathname !== '/login'}
	<Sidebar />
{/if}
<main class={$page.url.pathname !== '/login' ? 'with-sidebar' : ''}>
	<slot />
</main>

<style>
	main.with-sidebar {
		margin-left: 220px;
		padding: 2rem;
		min-height: 100vh;
		background: #f4f6fa;
	}
	main {
		min-height: 100vh;
		padding: 2rem;
		background: #f4f6fa;
	}
	@media (max-width: 800px) {
		main.with-sidebar {
			margin-left: 60px;
			padding: 1rem;
		}
		main {
			padding: 1rem;
		}
	}
</style>
