"use client";
import dynamic from "next/dynamic";
import { useQuery } from "@apollo/client";

import { Loader } from "@vspark/catalyst/loader";
import { Sidebar } from "@platform/sidebar";
import { Q_MY_ACCOUNT, ApolloAppProvider } from "@platform/graphql";
import { IAccountQL } from "@platform/types/ql";

function PageLoader() {
    return (
        <div className="m-4">
            <Loader />
        </div>
    );
}

export function Account({ accountId, children }: { accountId: string; children: React.ReactNode }) {
    // Account Query
    const { loading, error, data } = useQuery<IAccountQL>(Q_MY_ACCOUNT, {
        variables: { id: accountId },
    });

    if (loading || !data) {
        return <PageLoader />;
    }

    return (
        <div className="h-screen">
            <Sidebar user={data.me} account={data.account} />
            <div className="min-h-full h-full max-h-full xl:pl-48">
                <main className="flex flex-col min-h-full h-full max-h-full">{children}</main>
            </div>
        </div>
    );
}

export function Platform({ params, children }: { params: { accountId: string }; children: React.ReactNode }) {
    return (
        <div className="h-screen">
            <ApolloAppProvider>
                <Account accountId={params.accountId}>
                    <div className="min-h-full h-full max-h-full">
                        <main className="flex flex-col min-h-full h-full max-h-full">{children}</main>
                    </div>
                </Account>
            </ApolloAppProvider>
        </div>
    );
}

// Turn Off SSR for Main App
export default dynamic(async () => Platform, { ssr: false });
