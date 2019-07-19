<svelte:options immutable />
<div class="alert {alert}" transition:fade role="alert">
	{message}
</div>
<script>
  import { fade } from "svelte/transition";
  export let message = "";
  export let type = "success";
  $: alert = type ? `bg-${type}` : "bg-secondary";
</script>

