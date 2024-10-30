<script lang="ts">
    import { random } from "./colors";
    import { mean } from "./stats";
    import { writable, type Writable } from "svelte/store";

    let random_colors = true;
    let desired_trials = 52;

    let active = false;
    let current = random();
    let history: Writable<number[]> = writable([]);
    let timestamp = 0;

    function reset() {
        history.set([]);
        active = false;
        timestamp = 0;
    }

    document.addEventListener("keydown", (e) => {
        if (
            e.code === "Space" &&
            ($history.length < desired_trials || desired_trials == 0)
        ) {
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
            e.preventDefault();
        } else if (e.code === "KeyR") reset();
    });
</script>

<main>
    <div class="container">
        {#if !active && desired_trials != 0}
            <div class="center-text">
                <h1>Press Space to Start</h1>
                <p>You will be doing {desired_trials} trials.</p>
            </div>
        {:else if $history.length < desired_trials || desired_trials == 0}
            <p
                style:color={random_colors ? current.color : "black"}
                class="name"
            >
                {current.name}
            </p>
        {:else}
            <div class="center-text">
                <h1>Finished!</h1>
                <p>
                    You averaged a delay of {Math.round(mean($history) ?? 0)}ms
                    over {$history.length} trials.
                </p>
            </div>
        {/if}
    </div>

    <div class="footer">
        <div>
            <input type="checkbox" bind:checked={random_colors} />
            <p>Random Colors</p>

            <p>|</p>
            <p>Mean Delay: {Math.round(mean($history) ?? 0)}ms</p>
            <p>|</p>
            <p>{$history.length}/</p>
            <input
                type="number"
                bind:value={desired_trials}
                style:width="3em"
                min="0"
            />
            <p>Trials</p>
            <p>|</p>
            <button on:click={reset}>⟳</button>
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

    .center-text {
        text-align: center;
    }
</style>
