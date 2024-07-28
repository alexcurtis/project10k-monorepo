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
    Edge,
    Connection,
    EdgeChange
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
import { DefaultNode } from './node';
import { IMindMapNodeMetaData } from '@/app/types/entities';


import '@xyflow/react/dist/style.css';

// MindMap Background Colour ()
const BACKGROUND_COLOUR = '#09090b';

// Flow Node Types
const nodeTypes = {
    default: DefaultNode
};

// Local Interactivity Store Selector
const selector = (state: MindMapInteractivityStore) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    setNodesAndEdges: state.setNodesAndEdges
});

const M_UPDATE_MINDMAPNODE = gql`mutation UpdateJournalMindMapNode($journalId: ID!, $mindMapNode: MindMapNodeInput!) {
	updateJournal(
        id: $journalId, journal: {
            mindMapNode: $mindMapNode
        }
    ){
        _id,
        mindMapNode {
            _id,
            position {
                x,
                y
            }
            edges {
                _id
                target
            }
        }
    }
}
`;

// Journal Update Mutation For Mind Map Node
const M_DELETE_JOURNAL_FROM_WORKSPACE = gql`mutation DeleteJournalOnWorkspace($id: ID!, $journalId: ID!) {
	deleteJournalOnWorkspace(
    id: $id,
  	journalId: $journalId) {
        _id
        journals {
            _id
        }
  	}
}
`;


function buildNodesFromJournals(journals: IJournal[], onNodeDeleteCb: (id: string) => void): Node[] {
    return journals.map((journal) => {
        console.log('xxxxcx', journal.mindMapNode);
        const { mindMapNode } = journal;
        return {
            ...mindMapNode,
            // ReMap ID From DB
            id: mindMapNode._id,
            // Pull In Meta Data For Node
            data: {
                label: journal.name,
                journalId: journal._id,
                onNodeDeleteCb
            }
        }
    });
}

function buildEdgesFromJournals(journals: IJournal[]) : Edge[] {
    return journals.flatMap((journal) => {
        const { mindMapNode } = journal;
        console.log('FOUND EDGES ', mindMapNode.edges);
        return mindMapNode.edges.map((edge) => {
            const source = mindMapNode._id;
            const target = edge.target;
            return {
                id: `e${source}-${target}`,
                source,
                target
            }
        });
    });
}

function buildEdgeFromConnection(connection: Connection) : Edge {
    return {
        id: '',
        source: connection.source,
        target: connection.target
    };
}

function createMindMapNodeUpdateFromFlowNode(node: Node, edges: Edge[]){
    console.log('node ', node);
    
    // Need To find a way of getting existing IDs in here.... for edges....
    
    const mindMapNodeEdges = edges
        .filter((edge) => edge.source === node.id)
        .map((edge) => {
            return {
                target: edge.target
            };
        });
    return {
        variables: {
            journalId: node.data.journalId,
            mindMapNode: {
                _id: node.id,
                position: {
                    x: node.position.x,
                    y: node.position.y
                },
                edges: mindMapNodeEdges
            }
        }
    };
}

function findSourceNodeFromEdgeId(id: string, edges: Edge[], nodes: Node[]){
    // Find The Edge
    const edge = edges.find((e) => e.id === id);
    if (!edge){ return; }
    const { source } = edge;
    // Find The Node From The Source ID
    return nodes.find((node) => node.id === source);
}

export function FlowGraph() {
    console.log('rendering flow graph');
    const workspaceContext = useContext(WorkspaceContext);
    if (!workspaceContext) { return; }
    const { setActiveJournal } = workspaceContext;
    const workspace = workspaceContext.workspace;
    const { journals } = workspace;

    // Mutators
    const [updateMindMapNode, { }] = useMutation(M_UPDATE_MINDMAPNODE);
    // TODO - Move These Up The Hierachy If Need A Delete Else Where
    const [deleteJournalFromWorkspace, { }] = useMutation(M_DELETE_JOURNAL_FROM_WORKSPACE);

    // MindMap Interactivity Store
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        setNodesAndEdges
    } = useMindMapInteractivityStore(useShallow(selector));

    const onNodeDeleteCb = useCallback((id: string) => {
        deleteJournalFromWorkspace({
            variables: {
                id: workspace._id,
                journalId: id
            }
        });
        console.log('deleting journal....', {
            id: workspace._id,
            journalId: id
        });
    }, [workspace, journals]);


    useEffect(() => {
        // Push Nodes From Journal Into Interactivity Store
        const nodes = buildNodesFromJournals(journals, onNodeDeleteCb);
        console.log('useEffect nodes', nodes);
        const edges = buildEdgesFromJournals(journals);
        console.log('useEffect edges', edges);
        setNodesAndEdges(nodes, edges);
        // Todo Also Push Edges
    }, [journals, onNodeDeleteCb, setNodesAndEdges]);

    const setActiveJournalCb = useCallback<NodeMouseHandler>((_, node) => {
        const selectedJournalId = node.data.journalId;
        console.log('set Active journal', selectedJournalId);
        setActiveJournal(selectedJournalId);
    }, [setActiveJournal]);

    // After Drag Event Ended. Persist To GraphQL
    const onNodeDragStopCb = useCallback((_evnt: MouseEvent, node: Node) => {
        updateMindMapNode(createMindMapNodeUpdateFromFlowNode(node, edges));
    }, [updateMindMapNode, edges]);

    // On Connection Made
    const onConnection = useCallback((connection: Connection) => {
        const updatedEdges = [...edges, buildEdgeFromConnection(connection)];
        // Update The Interactivity Store
        onConnect(connection);
        // Persist The Connection To GraphQL
        console.log('connection', connection);
        const { source } = connection;
        const node = nodes.find((node) => node.id === source);
        if (!node){ return; }
        updateMindMapNode(createMindMapNodeUpdateFromFlowNode(node, updatedEdges));
    }, [updateMindMapNode, nodes, edges]);

    const onEdgesChangeCb = useCallback((changes: EdgeChange[]) => {
        // Check If Edge Removed. If So. Update GraphQL
        const change = changes[0];
        if(change.type ==='remove'){
            const node = findSourceNodeFromEdgeId(change.id, edges, nodes);
            if(node){
                console.log('Removing edge from node', node)
                // Remove The Edge So We Can Use New Edge State To Build Node For Graph QL
                const updatedEdges = edges.filter(edge => edge.id !== change.id);
                updateMindMapNode(createMindMapNodeUpdateFromFlowNode(node, updatedEdges));
            }
        }
        // Pass Everything To Interactivity Store
        onEdgesChange(changes);
    }, [updateMindMapNode, nodes, edges]);


    return (
        <>
            <div style={{ height: '100%', width: '100%' }}>
                <ReactFlow
                    style={{ backgroundColor: BACKGROUND_COLOUR }}
                    colorMode="dark"
                    // Fit View To Initial Nodes
                    fitView={true}
                    nodes={nodes}
                    edges={edges}
                    // Allows Node Click To Trigger More Successfully
                    // https://github.com/xyflow/xyflow/issues/3833
                    nodeDragThreshold={5}
                    deleteKeyCode={["Delete", "Backspace"]}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChangeCb}
                    // onEdgesChange={onEdgesChange}
                    onConnect={onConnection}
                    onNodeClick={setActiveJournalCb}
                    onNodeDragStop={onNodeDragStopCb}
                    nodeTypes={nodeTypes}
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
    return (
        <>
            <ReactFlowProvider>
                <FlowGraph />
            </ReactFlowProvider>
        </>
    );
}