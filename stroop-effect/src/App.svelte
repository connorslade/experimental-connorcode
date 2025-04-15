<script lang="ts">
    import { random } from "./colors";
    import { mean } from "./stats";
    import { writable, type Writable } from "svelte/store";

    let random_colors = true;
    let desired_trials = 15;

    let active = false;
    let current = random();
    let history: Writable<number[]> = writable([]);
    let timestamp = 0;

    function reset() {
        history.set([]);
        active = false;
        timestamp = 0;
    }

    function on_click() {
        if ($history.length < desired_trials || desired_trials == 0) {
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
            active = true;
        }
    }

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            on_click();
            e.preventDefault();
        } else if (e.code === "KeyR") reset();
    });

    document.addEventListener("touchstart", (e) => {
        if (
            !(e.target instanceof HTMLInputElement) &&
            !(e.target instanceof HTMLButtonElement)
        )
            on_click();
    });
</script>

<main>
    <div class="container">
        {#if !active && desired_trials != 0}
            <div class="center-text">
                <h1>Tap to Start</h1>
                <p>
                    You will be doing <input
                        type="number"
                        bind:value={desired_trials}
                        style:width="3em"
                        min="0"
                    />
                    trials
                    <button
                        class="toggle"
                        on:click={() => {
                            random_colors = !random_colors;
                        }}>{random_colors ? "with" : "without"}</button
                    > randomized colors. Tap after you correctly read each word.
                </p>
            </div>
        {:else if $history.length < desired_trials || desired_trials == 0}
            <div class="running no-select">
                <p>
                    {$history.length}/{desired_trials} ({Math.round(
                        mean($history) ?? 0,
                    )}ms)
                </p>
                <p
                    style:color={random_colors ? current.color : "black"}
                    class="name"
                >
                    {current.name}
                </p>
            </div>
        {:else}
            <div class="center-text">
                <h1>Finished!</h1>
                <p>
                    You averaged a delay of {Math.round(mean($history) ?? 0)}ms
                    over {$history.length} trials.
                    <button on:click={reset}>Restart</button>
                    and try again {random_colors ? "with" : "without"} randomized
                    colors.
                </p>
            </div>
        {/if}
    </div>

    <div class="footer">
        <div><button on:click={reset}>⟳ Reset</button></div>
        <p>By Connor Slade</p>
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

    .running {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .running > p {
        margin: 0;
    }

    .name {
        font-size: 20vw;
        font-family: sans-serif;
        margin: 0;
    }

    .footer {
        display: flex;
        justify-content: space-evenly;
        position: absolute;
        width: 100vw;
        bottom: 0;
    }

    button {
        color: blue;
        text-decoration: underline dotted;
        border: none;
        background: inherit;
        cursor: pointer;
        padding: 0;
        font-size: 16px;
    }

    .footer > div > * {
        display: inline;
    }

    .footer > p {
        margin: 0;
    }

    .center-text {
        text-align: center;
    }

    .no-select {
        user-select: none;
    }
</style>
