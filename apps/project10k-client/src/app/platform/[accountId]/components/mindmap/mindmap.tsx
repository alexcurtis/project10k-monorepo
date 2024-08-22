import { useEffect, useState, useContext, useCallback, MouseEvent } from "react";
import { useMutation, gql } from "@apollo/client";
import { useShallow } from "zustand/react/shallow";
import { PlusIcon } from "@heroicons/react/16/solid";
import {
    ReactFlow,
    ReactFlowProvider,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    NodeMouseHandler,
    Node,
    Edge,
    Connection,
    EdgeChange,
} from "@xyflow/react";

import { DeleteGateway, IDeleteGateway } from "@vspark/catalyst/common-dialogs";
import { Button } from "@vspark/catalyst/button";

import { MINDMAP_NODE_QL_RESPONSE, M_CREATE_NEW_JOURNAL_ON_WORKSPACE } from "@platform/graphql";
import { WorkspaceContext } from "@platform/context";
import { IJournal } from "@platform/types/entities";

import { MindMapInteractivityStore, useMindMapInteractivityStore } from "./store";
import { DefaultNode } from "./node";

import "@xyflow/react/dist/style.css";
import "./mindmap.css";

// MindMap Background Colour ()
const BACKGROUND_COLOUR = "#09090b";

// Flow Node Types
const nodeTypes = {
    default: DefaultNode,
};

// Local Interactivity Store Selector
const selector = (state: MindMapInteractivityStore) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    setNodesAndEdges: state.setNodesAndEdges,
});

const M_UPDATE_MINDMAPNODE = gql`mutation UpdateJournalMindMapNode($journalId: ID!, $mindMapNode: MindMapNodeInput!) {
	updateJournal(
        id: $journalId, journal: {
            mindMapNode: $mindMapNode
        }
    ){
        _id,
        mindMapNode ${MINDMAP_NODE_QL_RESPONSE}
    }
}
`;

// Journal Update Mutation For Mind Map Node
const M_DELETE_JOURNAL_FROM_WORKSPACE = gql`
    mutation DeleteJournalOnWorkspace($id: ID!, $journalId: ID!) {
        deleteJournalOnWorkspace(id: $id, journalId: $journalId) {
            _id
            journals {
                _id
            }
        }
    }
`;

function buildNodesFromJournals(journals: IJournal[], onNodeDeleteCb: (id: string) => void): Node[] {
    return journals.map((journal) => {
        const { mindMapNode } = journal;
        return {
            ...mindMapNode,
            // ReMap ID From DB (React Flow uses id rather that _id)
            id: mindMapNode._id,
            // Pull In Meta Data For Node
            data: {
                label: journal.name,
                journalId: journal._id,
                onNodeDeleteCb,
            },
        };
    });
}

function buildEdgesFromJournals(journals: IJournal[]): Edge[] {
    return journals.flatMap((journal) => {
        const { mindMapNode } = journal;
        return mindMapNode.edges.map((edge) => {
            const source = mindMapNode._id;
            const target = edge.target;
            return {
                id: edge._id,
                source,
                target,
            };
        });
    });
}

function buildEdgeFromConnection(connection: Connection): Edge {
    const { source, target } = connection;
    return {
        id: `e${source}-${target}`,
        source: source,
        target: target,
    };
}

function createMindMapNodeUpdateFromFlowNode(node: Node, edges: Edge[]) {
    const mindMapNodeEdges = edges
        .filter((edge) => edge.source === node.id)
        .map((edge) => {
            return {
                _id: edge.id,
                target: edge.target,
            };
        });
    return {
        variables: {
            journalId: node.data.journalId,
            mindMapNode: {
                _id: node.id,
                position: {
                    x: node.position.x,
                    y: node.position.y,
                },
                edges: mindMapNodeEdges,
            },
        },
    };
}

function findSourceNodeFromEdgeId(id: string, edges: Edge[], nodes: Node[]) {
    // Find The Edge
    const edge = edges.find((e) => e.id === id);
    if (!edge) {
        return;
    }
    const { source } = edge;
    // Find The Node From The Source ID
    return nodes.find((node) => node.id === source);
}

