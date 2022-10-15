<script lang="ts">
  import { onMount } from "svelte";
  import { Block } from "./lib/blocks";
  let w = 120;
  let h = 50;
  $: map = Block.init({ w, h });

  let unit = 10;

  let duration = 200;

  onMount(() => {
    setInterval(() => {
      const interval = setInterval(() => {
        map = Block.iter({ w, h }, map);
      }, duration);

      return () => {
        clearInterval(interval);
      };
    }, 2000);
  });
</script>

<main>
  {#each map as blocks}
    {#each blocks as block}
      <div
        class="block"
        style:background-color={block.color ? "white" : "black"}
        style:width="{unit}px"
        style:height="{unit}px"
        style:left="{block.x * (unit + 2)}px"
        style:top="{block.y * (unit + 2)}px"
      />
    {/each}
  {/each}
</main>

<style>
  main {
    position: relative;
    /* align-self: center; */
    width: 100%;
    height: 100%;
  }
</style>
