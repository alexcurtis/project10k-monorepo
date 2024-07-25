import { useMemo } from 'react';

import {
    ReactFlow,
    ReactFlowProvider,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    useOnSelectionChange,
    NodeToolbar,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    Node
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const BACKGROUND_COLOR = '#09090b';


// const edges = [
//     { id: 'e1-2', source: '1', target: '2' }
// ];

function buildEdges(nodes){
    return nodes.flatMap((node) => {
        console.log('chugging edge builder');
        if(!node.edges){ return []; }
        return node.edges.map((edge) => {
            const source = node.id;
            const target = edge.target;
            return {
                id: `e${source}-${target}`,
                source,
                target
            }
        });
    });
}

const nodes = [
    {
        id: '1',
        position: {
            x: 0,
            y: 0
        },
        data: {
            label: 'This is a test title'
        },
        edges: [
            { target: '2' },
            { target: '3' }
        ]
    },
    {
        id: '2',
        position: {
            x: 0,
            y: 200
        },
        data: {
            label: 'This is a test title 2'
        },
        edges: [
            { target: '3' }
        ]
    },
    {
        id: '3',
        position: {
            x: 0,
            y: 400
        },
        data: {
            label: 'This is a test title 3'
        }
    },
];



export function MindMap() {

    // Build The React Flow Data Structure From Stored Data
    const edges = useMemo(() => {
        return buildEdges(nodes);
    }, [nodes]);
    
    return (
        <>
            <ReactFlowProvider>
                <div style={{ height: '100%', width: '100%' }}>
                    <ReactFlow
                        style={{ backgroundColor: BACKGROUND_COLOR }}
                        colorMode="dark"
                        nodes={nodes}
                        edges={edges}
                    >
                        <Controls />
                        <MiniMap />
                        <Background
                            style={{ backgroundColor: BACKGROUND_COLOR }}
                            variant={BackgroundVariant.Dots}
                            gap={12}
                            size={1}
                        />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </>
    );
}