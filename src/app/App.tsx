import React from 'react';
import { Plugin, Extension } from "@catcode/core-plugin";
import { resolveTree } from './tree';


class App {

    plugins: Plugin[]
    rootExtensions: Extension[]
    config: object
    
    constructor(
        plugins: Plugin[],
        config: object, 
        rootExtensions: Extension[],
    ){
        this.plugins = plugins;
        this.config = config;
        this.rootExtensions = rootExtensions;

    }

    createRoot(){

        const extensions = [
            ...this.rootExtensions,
            ...this.plugins.flatMap(plugin => plugin.extensions)
        ]

        const tree = resolveTree(extensions);


        return <div>test</div>
    }

}


export {
    App
}