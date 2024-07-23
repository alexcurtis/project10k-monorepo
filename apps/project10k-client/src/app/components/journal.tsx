'use client';

import { useContext, useCallback } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { debounce } from 'lodash';
import { Loader } from '@vspark/catalyst/loader';
import { BlockEditor } from '@vspark/block-editor/src/components/BlockEditor';


import { Button } from '@vspark/catalyst/button';

import { WorkspaceContext } from '@/app/context';
import { IWorkspaceQL, IJournalML } from '@/app/types/ql';

// How Often Editor Saves When Typing / Making Changes
const EDITOR_SAVE_DEBOUNCE = 500;

const Q_MY_WORKSPACE_WITH_JOURNAL = gql`query GetWorkspaceJournal($id: String!) {
    workspace(id: $id, withJournal: true){
        name,
        journal {
            id,
            content
        }
    }
}`;

// Journal Update Query - Only Return ID, So The Mutator Doesn't Drive A Re-Render
const M_UPDATE_JOURNAL = gql`mutation UpdateJournal($id: String!, $content: String!) {
    updateJournal(
      journal: {id: $id, content: $content}
    ) {
        id,
        content
    }
  }
`

// Block Editor Does Not Re-Render When Data Updated - Editor Is An Expensive Function
export function Journal() {

    console.log('re-rendering journal!!!');
    const { id } = useContext(WorkspaceContext);
    const { loading, error, data } = useQuery<IWorkspaceQL>(Q_MY_WORKSPACE_WITH_JOURNAL, {
        variables: { id: id }
    });
    const [updateJournal, {}] = useMutation(M_UPDATE_JOURNAL, {
        ignoreResults: true, // Ensures The Editor Does Not Get Re-Rendered When Editor Updated
    });
    const updateJournalCb = useCallback(debounce((evnt) => {
        const json = JSON.stringify(evnt.editor.getJSON());
        console.log('updating with ', {
            id: data?.workspace.journal.id,
            content: json
        });
        updateJournal({
            variables: {
                id: data?.workspace.journal.id,
                content: json
            },
            ignoreResults: true
        })
    }, EDITOR_SAVE_DEBOUNCE), [data]);

    if (loading || !data) { return (<Loader />); }
    const journal = data.workspace.journal;
    const contentJson = JSON.parse(journal.content);
    console.log('RENDERING JOURNAL', id, data);
    return (
        <div className='py-5'>
            <BlockEditor
                initialContent={contentJson}
                onUpdate={updateJournalCb}
            />
        </div>
    )
}


