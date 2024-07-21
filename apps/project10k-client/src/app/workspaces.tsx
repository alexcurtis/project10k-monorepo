import { useQuery, gql } from "@apollo/client";

import { IWorkspace } from './types/entities';
import { IWorkspacesQL } from './types/ql';

const Q_ALL_WORKSPACES = gql`query {
    workspaces {
        id,
        name
    }
}`;

function Workspace(workspace: IWorkspace) {
    return (
        <li key={workspace.id}>
            {workspace.name}
        </li>
    );
}

export function Workspaces() {
    const { loading, error, data } = useQuery<IWorkspacesQL>(Q_ALL_WORKSPACES);
    console.log('data ', data);
    if (loading || !data) { return <p>Loading...</p>; }
    return (
        <ul>
            {data.workspaces.map((workspace: IWorkspace) => (
                <li key={workspace.id}>
                    {workspace.name}
                </li>
            ))}
        </ul>
    )
}