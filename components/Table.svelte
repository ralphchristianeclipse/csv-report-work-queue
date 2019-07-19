<svelte:options immutable />
<div class="table-responsive" on:click>
	<table class="table table-dark table-bordered">
		<thead>
			<tr>
				{#each headers as header}
				<th scope="col"> {header} </th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rows as row}
			<Row {row} />
			{/each}
		</tbody>
	</table>
</div>

<script>
  import Row from "./Row.svelte";
  export let headers = [];
  export let rows = [];
</script>