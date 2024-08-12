"use client";

import { useContext, useCallback } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { debounce } from "lodash";
import { Loader } from "@vspark/catalyst/loader";
import { BlockEditor } from "@vspark/block-editor/src/components/BlockEditor";
import { EditableText, EditableTextSubmitEvent } from "@vspark/catalyst/editable-text";

import { WorkspaceContext } from "@/app/context";
import { IJournalEntryQL } from "@/app/types/ql";
import { Citations } from "./citation/citations";
import { Citation, CitationNode } from "./citation/editor-extension";

import "@vspark/block-editor/src/app/editor.css";
import { CITATIONS_QL_RESPONSE } from "@/app/graphql";
import { ICitation } from "@/app/types/entities";

// How Often Editor Saves When Typing / Making Changes
const EDITOR_SAVE_DEBOUNCE = 500;

// Journal Update Mutation
const M_UPDATE_JOURNAL = gql`
    mutation UpdateJournalEntry($id: ID!, $name: String!) {
        updateJournal(id: $id, journal: { name: $name }) {
            _id
            name
        }
    }
`;

// Journal Entry Query - Entry Stored Seperatly from Journal (As can be big)
const Q_JOURNAL_ENTRY = gql`
    query GetJournalEntry($id: ID!) {
        journalEntry(id: $id) {
            _id
            content
        }
    }
`;

// Journal Entry Update Mutation
const M_UPDATE_JOURNAL_ENTRY = gql`
    mutation UpdateJournalEntry($id: ID!, $content: JSON!) {
        updateJournalEntry(id: $id, journalEntry: { content: $content }) {
            _id
            content
        }
    }
`;

// Citation Update Mutation
const M_UPDATE_CITATION_ON_JOURNAL = gql`
    mutation UpdateCitationOnJournal($id: ID!, $citation: InputCitation!) {
        updateCitationOnJournal(id: $id, citation: $citation) {
            _id
            ${CITATIONS_QL_RESPONSE}
        }
    }
`;

function WorkspaceHeader({
    journalName,
    workspaceName,
    onJournalNameChange,
}: {
    journalName: string;
    workspaceName: string;
    onJournalNameChange: (name: EditableTextSubmitEvent) => void;
}) {
    return (
        <div className="px-4 pt-3 pb-2">
            <h3 className="text-lg font-semibold leading-7 text-white">{workspaceName}</h3>
        </div>
    );
}

function JournalHeader({
    journalName,
    onJournalNameChange,
}: {
    journalName: string;
    onJournalNameChange: (name: EditableTextSubmitEvent) => void;
}) {
    return (
        <div className="mx-24 pt-12">
            <p className="text-4xl font-semibold text-white">
                <EditableText
                    placeholder="Placeholder"
                    value={journalName}
                    onSubmit={onJournalNameChange}
                    neverEmpty={true}
                />
            </p>
        </div>
    );
}

function JournalLoader() {
    return (
        <div className="p-4">
            <Loader />
        </div>
    );
}

// Block Editor Does Not Re-Render When Data Updated - Editor Is An Expensive Function
export function Journal() {
    console.log("Top Of Journal");
    const workspaceContext = useContext(WorkspaceContext);
    if (!workspaceContext) {
        return;
    }
    const { workspace } = workspaceContext;
    const activeJournalId = workspaceContext.activeJournal;

    // TODO - MAYBE PART OF THE CONTEXT? OR A STORE? - ZUTSU THINGY?
    const activeJournal = workspace.journals.find((journal) => {
        return journal._id === activeJournalId;
    });

    console.log("active journal (in journal render)", activeJournal);

    // If For Some (Strange) Reason No Active Journal. TODO - Make This An Error Gate
    if (!activeJournal) {
        return;
    }
    const journalEntry = activeJournal.journalEntry;

    // Query
    const { loading, error, data } = useQuery<IJournalEntryQL>(Q_JOURNAL_ENTRY, {
        variables: { id: journalEntry },
    });

    // Mutators
    const [updateJournal, {}] = useMutation(M_UPDATE_JOURNAL);
    const [updateJournalEntry, {}] = useMutation(M_UPDATE_JOURNAL_ENTRY);
    const [updateCitationOnJournal, {}] = useMutation(M_UPDATE_CITATION_ON_JOURNAL);

    const onJournalNameChangeCb = useCallback(
        ({ value }: EditableTextSubmitEvent) => {
            updateJournal({
                variables: {
                    id: activeJournal._id,
                    name: value,
                },
            });
        },
        [updateJournal, activeJournal]
    );

    // When Journal Entry Changes - Update
    const updateJournalEntryCb = useCallback(
        debounce((evnt) => {
            updateJournalEntry({
                variables: {
                    id: journalEntry,
                    content: evnt.editor.getJSON(),
                },
                ignoreResults: true,
            });
        }, EDITOR_SAVE_DEBOUNCE),
        [updateJournalEntry, journalEntry]
    );

    const onCitationDraggedOntoJournalCb = useCallback(
        (citation: ICitation) => {
            // Citation Was Dragged Onto Journal. Update Journal Citation
            console.log("CITATION DRAGGED ONTO JOURNAL", activeJournal, citation);
            updateCitationOnJournal({
                variables: {
                    id: activeJournal._id,
                    citation: {
                        _id: citation._id,
                        embeddedOnJournalEntry: true,
                    },
                },
            });
        },
        [activeJournal]
    );

    // Saftey Gate - If Loading or No Data
    if (loading || !data || !activeJournal) {
        return <JournalLoader />;
    }

    console.log("RENDERING JOURNAL", activeJournalId, data, "active journal name", activeJournal.name);
    return (
        <>
            <div className="flex flex-col h-full max-h-full">
                <WorkspaceHeader
                    workspaceName={workspace.name}
                    journalName={activeJournal.name}
                    onJournalNameChange={onJournalNameChangeCb}
                />
                <Citations citations={activeJournal.citations} onDragged={onCitationDraggedOntoJournalCb} />
                <JournalHeader journalName={activeJournal.name} onJournalNameChange={onJournalNameChangeCb} />
                <BlockEditor
                    content={data.journalEntry.content}
                    onUpdate={updateJournalEntryCb}
                    extensions={[Citation, CitationNode]}
                />
            </div>
        </>
    );
}
