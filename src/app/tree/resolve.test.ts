import { ExtensionKind, createExtension, idGenerator} from "@catcode/core-plugin";

import { resolveTree } from "./resolve";



describe('Test resolveTree', () => {
    it('should resolve extensions into a deeply nested tree structure', () => {
        const extensions = [
            createExtension({
                namespace: 'test',
                name: 'root',
                kind: ExtensionKind.Component,
                provider: () => {},
                attachToo: {namespace: 'dummy', name: 'dummy', kind: ExtensionKind.Component, input: 'test'}, // Root node
            }),
            createExtension({
                namespace: 'test',
                name: 'child1',
                kind: ExtensionKind.Component,
                provider: () => {},
                attachToo: { namespace: 'test', name: 'root', kind: ExtensionKind.Component, input: 'yes' },
            }),
            createExtension({
                namespace: 'test',
                name: 'child2',
                kind: ExtensionKind.Component,
                provider: () => {},
                attachToo: { namespace: 'test', name: 'root', kind: ExtensionKind.Component, input: 'yes' },
            }),
            createExtension({
                namespace: 'test',
                name: 'grandchild1',
                kind: ExtensionKind.Component,
                provider: () => {},
                attachToo: { namespace: 'test', name: 'child1', kind: ExtensionKind.Component, input: 'yes' },
            }),
            createExtension({
                namespace: 'test',
                name: 'grandchild2',
                kind: ExtensionKind.Component,
                provider: () => {},
                attachToo: { namespace: 'test', name: 'child2', kind: ExtensionKind.Component, input: 'no' },
            }),
            createExtension({
                namespace: 'test',
                name: 'greatgrandchild1',
                kind: ExtensionKind.Component,
                provider: () => {},
                attachToo: { namespace: 'test', name: 'grandchild1', kind: ExtensionKind.Component, input: 'no' },
            }),
        ];

        const tree = resolveTree(extensions);

        // Define the expected tree structure
        const expectedTree = [
            {
                id: idGenerator('dummy', 'dummy', ExtensionKind.Component.toString()),
                children: [
                    {
                        id: idGenerator('test', 'root', ExtensionKind.Component.toString()),
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
            },
        ];

        // Assert that the tree matches the expected structure
        expect(tree).toEqual(expectedTree);
    });
});
