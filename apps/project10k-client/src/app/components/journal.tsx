'use client';

import { useContext, useCallback } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { debounce } from 'lodash';
import { Loader } from '@vspark/catalyst/loader';
import { BlockEditor } from '@vspark/block-editor/src/components/BlockEditor';
import { EditableText } from '@vspark/catalyst/editable-text';

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { WorkspaceContext } from '@/app/context';
import {
    IWorkspaceQL,
    IJournalML,
    IJournalEntryQL
} from '@/app/types/ql';

import '@vspark/block-editor/src/app/editor.css';

// How Often Editor Saves When Typing / Making Changes
const EDITOR_SAVE_DEBOUNCE = 500;

const Q_JOURNAL_ENTRY = gql`query GetJournalEntry($id: ID!) {
    journalEntry(id: $id){
        _id
        content
    }
}`;

// Journal Entry Update Query
const M_UPDATE_JOURNAL_ENTRY = gql`mutation UpdateJournalEntry($id: ID!, $content: JSON!) {
    updateJournalEntry(
        id: $id,
        journalEntry: {
      	    content: $content
        }
    ){
        _id
        content
    }
}
`

function JournalHeader() {
    return (
        <div className="px-4 py-2 bg-zinc-900 dark:text-white">
            <h2 className="text-lg">
                <EditableText
                    placeholder="Placeholder"
                    value="Journal Name"
                />
            </h2>
        </div>
    )
}

function JournalLoader() {
    return (
        <div className="p-4">
            <Loader />
        </div>
    )
}


// Block Editor Does Not Re-Render When Data Updated - Editor Is An Expensive Function
export function Journal() {
    const workspaceContext = useContext(WorkspaceContext);
    if (!workspaceContext) { return; }
    const activeJournalId = workspaceContext.activeJournal;

    const activeJournal = workspaceContext.workspace.journals.find((journal) => {
        return journal._id === activeJournalId;
    })

    const journalEntry = activeJournal?.journalEntry;

    console.log('activeJournalId', activeJournalId, journalEntry);
    const { loading, error, data } = useQuery<IJournalEntryQL>(Q_JOURNAL_ENTRY, {
        variables: { id: journalEntry }
    });

    const [updateJournalEntry, { }] = useMutation(M_UPDATE_JOURNAL_ENTRY, {
        ignoreResults: true, // Ensures The Editor Does Not Get Re-Rendered When Editor Updated
    });

    const updateJournalEntryCb = useCallback(debounce((evnt) => {
        console.log('updating with ', evnt.editor.getJSON());
        updateJournalEntry({
            variables: {
                id: journalEntry,
                content: evnt.editor.getJSON()
            },
            ignoreResults: true
        })
    }, EDITOR_SAVE_DEBOUNCE), [journalEntry]);


    if (loading || !data) { return (<JournalLoader />); }
    console.log('RENDERING JOURNAL', activeJournalId, data);
    return (
        <>
            <div className="flex flex-col h-full max-h-full">
                <JournalHeader />
                <BlockEditor
                    initialContent={data.journalEntry.content}
                    onUpdate={updateJournalEntryCb}
                />
            </div>
        </>
    )
}


