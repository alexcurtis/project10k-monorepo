import { useCallback, useContext, useEffect } from 'react';

import {
    Worker,
    Button,
    PrimaryButton,
    Position,
    Tooltip,
    Viewer
} from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import {
    highlightPlugin,
    MessageIcon,
    HighlightArea,
    RenderHighlightsProps,
    RenderHighlightContentProps
} from '@react-pdf-viewer/highlight';

import { useShallow } from 'zustand/react/shallow';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { useSub } from './hooks';
import { useInsightStore } from './store';
import {
    InsightStore,
    PdfHighlight
} from './types';

const selector = (state: InsightStore) => ({
    pdfHighlights: state.pdfHighlights,
    addHighlightArea: state.addHighlightArea,
    currentInsightId: state.currentInsightId,
    getPdfHighlights: state.getPdfHighlights
});


const renderHighlightTarget = ({ selectionRegion, toggle }: { selectionRegion: HighlightArea, toggle: () => void }) => (
    <div
        className="bg-zinc-900 p-2 absolute z-10 translate-y-1"
        style={{
            left: `${selectionRegion.left}%`,
            top: `${selectionRegion.top + selectionRegion.height}%`,
        }}
    >
        <Tooltip
            position={Position.TopCenter}
            target={
                <Button onClick={toggle}>
                    <MessageIcon />
                </Button>
            }
            content={() => <div style={{ width: '100px' }}>Add a note</div>}
            offset={{ left: 0, top: -8 }}
        />
    </div>
);

const renderHighlightContent = ({ currentInsightId, addHighlightArea, props }: { currentInsightId: string; addHighlightArea: Function; props: RenderHighlightContentProps }) => {

    const addHighlight = () => {
        addHighlightArea(
            currentInsightId,
            props.highlightAreas,
            props.selectedText
        );
    };
    return (
        <div
            style={{
                background: '#fff',
                border: '1px solid rgba(0, 0, 0, .3)',
                borderRadius: '2px',
                padding: '8px',
                position: 'absolute',
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                zIndex: 1,
            }}
        >
            <div>
            </div>
            <div
                style={{
                    display: 'flex',
                    marginTop: '8px',
                }}
            >
                <div style={{ marginRight: '8px' }}>
                    <PrimaryButton onClick={addHighlight}>
                        Add To Insight
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

// The Render Code For PDF Highlighting In The Document
function renderHighlights({ pdfHighlights, props }: { pdfHighlights: PdfHighlight[]; props: RenderHighlightsProps }) {
    const highlights = pdfHighlights.map((pdfHighlight) => {
        // Filter all highlights on the current page
        return pdfHighlight.highlightAreas.filter((area) => area.pageIndex === props.pageIndex).map((highlight, hidx) => (
            <div key={`${pdfHighlight.id}-${hidx}`}
                style={Object.assign(
                    {},
                    {
                        background: 'yellow',
                        opacity: 0.4,
                    },
                    props.getCssProperties(highlight, props.rotation)
                )}
            />
        ));
    });
    return (
        <> {highlights} </>
    );
}

export function PdfViewer() {
    const { pdfHighlights, addHighlightArea, currentInsightId, getPdfHighlights } = useInsightStore(
        useShallow(selector)
    );

    console.log('pdf highlights!!!!!!!!', pdfHighlights);

    const renderHighlightsCb = useCallback((props: RenderHighlightsProps) => {
        return renderHighlights({ pdfHighlights, props });
    }, [pdfHighlights]);

    const renderHighlightContentCb = useCallback((props: RenderHighlightContentProps) => {
        return renderHighlightContent({ currentInsightId, addHighlightArea, props });
    }, [currentInsightId]);

    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlights: renderHighlightsCb,
        renderHighlightContent: renderHighlightContentCb
    });
        
    // Event Emitter Pub/Sub (Mainly for Navigate to Highlight)
    useSub('pdfviewer:jumpToHighlight', (highlightAreaId) => {
        // Jump To Highlight
        const { jumpToHighlightArea } = highlightPluginInstance;
        const pdfHighlights = getPdfHighlights();
        const pdfHighlightArea = pdfHighlights.find((pdfHighlight) => pdfHighlight.id === highlightAreaId);
        // If Nothing Found - Just Drop Out
        if(pdfHighlightArea === undefined){ return; }
        const firstArea = pdfHighlightArea.highlightAreas[0];
        // Pass Over To PDF Viewer To Jump To Area
        jumpToHighlightArea(firstArea);
    });
    
    console.log('PDF VIEWER RENDER!!!!!!!!!!!!!!!!!!!!!');
    return (
        <div className="basis-1/2 bg-zinc-900">
            <div className="h-screen">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <Viewer
                        theme="dark"
                        fileUrl="/2023_ENB_10K.pdf"
                        plugins={[
                            highlightPluginInstance,
                            defaultLayoutPluginInstance
                        ]}
                    />
                </Worker>
            </div>
        </div>
    );
}