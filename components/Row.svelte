<svelte:options immutable />
<tr class:bg-secondary={pending} class:bg-danger={system} style="color: {business ? 'black' : 'white'}"
 class:bg-warning={business} class:bg-success={completed}>
	{#each Object.values(row) as value}
	<td>
		{#if Array.isArray(value)}
		<ul>
			{#each value as data}
			<li>{data}</li>
			{/each}
		</ul>
		{:else if value.toString() === "[object Object]" }
		{#each Object.entries(value) as [k,v]}
		<ul>
			<li>{k}: {v}</li>
		</ul>
		{/each}
		{:else}
		{value}
		{/if}
	</td>
	{/each}
</tr>

<script>
  export let row;
  let { system, business, completed, pending } = row.type;
</script>
