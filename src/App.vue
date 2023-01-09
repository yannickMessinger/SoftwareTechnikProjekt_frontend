<script setup lang="ts"></script>

<template>
    <router-view />
</template>

<style>
    :root {
        --woe-blue-10: #f2f7fe;
        --woe-blue-20: #e3eeff;
        --woe-blue-30: #64a2ff;
        --woe-blue-50: #0b8aff;
        --woe-blue-60: #005ff8;
        --woe-blue-70: #004ac2;
        --woe-blue-80: #07224c;
        --woe-blue-90: #081b39;
        --woe-black: #0a0a09;
        --woe-gray-100: #141414;
        --woe-gray-95: #1a1a1a;
        --woe-gray-90: #262626;
        --woe-gray-80: #383838;
        --woe-gray-70: #707070;
        --woe-gray-60: #9f9f9f;
        --woe-gray-50: #b8b8b8;
        --woe-gray-40: #ccc;
        --woe-gray-30: #e8e8e8;
        --woe-gray-20: #f0f0f0;
        --woe-gray-10: #f6f6f6;
        --woe-gray-05: #fafafa;
        --woe-white: #fff;
        --woe-white-almost: #f0f0f0;
        --woe-green-10: #edf6f1;
        --woe-green-20: #dceee3;
        --woe-green-30: #63ffa1;
        --woe-green-50: #00d36e;
        --woe-green-60: #04ac51;
        --woe-green-70: #048c41;
        --woe-green-80: #09381f;
        --woe-green-90: #0b2918;
        --woe-red-10: #fef2f2;
        --woe-red-20: #fde6e6;
        --woe-red-30: #ff5e5e;
        --woe-red-50: #f52626;
        --woe-red-60: #eb0000;
        --woe-red-70: #bc0202;
        --woe-red-80: #400807;
        --woe-red-90: #2e0808;
        --woe-yellow-10: #fffadd;
        --woe-yellow-20: #ffefb7;
        --woe-yellow-30: #ffed72;
        --woe-yellow-50: #ffdf00;
        --woe-yellow-60: #fc0;
        --woe-yellow-70: rgb(235, 188, 2);
        --woe-yellow-80: #4f340d;
        --woe-yellow-90: #2f1a07;
        --woe-orange-10: #fef7f2;
        --woe-orange-20: #fce0cc;
        --woe-orange-30: #ffb47d;
        --woe-orange-50: #ff8831;
        --woe-orange-60: #f06500;
        --woe-orange-70: #dd5d01;
        --woe-orange-80: #802800;
        --woe-orange-90: #461600;
        --woe-violet-10: #f5f2ff;
        --woe-violet-20: #d9ccfe;
        --woe-violet-30: #946fff;
        --woe-violet-50: #6f00fa;
        --woe-violet-60: #4500a4;
        --woe-violet-80: #29005a;
        --woe-violet-90: #1a0033;

        --btn-primary: var(--woe-green-60);
        --btn-primary-hover: var(--woe-green-70);
        --btn-secondary: var(--woe-blue-60);
        --btn-secondary-hover: var(--woe-blue-70);
        --btn-tertiary: var(--woe-gray-60);
        --btn-teriary-hover: var(--woe-gray-70);
        --btn-cancle: var(--woe-red-60);
        --btn-cancle-hover: var(--woe-red-70);

        font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;

        color-scheme: light dark;
        color: var(--woe-black);
        background-color: #242424;

        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
    }

    * {
        margin: 0;
    }

    .prim.btn.green {
        background-color: var(--btn-primary);
        color: var(--woe-white);
    }

    .prim.btn.green:hover {
        background: var(--btn-primary-hover);
    }

    .sec.btn.blue {
        background-color: var(--btn-secondary);
        color: var(--woe-white);
    }

    .sec.btn.blue:hover {
        background: var(--btn-secondary-hover);
    }

    .ter.btn.grey {
        background-color: var(--btn-tertiary);
        color: var(--woe-white);
    }

    .ter.btn.grey:hover {
        background: var(--btn-teriary-hover);
    }

    .cncl.btn.red {
        background-color: var(--btn-cancle);
        color: var(--woe-white);
    }

    .cncl.btn.red:hover {
        background: var(--btn-cancle-hover);
    }

    #editor-tool {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 6em;
        height: 6em;
        border: 1px solid var(--woe-black);
    }

    .editor-tool-not-active {
        background-color: transparent;
    }

    .editor-tool-active {
        background-color: var(--woe-orange-30);
    }

    .editor-tool-btn {
        background-size: cover;
        background-position: center;
        width: 4em;
        height: 4em;
        border: none;
        background-color: transparent;
    }

    body {
        margin: 0;
        min-width: 320px;
        min-height: 100vh;
        background: var(--woe-white);
        color: var(--woe-black);
    }

    h2 {
        margin-top: 0.83em;
        margin-bottom: 0.83em;
    }

  input:focus {
    outline: none;
    box-shadow: 0 0 2px var(--woe-blue-60);
  }
    @media (prefers-color-scheme: light) {
        :root {
            color: #213547;
            background-color: var(--woe-white-almost);
        }
        a:hover {
            color: #747bff;
        }
        button {
            background-color: var(--woe-white-almost);
        }

        input {
            background-color: var(--woe-white-almost);
            color: var(--woe-black);
        }
    }

    @media (prefers-color-scheme: dark) {
        :root {
            color: #213547;
            background-color: var(--woe-white-almost);
        }
        a:hover {
            color: #747bff;
        }
        button {
            background-color: var(--woe-white-almost);
        }

        input {
            background-color: var(--woe-white-almost);
            color: var(--woe-black);
        }

        select {
            background-color: var(--woe-white-almost);
            color: var(--woe-black);
        }
    }
</style>
