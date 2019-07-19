<svelte:options immutable />

<div class="notifications">
	{#each notifications as notification (notification.id)}
	<Notification {...notification} />
	{/each}
</div>
<script>
  import Notification from "./Notification.svelte";
  export let notifications = [];
  export let timeout = 5000;
  export const dequeue = () => {
    notifications.splice(-1);
    notifications = [...notifications];
  };
  export const enqueue = notification => {
    notification.id = +new Date();
    notifications = [notification, ...notifications];
    setTimeout(dequeue, timeout);
  };
</script>

<style>
  .notifications {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    padding: 30px;
  }
</style>
