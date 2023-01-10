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
    import { defineComponent, onMounted, ref } from "vue"
    import { CollisionService } from "../../services/3D/CollisionService"
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
            const car = ref()
            const box = ref()
            const camera = ref()
            const markt = ref()
            const scene = ref()
            const collisionService = new CollisionService(car, box, markt)
            const movement = new MovmentInputController(car, camera)
            onMounted(() => {
                renderer.value.onBeforeRender(() => {
                    movement.update()
                })
                setInterval(() => {
                    collisionService.updateCarBoundingBox(car)
                    console.log(
                        "collision check:",
                        collisionService.checkCollision(scene)
                    )
                }, 2000)
            })
            return {
                renderer,
                camera,
                scene,
                car,
                box,
                movement,
                collisionService,
                markt,
            }
        },
    })
</script>

<template>
    <Renderer resize="window" ref="renderer">
        <Camera
            ref="camera"
            :position="{ x: 0, y: 0, z: 0 }"
            :look-at="{ x: 0, y: 0, z: -1 }"
        >
        </Camera>
        <Scene ref="scene" background="#4DBA87">
            <PointLight :position="{ y: 50, z: 50 }" />
            <Box ref="car" :position="{ x: 0, y: 0, z: -5 }">
                <LambertMaterial />
            </Box>
            <Box ref="box" :position="{ x: 0, y: 0, z: -10 }">
                <LambertMaterial />
            </Box>
            <GltfModel
                ref="markt"
                src="/../../../src/assets/3D_Models/Building/Markt.gltf"
            />
        </Scene>
    </Renderer>
</template>
