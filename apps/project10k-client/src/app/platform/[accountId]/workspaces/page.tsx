"use client";
import dynamic from "next/dynamic";
import React, { useCallback, useState } from "react";
import { useQuery } from "@apollo/client";
import { PlusIcon } from "@heroicons/react/24/solid";

import { Loader } from "@vspark/catalyst/loader";
import { Button } from "@vspark/catalyst/button";

import { Q_MY_ACCOUNT } from "@platform/graphql";
import { IAccountQL } from "@platform/types/ql";
import { Workspaces } from "./workspaces";
import { BriefcaseIcon } from "@heroicons/react/20/solid";

function PageLoader() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <Loader />
        </div>
    );
}

function WorkspacesPage({ accountId }: { accountId: string }) {
    const [newWorkspace, setNewWorkspace] = useState(false);

    // Account Query + Workspaces
    const { loading, error, data } = useQuery<IAccountQL>(Q_MY_ACCOUNT, {
        variables: { id: accountId },
    });

    const onNewWorkspaceCancelCb = useCallback(() => {
        setNewWorkspace(false);
    }, [setNewWorkspace]);

    if (loading || !data) {
        return <PageLoader />;
    }
    const { account, me } = data;
    const workspaces = account.workspaces;
    return (
        <div className="dark min-h-screen w-full bg-zinc-950">
            <div className="pt-20 pb-4">
                <header>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
                        <div className="lg:flex lg:items-center lg:justify-between">
                            <div className="min-w-0 flex-1">
                                <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
                                    {`${me.firstName}'s Workspaces`}
                                </h2>
                                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                                    <div className="mt-2 flex items-center text-sm text-gray-300">
                                        <BriefcaseIcon
                                            aria-hidden="true"
                                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
                                        />
                                        {account.name}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 flex lg:ml-4 lg:mt-0">
                                <Button
                                    className="flex-node"
                                    color="indigo"
                                    disabled={newWorkspace}
                                    onClick={() => {
                                        setNewWorkspace(true);
                                    }}
                                >
                                    <PlusIcon />
                                    Add New Workspace
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-8">
                        <Workspaces
                            accountId={data.account._id}
                            workspaces={workspaces}
                            newWorkspace={newWorkspace}
                            onNewWorkspaceCancel={onNewWorkspaceCancelCb}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

function Page({ params }: { params: { accountId: string } }) {
    return (
        <>
            <div className="dark min-h-screen w-full bg-zinc-950">
                <WorkspacesPage accountId={params.accountId} />
            </div>
        </>
    );
}

// Turn Off SSR for Main App
export default dynamic(async () => Page, { ssr: false });
