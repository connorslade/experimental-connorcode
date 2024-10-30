<script lang="ts">
  import { random } from "./colors";

  let random_colors = true;

  let current = random();
  let timestamp = new Date();

  document.addEventListener("keydown", (e) => {
    if (e.code !== "Space") return;

    let now = new Date();
    let delta = now.getTime() - timestamp.getTime();
    timestamp = now;

    let last_name = current.name;
    while (current.name === last_name) current = random();
    e.preventDefault();
  });
</script>

<main>
  <div class="container">
    <p style:color={random_colors ? current.color : "black"} class="name">
      {current.name}
    </p>
  </div>

  <input type="checkbox" id="a" bind:checked={random_colors} />
  <label for="a">Random Colors</label>
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
</style>
