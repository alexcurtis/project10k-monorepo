import { Button } from "@vspark/catalyst/button";
import { Badge } from "@vspark/catalyst/badge";
import { Loader } from "@vspark/catalyst/loader";
import Link from "next/link";
import { format } from "date-fns";
import { Fieldset, FieldGroup, Field, Label } from "@vspark/catalyst/fieldset";
import { Input } from "@vspark/catalyst/input";

import { IWorkspace } from "./types/entities";
import { CubeIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useCallback, useState } from "react";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem, DropdownLabel } from "@vspark/catalyst/dropdown";
import { DeleteGateway, IDeleteGateway } from "@vspark/catalyst/common-dialogs";

import { gql, useMutation } from "@apollo/client";
import { Q_MY_ACCOUNT, ACCOUNT_QL_RESPONSE } from "./graphql";
import { TrashIcon } from "@heroicons/react/24/solid";

// Workspace Create Mutation
const M_CREATE_WORKSPACE_ON_ACCOUNT = gql`
    mutation CreateWorkspaceOnAccount($id: ID!, $workspace: InputWorkspaceDto!) {
        createWorkspaceOnAccount(id: $id, workspace: $workspace) ${ACCOUNT_QL_RESPONSE}
    }
`;

// Workspace Delete Mutation
const M_DELETE_WORKSPACE = gql`
    mutation DeleteWorkspaceOnAccount($id: ID!, $workspaceId: ID!) {
        deleteWorkspaceOnAccount(id: $id, workspaceId: $workspaceId) {
            _id
        }
    }
`;

export function OptionsButton() {
    return (
        <>
            <EllipsisVerticalIcon className="stroke-white h-20 w-20" />
        </>
    );
}

function Workspace({ workspace, onDelete }: { workspace: IWorkspace; onDelete: (w: IWorkspace) => void }) {
    return (
        <li className="flex items-center justify-between gap-x-6 p-4">
            <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                    <p className="text-lg font-semibold leading-6 text-white">{workspace.name}</p>
                    <Badge>{"Complete"}</Badge>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-base leading-5 text-zinc-400">
                    <p className="whitespace-nowrap">
                        Last updated on
                        <time dateTime={workspace.updatedAt}>{" " + format(workspace.updatedAt, "Pp")}</time>
                    </p>
                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                        <circle r={1} cx={1} cy={1} />
                    </svg>
                    <p className="truncate">{workspace.journals.length + " Journals"}</p>
                </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
                <Link legacyBehavior={true} passHref href={`/workspace/${workspace._id}`}>
                    <Button>View Workspace</Button>
                </Link>
            </div>
            <Dropdown>
                <DropdownButton plain aria-label="More options" className="h-24 w-24 p-0">
                    <EllipsisVerticalIcon className="stroke-white h-20 w-20" />
                </DropdownButton>
                <DropdownMenu>
                    <DropdownItem onClick={() => onDelete(workspace)}>
                        <TrashIcon />
                        <DropdownLabel>Delete</DropdownLabel>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </li>
    );
}

function WorkspacesLoader() {
    return (
        <div className="py-5">
            <Loader />
        </div>
    );
}

function NewWorkspace({
    accountId,
    onCancel,
    onWorkspaceCreated,
}: {
    accountId: string;
    onCancel: () => void;
    onWorkspaceCreated: () => void;
}) {
    // Create Workspace Mutator
    const [createWorkspaceOnAccount, { data, loading, error }] = useMutation(M_CREATE_WORKSPACE_ON_ACCOUNT);
    const [name, setName] = useState("");

    return (
        <div className="rounded-sm border-2 border-dashed border-zinc-800 my-4 p-4 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
            <form
                className="flex"
                action={() => {
                    createWorkspaceOnAccount({
                        variables: {
                            id: accountId,
                            workspace: {
                                name: name,
                            },
                        },
                        onCompleted: onWorkspaceCreated,
                    });
                }}
            >
                <Fieldset className="flex-grow">
                    <FieldGroup>
                        <Field>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Create a new Workspace"
                                name="workspace_name"
                                autoFocus
                            />
                        </Field>
                    </FieldGroup>
                </Fieldset>
                <Fieldset className="flex-none">
                    <Button type="button" className="ml-4 align-top" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading || name === ""} className="ml-2 align-top" color="indigo">
                        <CubeIcon className={`${loading ? "animate-spin" : ""}`} />
                        Create
                    </Button>
                </Fieldset>
            </form>
        </div>
    );
}

export function Workspaces({
    accountId,
    workspaces,
    newWorkspace,
    onNewWorkspaceCancel,
}: {
    accountId: string;
    workspaces: IWorkspace[];
    newWorkspace: boolean;
    onNewWorkspaceCancel: () => void;
}) {
    const [deleteWorkspaceGateway, setDeleteWorkspaceGateway] = useState<IDeleteGateway>({
        name: "",
        isOpen: false,
        deleteAction: () => {},
    });

    // Mutators
    const [deleteWorkspaceOnAccount, {}] = useMutation(M_DELETE_WORKSPACE, {
        update(cache, { data: { deleteWorkspaceOnAccount } }) {
            // After Workspace Removed Update The Cache Account Query
            const { account } = cache.readQuery({ query: Q_MY_ACCOUNT });
            const workspaces = account.workspaces.filter((workspace) => workspace._id !== deleteWorkspaceOnAccount._id);
            const accountWithUpdatedWorkspaces = { ...account, workspaces };
            cache.writeQuery({
                query: Q_MY_ACCOUNT,
                data: { account: accountWithUpdatedWorkspaces },
            });
        },
    });

    const deleteWorkspaceCb = useCallback(
        (workspace: IWorkspace) => {
            setDeleteWorkspaceGateway({
                name: workspace.name,
                isOpen: true,
                deleteAction: () => {
                    deleteWorkspaceOnAccount({
                        variables: {
                            id: "66a6502936a423235f97625f",
                            workspaceId: workspace._id,
                        },
                    });
                },
            });
        },
        [setDeleteWorkspaceGateway, deleteWorkspaceOnAccount]
    );

    return (
        <>
            <DeleteGateway
                title="Delete Workspace"
                entity="Workspace"
                gateway={deleteWorkspaceGateway}
                setDeleteGateway={setDeleteWorkspaceGateway}
            />
            <ul role="list" className="divide-y divide-zinc-800">
                {newWorkspace ? (
                    <NewWorkspace
                        accountId={accountId}
                        onCancel={onNewWorkspaceCancel}
                        onWorkspaceCreated={onNewWorkspaceCancel}
                    />
                ) : null}
                {workspaces.map((workspace: IWorkspace) => (
                    <Workspace key={workspace._id} workspace={workspace} onDelete={deleteWorkspaceCb} />
                ))}
            </ul>
        </>
    );
}
