import { useQuery, gql } from "@apollo/client";
import { Button } from '@vspark/catalyst/button';
import { Badge } from '@vspark/catalyst/badge';
import { Loader } from '@vspark/catalyst/loader';
import Link from 'next/link';
import { format } from 'date-fns';

import { IWorkspace } from './types/entities';
import { IWorkspacesQL } from './types/ql';



const Q_MY_WORKSPACES = gql`query GetMyWorkspaces{
    workspaces{
        id,
        name,
        created_at,
        updated_at,
        companies {
            id, name
        }
    }
}`;

function Workspace({ workspace }: { workspace: IWorkspace }) {
    return (
        <li className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                    <p className="text-sm font-semibold leading-6 text-white">
                        {workspace.name}
                    </p>
                    <Badge>
                    {'Complete'}
                    </Badge>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-zinc-400">
                    <p className="whitespace-nowrap">
                        Last updated on 
                        <time dateTime={workspace.updated_at}>
                            {' ' + format(workspace.updated_at, 'Pp')}
                        </time>
                    </p>
                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                        <circle r={1} cx={1} cy={1} />
                    </svg>
                    <p className="truncate">Created by {'Alexander Curtis'}</p>
                </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
                <Link
                    legacyBehavior={true}
                    passHref
                    href={`/workspace/${workspace.id}`}>
                    <Button>
                        View Workspace
                    </Button>
                </Link>
            </div>
        </li>
    );
}

export function Workspaces() {
    const { loading, error, data } = useQuery<IWorkspacesQL>(Q_MY_WORKSPACES);
    if (loading || !data) { return <Loader/>; }
    return (
        <ul role="list" className="divide-y divide-zinc-800">
            {data.workspaces.map((workspace: IWorkspace) => (
                <Workspace key={workspace.id} workspace={workspace} />
            ))}
        </ul>
    )
}