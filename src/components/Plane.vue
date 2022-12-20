<template>
    <Plane :width="2000" :height="2000" :rotation="{x: -Math.PI /2}" receive-shadow>
        <PhongMaterial color="#999999" :props="{ depthWrite: false }" />
    </Plane>
</template>

<script setup lang="ts">
    import {Plane,PhongMaterial} from 'troisjs'
</script>