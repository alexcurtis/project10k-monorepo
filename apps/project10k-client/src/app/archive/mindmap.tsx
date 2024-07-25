import React, {
    useCallback,
    useEffect
} from 'react';

import { useShallow } from 'zustand/react/shallow';

import {
    ReactFlow,
    ReactFlowProvider,
    MiniMap,
    Controls,
    Background,
    useOnSelectionChange,
    NodeToolbar,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    Node
} from '@xyflow/react';

import { InsightStore } from './types';
import { useInsightStore } from './store';
import {
    MindMapNode,
    MindMapEdge
} from './types';

import '@xyflow/react/dist/style.css';

const selector = (state: InsightStore) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    setCurrentNode: state.setCurrentNode
});


// function NodeWithToolbar({ data, isConnectable }) {
//     return (
//         <>
//             <NodeToolbar
//                 position={data.toolbarPosition}
//             >
//                 <button>cut</button>
//                 <button>copy</button>
//                 <button>paste</button>
//             </NodeToolbar>

//         </>
//     );
// }

// const nodeTypes = {
//     'node-with-toolbar': NodeWithToolbar,
// };

interface FlowGraph {
    nodes: MindMapNode[];
    edges: MindMapEdge[];
    onNodesChange: OnNodesChange<MindMapNode>;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    onNodeSelected: (id: string) => void
}


function FlowGraph({nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeSelected} : FlowGraph){

    // the passed handler has to be memoized, otherwise the hook will not work correctly
    const onNodeSelectionChanged = useCallback(({ nodes }: { nodes: Node[] }) => {
        const selectedNode = nodes[0];
        const selectedNodeId = selectedNode ? selectedNode.id : null;
        if(selectedNodeId){ onNodeSelected(selectedNodeId); }
    }, []);

    // useOnSelectionChange({ onChange: onNodeSelectionChanged });



    console.log('flow render');


    // const createNode = (position) => {
    //     const id = 'randId'
    //     const node: Node = { id, position, data: { label: 'new node' } };
    //     setNodes(nodes.concat([node]));
    //     console.log('createNode', node);
    // }

    return (
        <>
            <div style={{ height: '1000px', width: '1000px' }}>
                <ReactFlow
                    colorMode="dark"
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onPaneClick={() => {
                        console.log('panel click');
                    }}
                >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </div>
        </>
    );
}

export function MindMap() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setCurrentNode } = useInsightStore(
        useShallow(selector)
    );
    console.log('mindmap render', nodes);
    return (
        <ReactFlowProvider>
            <FlowGraph
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeSelected={(id) => { setCurrentNode(id); }}
            />
        </ReactFlowProvider>
    );
}