export function FlowGraph({
    onNodeDeleteAction,
}: {
    onNodeDeleteAction: (name: string, deleteAction: () => void) => void;
}) {
    const workspaceContext = useContext(WorkspaceContext);
    if (!workspaceContext) {
        return;
    }
    const { setActiveJournal } = workspaceContext;
    const workspace = workspaceContext.workspace;
    const { journals } = workspace;

    // Mutators
    const [updateMindMapNode, {}] = useMutation(M_UPDATE_MINDMAPNODE);
    const [deleteJournalFromWorkspace, {}] = useMutation(M_DELETE_JOURNAL_FROM_WORKSPACE);

    // MindMap Interactivity Store
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodesAndEdges } = useMindMapInteractivityStore(
        useShallow(selector)
    );

    // On Node Delete
    const onNodeDeleteCb = useCallback(
        (id: string) => {
            // Get The Node Name (For The Dialog)
            const journal = journals.find((j) => j._id === id);
            if (!journal) {
                return;
            }
            const { name } = journal;
            // Trigger Dialog Action
            onNodeDeleteAction(name, () => {
                deleteJournalFromWorkspace({
                    variables: {
                        id: workspace._id,
                        journalId: id,
                    },
                });
            });
        },
        [workspace, journals, onNodeDeleteAction]
    );

    // MindMap Builder
    useEffect(() => {
        // Push Nodes From Journal Into Interactivity Store
        const nodes = buildNodesFromJournals(journals, onNodeDeleteCb);
        const edges = buildEdgesFromJournals(journals);
        setNodesAndEdges(nodes, edges);
    }, [journals, onNodeDeleteCb, setNodesAndEdges]);

    // Set The Active Journal When A Node Is Clicked
    const setActiveJournalCb = useCallback<NodeMouseHandler>(
        (_, node) => {
            const selectedJournalId = node.data.journalId;
            setActiveJournal(selectedJournalId);
        },
        [setActiveJournal]
    );

    // After Drag Event Ended. Persist To GraphQL
    const onNodeDragStopCb = useCallback(
        (_evnt: MouseEvent, node: Node) => {
            updateMindMapNode(createMindMapNodeUpdateFromFlowNode(node, edges));
        },
        [updateMindMapNode, edges]
    );

    // On Connection Made
    const onConnection = useCallback(
        (connection: Connection) => {
            const updatedEdges = [...edges, buildEdgeFromConnection(connection)];
            // Update The Interactivity Store
            onConnect(connection);
            // Persist The Connection To GraphQL
            const { source } = connection;
            const node = nodes.find((node) => node.id === source);
            if (!node) {
                return;
            }
            updateMindMapNode(createMindMapNodeUpdateFromFlowNode(node, updatedEdges));
        },
        [updateMindMapNode, nodes, edges]
    );

    // When An Edge Is Removed
    const onEdgesChangeCb = useCallback(
        (changes: EdgeChange[]) => {
            // Check If Edge Removed. If So. Update GraphQL
            const change = changes[0];
            if (change.type === "remove") {
                const node = findSourceNodeFromEdgeId(change.id, edges, nodes);
                if (node) {
                    // Remove The Edge So We Can Use New Edge State To Build Node For Graph QL
                    const updatedEdges = edges.filter((edge) => edge.id !== change.id);
                    updateMindMapNode(createMindMapNodeUpdateFromFlowNode(node, updatedEdges));
                }
            }
            // Pass Everything To Interactivity Store
            onEdgesChange(changes);
        },
        [updateMindMapNode, nodes, edges]
    );

    console.log("nodes", nodes);

    return (
        <>
            <div style={{ height: "100%", width: "100%" }}>
                {/* Render React Flow When Nodes Are Available - Fixes The FitView */}
                {nodes.length > 0 && (
                    <ReactFlow
                        className="mindmap-flow"
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
                )}
            </div>
        </>
    );
}

function ToolBar() {
    const workspaceContext = useContext(WorkspaceContext);
    // Mutators
    const [createNewJournalOnWorkspace, {}] = useMutation(M_CREATE_NEW_JOURNAL_ON_WORKSPACE);

    // On Add Journal Callback
    const onAddJournal = useCallback(() => {
        createNewJournalOnWorkspace({
            variables: {
                id: workspaceContext.workspace._id,
            },
        });
    }, [workspaceContext, createNewJournalOnWorkspace]);

    return (
        <div className="absolute top-0 right-0 z-10 p-4">
            <Button color="indigo" onClick={onAddJournal}>
                <PlusIcon />
                Add Journal
            </Button>
        </div>
    );
}

export function MindMap() {
    const [deleteJournalGateway, setDeleteJournalGateway] = useState<IDeleteGateway>({
        name: "",
        isOpen: false,
        deleteAction: () => {},
    });

    const openDeleteJournalGatewayCb = useCallback(
        (name: string, deleteAction: () => void) => {
            setDeleteJournalGateway({ name, isOpen: true, deleteAction });
        },
        [setDeleteJournalGateway]
    );

    return (
        <div className="relative w-full h-full">
            <ToolBar />
            <DeleteGateway
                title="Delete Journal"
                entity="Journal"
                gateway={deleteJournalGateway}
                setDeleteGateway={setDeleteJournalGateway}
            />
            <ReactFlowProvider>
                <FlowGraph onNodeDeleteAction={openDeleteJournalGatewayCb} />
            </ReactFlowProvider>
        </div>
    );
}
