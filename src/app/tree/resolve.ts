import { Extension, ExtensionKind, idGenerator } from "@catcode/core-plugin";
import { TreeNode } from "./types";
import { resolvePlugin } from "@babel/core";

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


function buildTree(flatMap: {[parentId: string]: string[]}): TreeNode{

    const rootNamespace = 'root';
    const rootName = 'app';
    const rootKind = ExtensionKind.Component;
    
    const rootId = idGenerator(rootNamespace, rootName, rootKind);

    function buildNode(id: string): TreeNode {
        
        const children = flatMap[id] || [];

        return {id: id, children: children.map(key => buildNode(key))}

    }

    const rootNode = buildNode(rootId);

    return rootNode;
}


function resolveTree(extensions: Extension[]): TreeNode{

    const flatMap = buildFlatMap(extensions);

    const tree = buildTree(flatMap);

    return tree
}


function buildExtensionTree(extensions: Extension[]){

    const tree: TreeNode = resolveTree(extensions);
    const extensionMap = buildExtensionMap(extensions);;
    
    const rootExtension = extensionMap[tree.id]
    if (rootExtension === undefined){ 
        throw new Error('No root extension found in extension map.')
    }

    // Recursive function to add child extensions
    function addExtensions(extension: Extension, node: TreeNode) {
        const children = node.children;
        children.forEach((childNode: TreeNode) => {
            const childExtension = extensionMap[childNode.id];
            extension.addChild(childExtension); // Add child to parent
            addExtensions(childExtension, childNode); // Recurse for further children
        });
    }

    // Build the full extension tree
    addExtensions(rootExtension, tree);

    return rootExtension
}

export {
    resolveTree,
    buildFlatMap,
    buildTree,
    buildExtensionMap,
    buildExtensionTree
}