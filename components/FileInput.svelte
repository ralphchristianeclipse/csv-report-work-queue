<svelte:options immutable />
<input type="file" bind:files hidden multiple accept=".csv" bind:this={elFileInput} />
<div class="drop-zone" class:loaded>
	<div class="margin-auto">
		<h1> CSV Report Work Queues </h1>
		<div class:dropping class="drag-and-drop" on:dragenter={()=> dropping = true} on:dragleave={() => dropping = false}
			on:dragover|preventDefault on:drop|preventDefault={drop} on:click={openFileInput}>Click or Drag and Drop CSV</div>
	</div>
</div>

<script>
  export let dropping = false;
  export let loaded = false;
  export let files;
  let elFileInput;
  const openFileInput = () => elFileInput.click();
  const drop = async ev => {
    const { dataTransfer } = ev;
    ({ files } = dataTransfer);
    dropping = false;
  };
</script>

<style>
  .drop-zone {
    height: 100vh;
    display: flex;
    text-align: center;
    transition: 0.3s ease-in-out;
  }
  .drop-zone.loaded {
    height: 20vh;
  }
  .margin-auto {
    margin: auto;
  }
  .drag-and-drop {
    border: 5px dashed;
    padding: 50px 100px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s ease-in-out;
  }
  .dropping {
    background: #222;
    color: #fff;
  }
</style>