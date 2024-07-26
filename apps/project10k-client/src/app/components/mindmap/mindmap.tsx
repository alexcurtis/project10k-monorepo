import {
    useEffect,
    useMemo,
    useContext,
    useCallback
} from 'react';

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
    Node,
} from '@xyflow/react';
import { useShallow } from 'zustand/react/shallow';

import { WorkspaceContext } from '@/app/context';
import { IJournal } from '@/app/types/entities';

import { MindMapInteractivityStore, useMindMapInteractivityStore } from './store';

import '@xyflow/react/dist/style.css';

const BACKGROUND_COLOR = '#09090b';

const selector = (state: MindMapInteractivityStore) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    setNodes: state.setNodes,
    setEdges: state.setEdges
});

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


// USE THE APOLLO CACHE - WRITE THE INTERACTIVITY CHANGES TO CACHE. READ THEM AFTER.... 
 //ONLY PROBLEM IS THAT THEY ARE STORED AT THE JOURNAL LEVEL. WE DONT WANT THOSE RE-RENDERING TONS

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
    const { setActiveJournal } = workspaceContext;
    const workspace = workspaceContext.workspace;
    const { journals } = workspace;

    // MindMap Interactivity Store
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        setNodes
    } = useMindMapInteractivityStore(useShallow(selector));


    useEffect(() => {
        // Push Nodes From Journal Into Interactivity Store
        const nodes = buildNodesFromJournals(journals);
        console.log('useEffect nodes', nodes);
        setNodes(nodes);
        // Todo Also Push Edges
    }, [journals]);



    const setActiveJournalCb = useCallback<NodeMouseHandler>((_, node) => {
        // As each Node is a Journal (with same ID). Simply Grab The Node ID
        const selectedNodeId = node.id;
        console.log('set Active journal', selectedNodeId);
        setActiveJournal(selectedNodeId);
    }, [setActiveJournal]);





    

    

    return (
        <>
            <div style={{ height: '100%', width: '100%' }}>
                <ReactFlow
                    style={{ backgroundColor: BACKGROUND_COLOR }}
                    colorMode="dark"
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
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