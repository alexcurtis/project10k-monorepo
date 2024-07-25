import { useMemo, useContext, useCallback } from 'react';

import {
    ReactFlow,
    ReactFlowProvider,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    NodeMouseHandler,
    useOnSelectionChange,
    NodeToolbar,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    Node
} from '@xyflow/react';

import { WorkspaceContext } from '@/app/context';
import { IJournal } from '@/app/types/entities';

import '@xyflow/react/dist/style.css';

const BACKGROUND_COLOR = '#09090b';

// function buildEdges(nodes) {
//     return nodes.flatMap((node) => {
//         console.log('chugging edge builder');
//         if (!node.edges) { return []; }
//         return node.edges.map((edge) => {
//             const source = node.id;
//             const target = edge.target;
//             return {
//                 id: `e${source}-${target}`,
//                 source,
//                 target
//             }
//         });
//     });
// }

function buildNodesFromJournals(journals: IJournal[]) {
    return journals.map((journal) => {
        return {
            id: journal._id,
            position: journal.mindMapNode.position,
            data: { label: journal.name }
        }
    });
}


export function FlowGraph() {
    console.log('rendering flow graph');
    const workspaceContext = useContext(WorkspaceContext);
    if (!workspaceContext) { return; }

    const setActiveJournalCb = useCallback<NodeMouseHandler>((_, node) => {
        // As each Node is a Journal (with same ID). Simply Grab The Node ID
        const selectedNodeId = node.id;
        workspaceContext.setActiveJournal(selectedNodeId);
    }, [workspaceContext.setActiveJournal]);

    const workspace = workspaceContext.workspace;
    const { journals } = workspace;
    const nodes = buildNodesFromJournals(journals);
    console.log('nodes', nodes);


    return (
        <>
            <div style={{ height: '100%', width: '100%' }}>
                <ReactFlow
                    style={{ backgroundColor: BACKGROUND_COLOR }}
                    colorMode="dark"
                    nodes={nodes}
                    edges={[]}
                    onNodeClick={setActiveJournalCb}
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
        </>
    );
}

export function MindMap() {
    console.log('rendering Mind Map');

    // Build The React Flow Data Structure From Stored Data
    // const edges = useMemo(() => {
    //     return buildEdges(nodes);
    // }, [nodes]);


    return (
        <>
            <ReactFlowProvider>
                <FlowGraph />
            </ReactFlowProvider>
        </>
    );
}