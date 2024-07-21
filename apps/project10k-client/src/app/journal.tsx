import { memo, useState, useContext, useCallback } from 'react';
import { EditableText } from './components';
// import { BlockEditor } from './editor';
import { Insight, InsightStore, Quote } from './types';
import { useInsightStore } from './store';
import { useShallow } from 'zustand/react/shallow';

// import { Button } from './components';
import { usePub } from './hooks';

import { BlockEditor } from '@vspark/block-editor/src/components/BlockEditor';

import {Button} from '@vspark/catalyst/button';

function NoInsightSelected() {
    return (
        <div className="basis-1/4 bg-zinc-900">
            {'No Insight Selected. Look at how hints are dropped in other apps'}
        </div>
    );
}

// TODO -REFACTOR TO REMOVE ONDELETE PROP DRILLING
// PASSING ONDELETE THROUGH 3 LEVELS - IS THIS WHERE CONTEXT COMES IN HANDY?


function QuoteTools({ onDelete, onJumpToHighlight } : { onDelete: () => void; onJumpToHighlight: () => void}) {
    return (
        <div className="relative">
            <Button onClick={onDelete} className="absolute right-0">
                Delete
            </Button>
            <Button onClick={onJumpToHighlight} className="absolute right-32">
                Go To Highlight
            </Button>
        </div>
    );
}

function Quote({ quote, onDelete }: { quote: Quote; onDelete: () => void; }) {
    console.log('RENDERING Quote------------');
    const [tools, setTools] = useState(true);
    const publish = usePub();
    const onJumpToHighlight = () => {
        publish('pdfviewer:jumpToHighlight', quote.highlight.pdfHighlightId);
    }
    return (
        <div className="rounded bg-zinc-700 p-4 mt-4 mb-4"
            onMouseEnter={() => setTools(true)}
            onMouseLeave={() => setTools(false)}
        >
            {tools ? <QuoteTools onDelete={onDelete} onJumpToHighlight={onJumpToHighlight} /> : null}
            {quote.text}
        </div>
    );
}

const selector = (state: InsightStore) => ({
    insight: state.getCurrentInsight(),
    setJournalOnInsight: state.setJournalOnInsight,
    setTitleOnInsight: state.setTitleOnInsight,
    deleteQuote: state.deleteQuote
});

// Only Re-Render Expensive Editor Function If ID Changes (Insight Moves to Another)
const isSameInsight = (prevProps: { id: string; }, nextProps: { id: string; }) => {
    return prevProps.id === nextProps.id;
};

export const JournalEditor = memo(({ content, onUpdate }: { content: object, onUpdate: (update: object) => void }) => {
    console.log('RENDERING BIG EXPENSIVE EDITOR VIEW');
    return (
        <div className='p-4 bg-zinc-800 min-h-96 rounded'>
            <BlockEditor
                // content={content}
                // onUpdate={onUpdate}
            />
        </div>
    );
}, isSameInsight);


export function Journal() {
    const { insight, setJournalOnInsight, setTitleOnInsight, deleteQuote } = useInsightStore(
        useShallow(selector)
    );

    // If No Insight Selected. Show Default View
    if (insight === undefined) { return (<NoInsightSelected />); }

    console.log('rendering JournalEditor', insight);

    // Insight Selected. Render The Journal
    return (
        <div className="basis-1/4 bg-zinc-900">
            <div className="p-6 flex flex-col">
                <EditableText
                    value={insight.title}
                    placeholder="Untitled"
                    onBlur={(e) => { setTitleOnInsight(insight.id, e.value); }}
                />
                <ul className="mt-8 mb-8">
                    {insight.quotes.map((quote) =>
                        <li key={quote.id}>
                            <Quote
                                quote={quote}
                                onDelete={() => { deleteQuote(insight.id, quote.id, quote.highlight.pdfHighlightId ); }}
                            />
                        </li>
                    )}
                </ul>
                <JournalEditor
                    id={insight.id}
                    content={insight.journal}
                    onUpdate={(update: object) => { setJournalOnInsight(insight.id, update); }}
                />

            </div>
        </div>
    );
}