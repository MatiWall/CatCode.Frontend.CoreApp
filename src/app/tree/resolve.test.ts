import { createExtension, ExtensionKind } from '@catcode/core-plugin';
import { jest } from '@jest/globals';


describe('Flat map test', ()=>{

    test('Flat map', ()=>{
        const mockExtensions = [
            createExtension({
                namespace: 'test',
                name: 'test',
                kind: ExtensionKind.Component,
                attachToo: {namespace: 'test1', name: 'test1', kind: ExtensionKind.Component, input: 'test'},
                provider: ()=>{}
            })
        ]

    })
})