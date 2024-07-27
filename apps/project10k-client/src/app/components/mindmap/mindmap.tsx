import {
    useEffect,
    useMemo,
    useContext,
    useCallback,
    MouseEvent
} from 'react';

import {
    ReactFlow,
    ReactFlowProvider,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    NodeMouseHandler,
    NodeChange,
    applyNodeChanges,
    useOnSelectionChange,
    NodeToolbar,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    Node,
} from '@xyflow/react';

import { useQuery, useMutation, gql } from '@apollo/client';
import { debounce } from 'lodash';
import { useShallow } from 'zustand/react/shallow';

import { WorkspaceContext } from '@/app/context';
import { IJournal } from '@/app/types/entities';

import {
    MindMapInteractivityStore,
    useMindMapInteractivityStore
} from './store';

import '@xyflow/react/dist/style.css';

// MindMap Background Colour ()
const BACKGROUND_COLOUR = '#09090b';

// Local Interactivity Store Selector
const selector = (state: MindMapInteractivityStore) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    setNodes: state.setNodes,
    setEdges: state.setEdges
});

// todo - sort out IDS here
// Journal Update Mutation For Mind Map Node
const M_UPDATE_JOURNAL_MINDMAPNODE = gql`mutation UpdateJournalMindMapNode($id: ID!, $x: Float!, $y: Float!) {
	updateJournal(
        id: $id, journal: {
            mindMapNode: {
                position: {
                    x: $x
                    y: $y
                }
            }
        }
    ){
        _id,
        mindMapNode {
            _id,
            position {
                x,
                y
            }
        }
    }
}
`;

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
        console.log('xxxxcx', journal.mindMapNode);
        const { mindMapNode } = journal;
        return {
            ...mindMapNode,
            // Map Over ID From Journal
            id: journal._id,
            // Pull In Journal Name For Node Label
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

    // Mutators
    const [updateJournalMindMapNode, { }] = useMutation(M_UPDATE_JOURNAL_MINDMAPNODE);

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

    // After Drag Event Ended. Persist To GraphQL
    const onNodeDragStopCb = useCallback((_evnt: MouseEvent, node: Node) => {
        // TODO - IF MINDMAP HAS ITS OWN ID, THEN WE NEED TO MAP IT TO A JOURNAL....

        // Journal ID and Node ID are the same
        updateJournalMindMapNode({
            variables: {
                id: node.id,
                x: node.position.x,
                y: node.position.y
            }
        });
    }, [updateJournalMindMapNode]);


    return (
        <>
            <div style={{ height: '100%', width: '100%' }}>
                <ReactFlow
                    style={{ backgroundColor: BACKGROUND_COLOUR }}
                    colorMode="dark"
                    nodes={nodes}
                    edges={edges}
                    // Allows Node Click To Trigger More Successfully
                    // https://github.com/xyflow/xyflow/issues/3833
                    nodeDragThreshold={5}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={setActiveJournalCb}
                    onNodeDragStop={onNodeDragStopCb}
                >
                    <Controls />
                    <MiniMap />
                    <Background
                        style={{ backgroundColor: BACKGROUND_COLOUR }}
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