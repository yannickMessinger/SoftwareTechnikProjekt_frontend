<template>
    <div class="headline">
        <h2>Aktive Lobby</h2>
    </div>
    <div class="container">
        <div class="LobbyName">
            <p><b>Rüdigers Lobby</b></p>
        </div>
        <div class="LobbyClose">
            <button class="red">Lobby Schließen</button>
        </div>
        <div class="PlayMode">
            <p><b>Modus:</b> Fahrmodus</p>
        </div>
        <div class="SwitchMode">
            <button>Planungs-Modus</button>
        </div>
        <div class="Button1">
            <button>Weitermachen</button>
        </div>
        <div class="Button2">
            <button class="green">Fahren</button>
        </div>
        <div class="Button3">
            <button class="grey">Lobby verlassen</button>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
    * {
        font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto,
            "Helvetica Neue", sans-serif;
        line-height: 20px;
    }
    .headline {
        display: flex;
        margin-top: 10px;
        margin-left: 30px;
        margin-bottom: 10px;
    }

    .container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 0.5fr 1fr 1fr;
        gap: 0px 0px;
        grid-template-areas:
            "LobbyName LobbyName LobbyClose"
            "PlayMode PlayMode SwitchMode"
            "Button1 Button2 Button3";
        width: 90%;

        font-weight: 500;
        font-size: 16px;
        height: 300px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
    }

    .Button1 {
        grid-area: Button1;
        justify-self: start;
        align-self: end;
    }
    .Button2 {
        grid-area: Button2;
        justify-self: center;
        align-self: end;
    }
    .Button3 {
        grid-area: Button3;
        justify-self: end;
        align-self: end;
    }
    .LobbyName {
        grid-area: LobbyName;
    }
    .LobbyClose {
        grid-area: LobbyClose;
        justify-self: end;
    }
    .PlayMode {
        grid-area: PlayMode;
        align-self: start;
    }
    .SwitchMode {
        grid-area: SwitchMode;
        justify-self: end;
    }

    button {
        font-size: 16px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        padding: 13px 23px;
        background-color: var(--woe-blue-60);
        color: white;
    }

    button:hover {
        background-color: var(--woe-blue-70);
    }

    .red {
        background: var(--woe-red-60);
    }

    .red:hover {
        background-color: var(--woe-red-70);
    }

    .grey {
        background-color: var(--woe-gray-50);
    }

    .grey:hover {
        background-color: var(--woe-gray-60);
    }

    .green {
        background-color: var(--woe-green-60);
    }

    .green:hover {
        background-color: var(--woe-green-70);
    }
</style>
