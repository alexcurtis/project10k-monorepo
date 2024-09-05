"use client";
import dynamic from "next/dynamic";
import React from "react";
import { useQuery } from "@apollo/client";
import { BriefcaseIcon } from "@heroicons/react/24/solid";

import { Loader } from "@vspark/catalyst/loader";
import { Q_MY_ACCOUNT } from "@platform/graphql";
import { IAccountQL } from "@platform/types/ql";
import { CheckListComponent } from "./treeview";

function PageLoader() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <Loader />
        </div>
    );
}

function CheckLists({ accountId }: { accountId: string }) {
    // Account Query + Root Checklists
    const { loading, data } = useQuery<IAccountQL>(Q_MY_ACCOUNT, {
        variables: { id: accountId },
    });

    if (loading || !data) {
        return <PageLoader />;
    }

    const { checklists } = data.account;
    return (
        <>
            <CheckListComponent editable={true} checklists={checklists} />
        </>
    );
}

function TightLayoutHeader({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <header>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
                    <div className="lg:flex lg:items-center lg:justify-between">{children}</div>
                </div>
            </header>
        </>
    );
}

function TightLayoutContent({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <main>
                <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
            </main>
        </>
    );
}

function TightLayoutPage({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <div className="dark min-h-screen w-full bg-zinc-950 p-4">
                <div className="pt-20 pb-4">{children}</div>
            </div>
        </>
    );
}

function CheckListsPage({ params }: { params: { accountId: string } }) {
    return (
        <>
            <TightLayoutPage>
                <TightLayoutHeader>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
                            Checklists
                        </h2>
                        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                            <div className="mt-2 flex items-center text-sm text-gray-300">
                                <BriefcaseIcon
                                    aria-hidden="true"
                                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
                                />
                                Virtual Spark Ltd
                            </div>
                        </div>
                    </div>
                </TightLayoutHeader>
                <TightLayoutContent>
                    <CheckLists accountId={params.accountId} />
                </TightLayoutContent>
            </TightLayoutPage>
        </>
    );
}

// Turn Off SSR for Main App
export default dynamic(async () => CheckListsPage, { ssr: false });
