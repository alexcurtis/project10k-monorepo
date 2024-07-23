import { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Loader } from '@vspark/catalyst/loader';

import { WorkspaceContext } from '@/app/context';
import { IWorkspaceQL } from '@/app/types/ql';

const Q_MY_WORKSPACE_JOURNAL  = gql`query GetWorkspaceJournal($id: String!) {
    workspace(id: $id){
        name
    }
}`;

export function Journal(){
    const workspace = useContext(WorkspaceContext);
    const { loading, error, data } = useQuery<IWorkspaceQL>(Q_MY_WORKSPACE_JOURNAL, {
        variables: { id: workspace.id }
    });
    return (
        <div className='py-5'>
            Journal <div>{data.workspace.name}</div>
        </div>
    )
}


