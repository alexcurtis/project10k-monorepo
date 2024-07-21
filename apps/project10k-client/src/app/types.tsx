import { HighlightArea } from '@react-pdf-viewer/highlight';
import {
    OnNodesChange,
    OnEdgesChange,
    OnConnect
} from '@xyflow/react';

export interface MindMapNode {
    id: string;
    position: {
        x: number;
        y: number;
    };
    data: {
        label: string;
    };
}

export interface MindMapEdge {
    id: string;
    source: string;
    target: string;
}

export interface Highlight {
    pdfHighlightId: string;
}

export interface Quote {
    id: string;
    text: string;
    highlight: Highlight;
}

export interface Insight {
    id: string;
    title: string;
    quotes: Quote[];
    journal: object;
}

export interface PdfHighlight {
    id: string;
    highlightAreas: HighlightArea[];
}

export interface InsightStore {
    nodes: MindMapNode[];
    edges: MindMapEdge[];
    insights: Insight[];
    currentNodeId: string;
    currentInsightId: string;
    pdfHighlights: PdfHighlight[],
    onNodesChange: OnNodesChange<MindMapNode>;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: MindMapNode[]) => void;
    setEdges: (edges: MindMapEdge[]) => void;
    setCurrentNode: (id: string) => void;
    findInsight: (id: string) => Insight | undefined;
    getCurrentInsight: () => void;
    setJournalOnInsight: (insightId: string, journal: object) => void;
    setTitleOnInsight: (insightId: string, title: string) => void;
    addHighlightArea: (insightId: string, highlightArea: HighlightArea[], quote: string) => void;
    deleteQuote: (insightId: string, quoteId: string, pdfHighlightId: string) => void;
    getPdfHighlights: () => PdfHighlight[];
}

export interface Document {
    name: string;
}

export interface WorkspaceStore {
    documents: Document[],
}