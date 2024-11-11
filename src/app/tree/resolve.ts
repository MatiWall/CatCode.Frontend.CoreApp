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

function findTreeRoot(flatMap: {[parentId: string]: string[]}){
    /** Find the upper most items */
    const keys = Object.keys(flatMap);
    const values = Object.values(flatMap); 

    const children = new Set()

    values.forEach(value => {
        value.forEach(v => children.add(v))
    });
    

    return keys.filter(key => !children.has(key))
}

function buildTree(flatMap: {[parentId: string]: string[]}){

    const roots = findTreeRoot(flatMap);

    function buildNode(parentId: string):{parentId: string, children: object} {
        
        const children = flatMap[parentId] || [];

        return {parentId: parentId, children: children.map(key => buildNode(key))}

    }

    return roots.map(key => buildNode(key))

}

function resolveTree(extensions: Extension[]){

    const flatMap = buildFlatMap(extensions);

    const tree = buildTree(flatMap);

    return tree
}


export {
    resolveTree
}