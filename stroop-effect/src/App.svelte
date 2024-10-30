<script lang="ts">
  import { random } from "./colors";
  import { mean } from "./stats";
  import { writable, type Writable } from "svelte/store";

  let random_colors = true;
  let history: Writable<number[]> = writable([]);

  let current = random();
  let timestamp = 0;

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      let now = new Date().getTime();
      let delta = now - timestamp;
      if (timestamp !== 0)
        history.update((v) => {
          v.push(delta);
          return v;
        });
      timestamp = now;

      let last_name = current.name;
      while (current.name === last_name) current = random();
      e.preventDefault();
    } else if (e.code === "KeyR") {
      history.set([]);
    }
  });
</script>

<main>
  <div class="container">
    <p style:color={random_colors ? current.color : "black"} class="name">
      {current.name}
    </p>
  </div>

  <div class="footer">
    <div>
      <input type="checkbox" id="a" bind:checked={random_colors} />
      <label for="a">Random Colors</label>

      <p>|</p>
      <p>Mean Delay: {Math.round(mean($history) ?? 0)}ms</p>
      <button
        on:click={() => {
          history.set([]);
        }}>⟳</button
      >
    </div>

    <a
      href="https://github.com/connorslade/experimental-connorcode/tree/main/stroop-effect"
      >Source Code</a
    >
  </div>
</main>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }

  .name {
    font-size: 200px;
    font-family: sans-serif;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    position: absolute;
    width: 100vw;
    bottom: 0;
  }

  .footer > div > * {
    display: inline;
  }
</style>
