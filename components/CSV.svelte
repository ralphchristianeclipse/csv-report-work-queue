<svelte:options immutable />
<svelte:head>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
	 crossorigin="anonymous">
</svelte:head>

{#if !loading && !rows.length}
<FileInput bind:files bind:dropping loaded={rows.length} />
{/if}

{#if loading}
<h1> Loading... </h1>
{:else if rows.length}
<div style="padding: 20px">
	<button class="btn btn-info btn-block" style="margin-bottom: 10px;" on:click={reset}> Reset </button>
	<p> Files Loaded: {fileNames.length}
		{#if showFilesLoaded}
		<button class="btn btn-warning" on:click={()=> showFilesLoaded = false }>Hide Files Loaded</button>
		{:else}
		<button class="btn btn-info" on:click={()=> showFilesLoaded = true }>Show Files Loaded</button>
		{/if}
		<button class="btn btn-primary" on:click={copyResultTable}>Copy Table</button>
	</p>

	{#if showFilesLoaded}
	<ol>
		{#each fileNames as fileName (fileName)}
		<li> {fileName} </li>
		{/each}
	</ol>
	{/if}
	<div bind:this={elTable} class="table-responsive">
		<table class="table table-dark table-bordered">
			<thead>
				<tr>
					{#each types as type (type)}
					<th class="type {currentType === type ? typeClass[currentType] : ''}" on:click={()=> currentType = type }>{type}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>{workItems.size}</td>
					<td class="bg-secondary">{pending.length} | {getPercentage(pending)}%</td>
					<td class="bg-success">{completed.length} | {getPercentage(completed)}%</td>
					<td class="bg-warning" style="color: #000">{business.length} | {getPercentage(business)}%</td>
					<td class="bg-danger">{system.length} | {getPercentage(system)}%</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class:grid={!selected}>
		{#if selected}
		<div>
			<button class="btn btn-info btn-block mb-3" on:click={()=> selected = null}>
				Back to Results
			</button>
			<Table {headers} rows={selected} />
		</div>
		{:else}
		<Items items={workItemsType} bind:selected />
		{/if}
	</div>
</div>
{/if}
<Notifications bind:enqueue={addNotification} />
<script>
  import Table from "./Table.svelte";
  import FileInput from "./FileInput.svelte";
  import Notifications from "./Notifications.svelte";
  import Items from "./Items.svelte";
  import { toCamelCase, loadCSV, selectElementContents } from "../utils";
  import { flip } from "svelte/animate";
  let files;
  let elFileInput;
  let loading = false;
  let rows = [];
  let fileNames = [];
  let showFilesLoaded = false;
  let elTable;
  let addNotification;
  $: workItems = new Map(
    rows.map(row => {
      const { id } = row;
      const items = rows.filter(r => r.id === id);
      const [item] = items;
      const { type } = item;
      let value = {
        id,
        item,
        items,
        type
      };
      return [id, value];
    })
  );
  $: workItemsArray = [...workItems];
  $: workItemsType =
    currentType === "total"
      ? workItemsArray
      : workItemsArray.filter(([key, { type }]) => type[currentType]);
  let headers = [];
  $: if (rows.length) {
    const [first] = rows;
    headers = toCamelCase(first);
  }
  const getPercentage = array =>
    ((array.length / workItems.size) * 100).toFixed(2);
  const serialize = row => ({
    ...row,
    tags: (row.tags && row.tags.split(";")) || [],
    worktime: `${Math.floor(row.worktime / 60)} minutes ${Math.floor(
      row.worktime % 60
    )} seconds`,
    type: {
      system:
        row.exceptionReason &&
        !row.exceptionReason.toLowerCase().startsWith("business"),
      business:
        row.exceptionReason &&
        row.exceptionReason.toLowerCase().startsWith("business"),
      completed: row.completed,
      pending: !row.completed && !row.exceptionReason
    },
    attempt: +row.attempt
  });

  const loadCSVFiles = async files => {
    if (loading) return;
    try {
      loading = true;
      const results = await loadCSV(files);
      return results.filter(result => !!result.id).map(serialize);
    } finally {
      loading = false;
    }
  };
  const copyResultTable = () => {
    selectElementContents(elTable);
    document.execCommand("copy");
    // window.getSelection().removeAllRanges();
    addNotification({
      message: "Copied Table paste it to your email"
    });
  };
  const loadFilesToCSV = async () => {
    fileNames = [...files].map(({ name }) => name);
    rows = await loadCSVFiles(files);
    rows = rows.sort((a, b) => b.attempt - a.attempt);
    copyResultTable();
  };
  $: if (files && !rows.length) {
    loadFilesToCSV();
  }
  let dropping = false;
  let selected;
  const reset = () => {
    files = null;
    rows = [];
  };
  $: business = workItemsArray.filter(([_, { type }]) => type.business);
  $: system = workItemsArray.filter(([_, { type }]) => type.system);
  $: completed = workItemsArray.filter(([_, { type }]) => type.completed);
  $: pending = workItemsArray.filter(([_, { type }]) => type.pending);

  let types = ["total", "pending", "completed", "business", "system"];
  let currentType = "total";
  let typeClass = {
    total: "",
    pending: "bg-secondary",
    completed: "bg-success",
    business: "bg-warning",
    system: "bg-danger"
  };
</script>

<style>
  .grid {
    display: grid;
    grid-template: repeat(6, 1fr) / repeat(6, 1fr);
    grid-gap: 10px;
  }
  @media screen and (max-width: 1024px) {
    .grid {
      grid-template: repeat(4, 1fr) / repeat(4, 1fr);
    }
  }
  @media screen and (max-width: 640px) {
    .grid {
      grid-template: repeat(2, 1fr) / repeat(2, 1fr);
    }
  }
  @media screen and (max-width: 480px) {
    .grid {
      grid-template: 1fr / 1fr;
    }
  }

  .type {
    text-transform: capitalize;
    cursor: pointer;
  }
</style>