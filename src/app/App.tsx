import React from 'react';
import { Plugin } from "@catcode/core-plugin";


class App {

    plugins: Plugin[]
    config: object
    
    constructor(
        plugins: Plugin[],
        config: object
    ){
        this.plugins = plugins;
        this.config = config;

    }

    createRoot(){
        return <div>test</div>
    }

}


export {
    App
}