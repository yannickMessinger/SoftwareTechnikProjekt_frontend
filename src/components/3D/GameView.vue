<script lang="ts">
    import {
        PointLight,
        Box,
        Camera,
        Renderer,
        Scene,
        LambertMaterial,
        GltfModel,
    } from "troisjs"
    import {
        defineComponent,
        onBeforeMount,
        onBeforeUnmount,
        onMounted,
        ref,
    } from "vue"
    import { FirstPersonCamera } from "../../models/FirstPersonCamera"
    import { MovmentInputController } from "../../models/MovementInputController"

    export default defineComponent({
        components: {
            Box,
            Camera,
            Renderer,
            Scene,
            PointLight,
            LambertMaterial,
            GltfModel,
        },

        setup() {
            const renderer = ref()
            const box = ref()
            const camera = ref()
            //const fpsCamera = new FirstPersonCamera(camera, box)
            const moveableObject = new MovmentInputController(box, camera)

            onMounted(() => {
                renderer.value.onBeforeRender(() => {
                    moveableObject.update()
                })
            })

            return {
                renderer,
                camera,
                box,
                moveableObject,
            }
        },
    })
</script>

<template>
    <Renderer resize="window" ref="renderer">
        <Camera ref="camera" :position="{ x: 0, y: 0, z: 0 }"> </Camera>
        <Scene background="#4DBA87">
            <PointLight :position="{ y: 50, z: 50 }" />
            <GltfModel
                src="/../../../src/assets/3D_Models/Building/Haus - Hoch.gltf"
                :position="{ x: -5, y: 0, z: -15 }"
                :scale="{ x: 0.4, y: 0.4, z: 0.4 }"
            />
            <Box ref="box" :position="{ x: 0, y: 0, z: -5 }">
                <LambertMaterial />
            </Box>
        </Scene>
    </Renderer>
</template>
