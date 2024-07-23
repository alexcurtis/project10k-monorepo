import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    NodeChange,
    EdgeChange,
    Connection
} from '@xyflow/react';

import { HighlightArea } from '@react-pdf-viewer/highlight';

import {
    MindMapNode,
    MindMapEdge,
    Insight,
    InsightStore,
    WorkspaceStore,
    Document,
    PdfHighlight,
    Highlight,
    Quote
} from './types';


const nodes: MindMapNode[] = [
    {
        id: '1',
        position: {
            x: 0,
            y: 0
        },
        data: {
            label: 'This is a test title'
        }
    },
    {
        id: '2',
        position: {
            x: 0,
            y: 200
        },
        data: {
            label: 'This is a test title 2'
        }
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

const edges: MindMapEdge[] = [
    { id: 'e1-2', source: '1', target: '2' }
];

const insights: Insight[] = [
    {
        id: '1',
        quotes: [
            {
                id: '1',
                text: 'quoting 11',
                highlight: {
                    pdfHighlightId: 'PDFNUMBER'
                }
            },
            {
                id: '2',
                text: 'quoting 12',
                highlight: {
                    pdfHighlightId: ''
                }
            }
        ],
        title: 'This is a test title',
        journal: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "journal entry 1" }] }] }
    },
    {
        id: '2',
        quotes: [
            {
                id: '3',
                text: 'quoting 21',
                highlight: {
                    pdfHighlightId: ''
                }
            }
        ],
        title: 'This is a test title 2',
        journal: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "journal entry 2" }] }] }
    },
    {
        id: '3',
        quotes: [
            {
                id: '4',
                text: 'quoting 31',
                highlight: {
                    pdfHighlightId: ''
                }
            }
        ],
        title: 'This is a test title 3',
        journal: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "journal entry 3" }] }] }
    },
];

const currentNodeId: string = '';
const currentInsightId: string = '';
const pdfHighlights: PdfHighlight[] = [{highlightAreas: []}];

// Creator Functions ---------------------------------

function createQuote({ text, highlight }: { text: string; highlight: Highlight; }) : Quote {
    // Quote Unique ID
    const quoteId = uuidv4();
    return {
        id: quoteId,
        text: text,
        highlight: highlight
    }
}

function createPdfHighlight(highlightArea: HighlightArea[]) : PdfHighlight {
     // An ID To Map The Insight Highlight to the PdfHighlight
     const pdfHighlightId = uuidv4();
     // New PdfHighlight
     return  {
         id: pdfHighlightId,
         highlightAreas: highlightArea.flat() // Flatten The Nested Array. Just Need The Highlight Block
     };
}


// Create Our Full Meat Highlight from Pdf Highlight (Lib Specific)
function createHighlightFromPdfHighlight(pdfHighlight : PdfHighlight) : Highlight {
    return {
        pdfHighlightId: pdfHighlight.id
    };
}

// Insight Store Hook ------------------------------

export const useInsightStore = create<InsightStore>((set, get) => ({
    nodes,
    edges,
    insights,
    currentNodeId,
    currentInsightId,
    pdfHighlights,
    // On Any Node Change -> Select, Drag, Etc
    onNodesChange: (changes: NodeChange[]) => {
        set({
            // TODO - THIS IS SLAPPING THE INTERNAL NODE INTERFACE AND IGNORING MindMapNode
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
    setNodes: (nodes: MindMapNode[]) => {
        set({ nodes });
    },
    setEdges: (edges: MindMapEdge[]) => {
        set({ edges });
    },
    setCurrentNode: (id: string) => {
        // Set Both The Current Insight and Node Ids - One is Coupled to the Other
        console.log('setting current node', id);
        set({
            currentNodeId: id,
            currentInsightId: id
        });
    },
    findInsight: (id: string) => {
        return get().insights.find((insight: Insight) => {
            return id === insight.id;
        });
    },
    getCurrentInsight: () => {
        return get().findInsight(get().currentInsightId);
    },
    setJournalOnInsight: (insightId: string, journal: object) => {
        set((state) => ({
            insights: state.insights.map((insight) =>
                insight.id === insightId ? { ...insight, journal } : insight,
            )
        }));
    },
    setTitleOnInsight: (insightId: string, title: string) => {
        // Set Title On Insight. Also Set Label On Node From Title (1:1 Relationship)
        set((state) => ({
            insights: state.insights.map((insight) =>
                insight.id === insightId ? { ...insight, title } : insight,
            ),
            nodes: state.nodes.map((node) =>
                node.id === insightId ? { ...node, data: { ...node.data, label: title } } : node,
            ),
        }));
    },
    addHighlightArea: (insightId: string, highlightArea: HighlightArea[], quote: string) => {
        // Set Insight To New Quote and PDF Highlight In Store
        const pdfHighlight : PdfHighlight = createPdfHighlight(highlightArea);
        set((state) => ({
            insights: state.insights.map((insight) =>
                insight.id === insightId ? {
                    ...insight,
                    // New Quote
                    quotes: insight.quotes.concat([
                        createQuote({
                            text: quote,
                            highlight: createHighlightFromPdfHighlight(pdfHighlight)
                        })
                    ])
                } : insight
            ),
            pdfHighlights: state.pdfHighlights.concat([pdfHighlight])
        }));
    },
    deleteQuote: (insightId: string, quoteId: string, pdfHighlightId: string) => {
        set((state) => ({
            insights: state.insights.map((insight) => {
                if(insight.id !== insightId){ return insight; }
                return {
                    ...insight,
                    quotes: insight.quotes.filter((quote : Quote) => quote.id !== quoteId)
                };
            }),
            pdfHighlights: state.pdfHighlights.filter((pdfHighlight) => pdfHighlight.id !== pdfHighlightId)
        }));
    },
    getPdfHighlights: () => {
        // Used To Pull PDF Highlights From The Store (Via Event Bus)
        return get().pdfHighlights;
    }
}));


// Workspace Store Hook ------------------------------

const documents: Document[] = [];

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
    documents
}));