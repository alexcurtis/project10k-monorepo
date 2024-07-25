import { useMemo, useContext } from 'react';

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


export function MindMap() {
    const workspace = useContext(WorkspaceContext);
    if (!workspace){ return; }
    const nodes = buildNodesFromJournals(workspace.journals);
    console.log('nodes', nodes);

    // Build The React Flow Data Structure From Stored Data
    // const edges = useMemo(() => {
    //     return buildEdges(nodes);
    // }, [nodes]);

    return (
        <>
            <ReactFlowProvider>
                <div style={{ height: '100%', width: '100%' }}>
                    <ReactFlow
                        style={{ backgroundColor: BACKGROUND_COLOR }}
                        colorMode="dark"
                        nodes={nodes}
                        edges={[]}
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