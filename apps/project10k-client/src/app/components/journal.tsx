'use client';

import { useContext, useCallback } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Loader } from '@vspark/catalyst/loader';
import { BlockEditor } from '@vspark/block-editor/src/components/BlockEditor';


import { Button } from '@vspark/catalyst/button';

import { WorkspaceContext } from '@/app/context';
import { IWorkspaceQL, IJournalML } from '@/app/types/ql';

const Q_MY_WORKSPACE_WITH_JOURNAL = gql`query GetWorkspaceJournal($id: String!) {
    workspace(id: $id, withJournal: true){
        name,
        journal {
            id,
            content
        }
    }
}`;

const M_UPDATE_JOURNAL = gql`mutation GetWorkspaceJournal($id: String!, $content: String!) {
    updateJournal(
      journal: {id: $id, content: $content}
    ) {
      id
      content
    }
  }
`

export function Journal() {
    const { id } = useContext(WorkspaceContext);
    const { loading, error, data } = useQuery<IWorkspaceQL>(Q_MY_WORKSPACE_WITH_JOURNAL, {
        variables: { id: id }
    });
    // const [updateJournal] = useMutation(M_UPDATE_JOURNAL, {
    //     ignoreResults: true, // Ensures The Editor Does Not Get Re-Rendered When Editor Updated
    // });
    const updateJournalCb = useCallback((evnt) => {
        // const json = JSON.stringify(evnt.editor.getJSON());
        // console.log('updating with ', {
        //     id: data?.workspace.journal.id,
        //     content: json
        // });
        // updateJournal({
        //     variables: {
        //         id: data?.workspace.journal.id,
        //         content: json
        //     }
        // })
    }, [data]);

    console.log('RENDERING JOURNAL', id, data);
    if (loading || !data) { return (<Loader />); }
    const journal = data.workspace.journal;
    const contentJson = JSON.parse(journal.content);
    return (
        <div className='py-5'>
            <BlockEditor
                initialContent={contentJson}
                onUpdate={updateJournalCb}
            />
        </div>
    )
}


