import { Extension } from "@catcode/core-plugin";


function buildFlatMap(extensions: Extension[]): {[parentId: string]: string[]} {
    let idMap: {[parentId: string]: string[]} = {}
    for (const extension of extensions) {
        const id: string = extension.id;
        const parentId: string = extension.parentId();

        // Initialize array if the parentId is not yet in the map
        if (!idMap[parentId]) {
            idMap[parentId] = [];
        }

        // Add the current extension's id to the array of the parentId
        idMap[parentId].push(id);
    }

    return idMap;
}

function buildTree(flatMap: {[parentId: string]: string[]}){
    
}

function resolveTree(extensions: Extension[]){

    const flatMap = buildFlatMap(extensions);



}


export {
    resolveTree
}