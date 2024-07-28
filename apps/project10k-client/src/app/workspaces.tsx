import { Button } from '@vspark/catalyst/button';
import { Badge } from '@vspark/catalyst/badge';
import { Loader } from '@vspark/catalyst/loader';
import Link from 'next/link';
import { format } from 'date-fns';

import { IWorkspace } from './types/entities';

function Workspace({ workspace }: { workspace: IWorkspace }) {
    return (
        <li className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                    <p className="text-lg font-semibold leading-6 text-white">
                        {workspace.name}
                    </p>
                    <Badge>
                        {'Complete'}
                    </Badge>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-base leading-5 text-zinc-400">
                    <p className="whitespace-nowrap">
                        Last updated on
                        <time dateTime={workspace.updatedAt}>
                            {' ' + format(workspace.updatedAt, 'Pp')}
                        </time>
                    </p>
                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                        <circle r={1} cx={1} cy={1} />
                    </svg>
                    <p className="truncate">{workspace.journals.length + ' Journals'}</p>
                </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
                <Link
                    legacyBehavior={true}
                    passHref
                    href={`/workspace/${workspace._id}`}>
                    <Button>
                        View Workspace
                    </Button>
                </Link>
            </div>
        </li>
    );
}

function WorkspacesLoader() {
    return (
        <div className="py-5">
            <Loader />
        </div>
    )
}

export function Workspaces({ workspaces }: { workspaces: IWorkspace[]}) {
    return (
        <ul role="list" className="divide-y divide-zinc-800">
            {workspaces.map((workspace: IWorkspace) => (
                <Workspace key={workspace._id} workspace={workspace} />
            ))}
        </ul>
    )
}