'use client';

import { useContext, useCallback } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { debounce } from 'lodash';
import { Loader } from '@vspark/catalyst/loader';
import { BlockEditor } from '@vspark/block-editor/src/components/BlockEditor';
import { EditableText, EditableTextSubmitEvent } from '@vspark/catalyst/editable-text';

import { WorkspaceContext } from '@/app/context';
import {
    IWorkspaceQL,
    IJournalML,
    IJournalEntryQL
} from '@/app/types/ql';

import '@vspark/block-editor/src/app/editor.css';

// How Often Editor Saves When Typing / Making Changes
const EDITOR_SAVE_DEBOUNCE = 500;


// Journal Update Mutation
const M_UPDATE_JOURNAL = gql`mutation UpdateJournalEntry($id: ID!, $name: String!) {
    updateJournal(
        id: $id,
        journal: {
            name: $name
        }
    ){
        _id
        name
    }
}
`

// Journal Entry Query - Entry Stored Seperatly from Journal (As can be big)
const Q_JOURNAL_ENTRY = gql`query GetJournalEntry($id: ID!) {
    journalEntry(id: $id){
        _id
        content
    }
}`;

// Journal Entry Update Mutation
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


function JournalHeader({ name, onNameChange } : { name: string, onNameChange: (name: EditableTextSubmitEvent) => void }) {
    console.log('rendering header');
    return (
        <div className="px-4 py-2 bg-zinc-900 dark:text-white">
            <h2 className="text-lg">
                <EditableText
                    placeholder="Placeholder"
                    value={name}
                    onSubmit={onNameChange}
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

    // If For Some (Strange) Reason No Active Journal. TODO - Make This An Error Gate
    if(!activeJournal){ return; }
    const journalEntry = activeJournal.journalEntry;

    // Query
    const { loading, error, data } = useQuery<IJournalEntryQL>(Q_JOURNAL_ENTRY, {
        variables: { id: journalEntry }
    });

    // Mutators
    const [updateJournal, { }] = useMutation(M_UPDATE_JOURNAL, {
        // No Need To Update Locally As Journal Is Used For MindMap As Well. Best To Let Workspace Update
        ignoreResults: true
    });

    const [updateJournalEntry, { }] = useMutation(M_UPDATE_JOURNAL_ENTRY, {
        // Ensures The Editor Does Not Get Re-Rendered When Editor Updated
        ignoreResults: true
    });

    const onNameChangeCb = useCallback(({ value }: EditableTextSubmitEvent) => {
        updateJournal({
            variables: {
                id: activeJournal._id,
                name: value
            }
        })
    }, [updateJournal, activeJournal]);

    // When Journal Entry Changes - Update 
    const updateJournalEntryCb = useCallback(debounce((evnt) => {
        updateJournalEntry({
            variables: {
                id: journalEntry,
                content: evnt.editor.getJSON()
            },
            ignoreResults: true
        })
    }, EDITOR_SAVE_DEBOUNCE), [updateJournalEntry, journalEntry]);

     // Saftey Gate - If Loading or No Data
     if (loading || !data || !activeJournal) { return (<JournalLoader />); }

    console.log('RENDERING JOURNAL', activeJournalId, data);
    return (
        <>
            <div className="flex flex-col h-full max-h-full">
                <JournalHeader
                    name={activeJournal.name}
                    onNameChange={onNameChangeCb}
                />
                <BlockEditor
                    initialContent={data.journalEntry.content}
                    onUpdate={updateJournalEntryCb}
                />
            </div>
        </>
    )
}


