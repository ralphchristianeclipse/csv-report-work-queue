<svelte:options immutable />
<div in:receive={{key}} out:send={{key}} class="card text-white" on:click class:bg-secondary={pending} class:bg-warning={business}
 class:bg-success={completed} class:bg-danger={system}>
	<div class="card-header"> {item.keyValue}</div>
	<div class="card-body">
		<h5> {items.length} {onlyOne ? 'Attempt' : 'Attempts'} </h5>
	</div>
</div>

<script>
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  export let key;
  export let items;
  export let type;
  export let item;
  let { pending, completed, system, business } = type;
  $: onlyOne = items.length === 1;

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: t => `
                transform: ${transform} scale(${t});
                opacity: ${t}
              `
      };
    }
  });
</script>

<style>
  .card {
    cursor: pointer;
    transition: 0.3s ease-in-out;
  }
  .card:hover {
    box-shadow: 2px 2px 10px #ccc9;
  }
</style>