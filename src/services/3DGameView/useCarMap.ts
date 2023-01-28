export function useCarMap() {
    return loadSceneChildrenWithKey
}

function loadSceneChildrenWithKey(sceneObjChildren: any[], playerList: any[]) {
    let scenechildmap = new Map()
    playerList.forEach((player) => {
        sceneObjChildren.forEach((ele) => {
            if (ele.name === 21) {
                if (!scenechildmap.get(player)) {
                    scenechildmap.set(player, ele)
                }
            }
        })
    })
}
