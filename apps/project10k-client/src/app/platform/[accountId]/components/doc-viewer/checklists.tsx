"use client";
import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Loader } from "@vspark/catalyst/loader";
import { Q_MY_ACCOUNT } from "@platform/graphql";
import { IAccountQL } from "@platform/types/ql";
import { CheckListComponent } from "@platform/checklists/treeview";
import { WorkspaceContext } from "@platform/context";
import { PlusIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { Button } from "@vspark/catalyst/button";
import Link from "next/link";

function PageLoader() {
    return (
        <div className="p-4">
            <Loader />
        </div>
    );
}

export function NoCheckLists({ accountId }: { accountId: string }) {
    return (
        <div className="mx-auto max-w-lg pt-24 mt-3">
            <div>
                <div className="text-center">
                    <ShieldCheckIcon className="text-center h-20 w-20 text-zinc-400 inline-block" />
                    <h2 className="mt-2 text-lg font-semibold leading-6 text-white">No Checklists</h2>
                    <p className="mt-1 text-base text-zinc-400 mb-4">
                        It looks like you haven’t created any checklists on your account.
                    </p>
                    <Link legacyBehavior={true} passHref href={`/platform/${accountId}/checklists`}>
                        <Button color="indigo">
                            <PlusIcon />
                            Create Checklist
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function CheckLists() {
    const workspaceContext = useContext(WorkspaceContext);
    const accountId = workspaceContext.workspace.account._id;
    // Account Query + Root Checklists
    const { loading, data } = useQuery<IAccountQL>(Q_MY_ACCOUNT, {
        variables: { id: accountId },
    });

    if (loading || !data) {
        return <PageLoader />;
    }

    const { checklists } = data.account;

    // Empty CheckLists Gate
    if (!checklists || checklists.length === 0) {
        return <NoCheckLists accountId={accountId} />;
    }

    return (
        <>
            <div className="p-4">
                <CheckListComponent editable={false} checklists={checklists} />
            </div>
        </>
    );
}
