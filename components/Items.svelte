<svelte:options immutable />
{#each items as [key, { items: row, type, item }] (key)}
<div on:click={()=> selected = row} animate:flip={{duration}} in:receive={{key}} out:send={{key}} class="card
	text-white"
	class:bg-secondary={type.pending}
	class:bg-warning={type.business} class:bg-success={type.completed} class:bg-danger={type.system}>
	<div class="card-header"> {item.keyValue}</div>
	<div class="card-body">
		<h5> {row.length} {row.length === 1 ? 'Attempt' : 'Attempts'} </h5>
	</div>
</div>
{/each}


<script>
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";
  export let items;
  export let selected;
  let duration = 600;
  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration,
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