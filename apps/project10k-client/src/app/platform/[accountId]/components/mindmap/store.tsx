import { create } from "zustand";
import {
    Edge,
    Node,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    NodeChange,
    EdgeChange,
    Connection,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
} from "@xyflow/react";

export interface MindMapInteractivityStore {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange<Node>;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    setNodesAndEdges: (nodes: Node[], edges: Edge[]) => void;
}

// MindMap Store Hook (Mainly For Interactivity) ------------------------------
export const useMindMapInteractivityStore = create<MindMapInteractivityStore>((set, get) => ({
    nodes: [],
    edges: [],
    // On Any Node Change -> Select, Drag, Etc
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
    },
    setNodes: (nodes: Node[]) => {
        set({ nodes });
    },
    setEdges: (edges: Edge[]) => {
        set({ edges });
    },
    setNodesAndEdges(nodes: Node[], edges: Edge[]) {
        set({ nodes, edges });
    },
}));
