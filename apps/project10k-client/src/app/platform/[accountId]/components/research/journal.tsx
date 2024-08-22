"use client";

import { useContext, useCallback } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { debounce } from "lodash";

import { Loader } from "@vspark/catalyst/loader";
import { BlockEditor } from "@vspark/block-editor/src/components/BlockEditor";
import { EditableText, EditableTextSubmitEvent } from "@vspark/catalyst/editable-text";
import { InlineError } from "@vspark/catalyst/inline-alerts";

import { WorkspaceContext } from "@platform/context";
import { IJournalQL } from "@platform/types/ql";
import { JOURNAL_ENTRY_QL_RESPONSE, JOURNAL_FULLFAT_QL_RESPONSE } from "@platform/graphql";
import { IJournal, IWorkspace } from "@platform/types/entities";

import { Citation, CitationNode } from "./citation/editor-extension";
import { EmptyJournal } from "./empty";

import "@vspark/block-editor/src/app/editor.css";

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
const Q_JOURNAL_FULLFAT = gql`
    query GetJournalFullFat($id: ID!) {
        journal(id: $id)
            ${JOURNAL_FULLFAT_QL_RESPONSE}
    }
`;

// Journal Entry Update Mutation
const M_UPDATE_JOURNAL_ENTRY = gql`
    mutation UpdateJournalEntry($id: ID!, $content: JSON!) {
        updateJournalEntry(id: $id, journalEntry: { content: $content })
            ${JOURNAL_ENTRY_QL_RESPONSE}
    }
`;

function WorkspaceHeader({ workspaceName }: { workspaceName: string }) {
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

function JournalEditor({ journal }: { journal: IJournal }) {
    // Mutators
    const [updateJournal, { error: journalError }] = useMutation(M_UPDATE_JOURNAL);
    const [updateJournalEntry, { error: journalEntryError }] = useMutation(M_UPDATE_JOURNAL_ENTRY);

    const onJournalNameChangeCb = useCallback(
        ({ value }: EditableTextSubmitEvent) => {
            updateJournal({
                variables: {
                    id: journal._id,
                    name: value,
                },
            });
        },
        [updateJournal, journal]
    );

    // When Journal Entry Changes - Update
    const updateJournalEntryCb = useCallback(
        debounce((evnt) => {
            updateJournalEntry({
                variables: {
                    id: journal.journalEntry._id,
                    content: evnt.editor.getJSON(),
                },
                ignoreResults: true,
            });
        }, EDITOR_SAVE_DEBOUNCE),
        [updateJournalEntry, journal]
    );

    const errors = [];
    if (journalError) {
        errors.push({ message: "The property change failed to save" });
    }
    if (journalEntryError) {
        errors.push({ message: "The document change failed to save" });
    }

    return (
        <>
            <JournalHeader journalName={journal.name} onJournalNameChange={onJournalNameChangeCb} />
            {errors.length > 0 ? (
                <InlineError
                    className="mx-24 mt-4"
                    headline={`There was a problem saving the Journal: ${journal.name}`}
                    errors={errors}
                />
            ) : null}
            <BlockEditor
                content={journal.journalEntry.content}
                onUpdate={updateJournalEntryCb}
                extensions={[Citation, CitationNode]}
            />
        </>
    );
}

function JournalContainer({ activeJournal }: { activeJournal: IJournal }) {
    // Full Fat Journal Query
    const { loading, error, data } = useQuery<IJournalQL>(Q_JOURNAL_FULLFAT, {
        variables: { id: activeJournal._id },
    });

    // Saftey Gate - If Loading or No Data
    if (loading || !data) {
        return <JournalLoader />;
    }

    const journal = data.journal;
    return <JournalEditor journal={journal} />;
}

// Block Editor Does Not Re-Render When Data Updated - Editor Is An Expensive Function
export function Journal() {
    const workspaceContext = useContext(WorkspaceContext);
    if (!workspaceContext) {
        return;
    }
    const { workspace } = workspaceContext;
    const activeJournalId = workspaceContext.activeJournal;

    const activeJournal = workspace.journals.find((journal) => {
        return journal._id === activeJournalId;
    });

    return (
        <div className="flex flex-col h-full max-h-full">
            <WorkspaceHeader workspaceName={workspace.name} />
            {activeJournal ? <JournalContainer activeJournal={activeJournal} /> : <EmptyJournal />}
        </div>
    );
}
