"use client";
import dynamic from "next/dynamic";
import React, { useCallback, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Loader } from "@vspark/catalyst/loader";
import { Button } from "@vspark/catalyst/button";

import { Q_MY_ACCOUNT, ApolloAppProvider } from "@/app/graphql";
import { Workspaces } from "@/app/workspaces";

import { IAccountQL } from "./types/ql";
import { PlusIcon } from "@heroicons/react/24/solid";

// TODO - Move This T
function PageLoader() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <Loader />
        </div>
    );
}

function WorkspacesPage() {
    const [newWorkspace, setNewWorkspace] = useState(false);

    // Account Query + Workspaces
    const { loading, error, data } = useQuery<IAccountQL>(Q_MY_ACCOUNT);

    const onNewWorkspaceCancelCb = useCallback(() => {
        setNewWorkspace(false);
    }, [setNewWorkspace]);

    if (loading || !data) {
        return <PageLoader />;
    }
    const workspaces = data.account.workspaces;
    return (
        <div className="dark min-h-screen w-full bg-zinc-950">
            <div className="py-11">
                <header>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight text-white flex-grow">
                            {`${data.account.firstName}'s Workspaces`}
                        </h1>
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
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

function Page() {
    return (
        <>
            <div className="dark min-h-screen w-full bg-zinc-950">
                <div className="py-10">
                    <ApolloAppProvider>
                        <WorkspacesPage />
                    </ApolloAppProvider>
                </div>
            </div>
        </>
    );
}

// Turn Off SSR for Main App
export default dynamic(async () => Page, { ssr: false });
