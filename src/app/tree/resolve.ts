import { Extension } from "@catcode/core-plugin";


function buildExtensionMap(extensions: Extension[]):  {[id: string]: Extension}{
    

    const map: {[id: string]: Extension} = {}
    extensions.forEach((extension)=>{
        map[extension.id] = extension
    })
    
    return map;
}

function buildFlatMap(extensions: Extension[]): {[parentId: string]: string[]} {
    let idMap: {[parentId: string]: string[]} = {}
    for (const extension of extensions) {
        const id: string = extension.id;
        const parentId: string = extension.attachTooId();

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

    function buildNode(id: string):{id: string, children: object} {
        
        const children = flatMap[id] || [];

        return {id: id, children: children.map(key => buildNode(key))}

    }

    return roots.map(key => buildNode(key))

}


function resolveTree(extensions: Extension[]){

    const flatMap = buildFlatMap(extensions);

    const tree = buildTree(flatMap);
    if (Object.keys(tree).length === 0){
        throw new Error('Extension tree does not have a root')
    }
    else if (Object.keys(tree).length >1){
        throw new Error('Extension tree can not have multiple roots')
    }


    

    return tree
}

function buildExtensionTree(tree, extensions){

    const extensionMap = buildExtensionMap(extensions);

    const rootNode = Object.values(tree)[0];
    
    const rootExtension = extensionMap[rootNode.id]

    // Recursive function to add child extensions
    function addExtensions(extension: Extension, node: { id: string; children: object[] }) {
        const children = node.children;
        children.forEach((childNode: { id: string; children: object[] }) => {
            const childExtension = extensionMap[childNode.id];
            extension.addChild(childExtension); // Add child to parent
            addExtensions(childExtension, childNode); // Recurse for further children
        });
    }

    // Build the full extension tree
    addExtensions(rootExtension, rootNode);

    return rootExtension
}

export {
    resolveTree,
    buildFlatMap,
    buildTree,
    buildExtensionMap,
    buildExtensionTree
}