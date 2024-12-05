import { ExtensionKind, createExtension, idGenerator, Extension, ExtensionDataValue, createExtensionDataRef} from "@catcode/core-plugin";
import {
    buildFlatMap, 
    buildTree, 
    buildExtensionTree,
    resolveTree
} from "./resolve";
import { TreeNode } from "./types";


describe('Test resolveTree', () => {
    it('should resolve extensions into a deeply nested tree structure', () => {
        const extensions = [
            createExtension({
                namespace: 'root',
                name: 'app',
                kind: ExtensionKind.Component,
                provider: jest.fn(),
                attachToo: {namespace: 'dummy', name: 'dummy', kind: ExtensionKind.Component}, // Root node
            }),
            createExtension({
                namespace: 'test',
                name: 'child1',
                kind: ExtensionKind.Component,
                provider: jest.fn(),
                attachToo: { namespace: 'root', name: 'app', kind: ExtensionKind.Component},
            }),
            createExtension({
                namespace: 'test',
                name: 'child2',
                kind: ExtensionKind.Component,
                provider: jest.fn(),
                attachToo: { namespace: 'root', name: 'app', kind: ExtensionKind.Component},
            }),
            createExtension({
                namespace: 'test',
                name: 'grandchild1',
                kind: ExtensionKind.Component,
                provider: jest.fn(),
                attachToo: { namespace: 'test', name: 'child1', kind: ExtensionKind.Component},
            }),
            createExtension({
                namespace: 'test',
                name: 'grandchild2',
                kind: ExtensionKind.Component,
                provider: jest.fn(),
                attachToo: { namespace: 'test', name: 'child2', kind: ExtensionKind.Component},
            }),
            createExtension({
                namespace: 'test',
                name: 'greatgrandchild1',
                kind: ExtensionKind.Component,
                provider: jest.fn(),
                attachToo: { namespace: 'test', name: 'grandchild1', kind: ExtensionKind.Component },
            }),
        ];

        const flatMap = buildFlatMap(extensions);

        const tree = buildTree(flatMap);

        // Define the expected tree structure
        const expectedTree ={
                id: idGenerator('dummy', 'dummy', ExtensionKind.Component.toString()),
                children: [
                    {
                        id: idGenerator('root', 'app', ExtensionKind.Component.toString()),
                        children: [
                            {
                                id: idGenerator('test', 'child1', ExtensionKind.Component.toString()),
                                children: [
                                    {
                                        id: idGenerator('test', 'grandchild1', ExtensionKind.Component.toString()),
                                        children: [
                                            {
                                                id: idGenerator('test', 'greatgrandchild1', ExtensionKind.Component.toString()),
                                                children: [
                                                    
                                                ],
                                            }
                                        ],
                                    }
                                ],
                            },
                            {
                                id: idGenerator('test', 'child2', ExtensionKind.Component.toString()),
                                children: [
                                    {
                                        id: idGenerator('test', 'grandchild2', ExtensionKind.Component.toString()),
                                        children: [],
                                    }
                                ],
                            }
                        ],
                    },
                ],
            };

        // Assert that the tree matches the expected structure
        expect(tree).toEqual(expectedTree);
    });
});


describe('Test buildExtensionTree', ()=>{
      
      test("builds the correct extension tree structure", () => {
        const rootNamespace = 'root';
        const rootName = 'app';
        const rootComponent = ExtensionKind.Component;


        const extensions: Extension[] = [
          createExtension({
            namespace: rootNamespace,
            name: rootName, 
            kind: rootComponent,
            attachToo: {namespace: 'ignored', name: 'ignored', kind: ExtensionKind.Component},
            provider: jest.fn()
          }),
          createExtension({
            namespace: 'app',
            name: 'child1', 
            kind: ExtensionKind.Component,
            attachToo: {namespace: 'root', name: 'app', kind: ExtensionKind.Component},
            provider: jest.fn()
          }),
          createExtension({
            namespace: 'app',
            name: 'child2', 
            kind: ExtensionKind.Component,
            attachToo: {namespace: 'root', name: 'app', kind: ExtensionKind.Component},
            provider: jest.fn()
          }),
          createExtension({
            namespace: 'child1',
            name: 'grandchild1', 
            kind: ExtensionKind.Component,
            attachToo: {namespace: 'app', name: 'child1', kind: ExtensionKind.Component},
            provider: jest.fn()
          })
        ];
        
        const rootExtension = buildExtensionTree(extensions) as Extension;
    
        expect(rootExtension.id).toBe(idGenerator(rootNamespace, rootName, rootComponent));
        expect(rootExtension.children).toHaveLength(2);
        expect(rootExtension.children[0].id).toBe("Component:app/child1");
        expect(rootExtension.children[1].id).toBe("Component:app/child2");
        expect(rootExtension.children[0].children).toHaveLength(1);
        expect(rootExtension.children[0].children[0].id).toBe("Component:child1/grandchild1");
      });

})
