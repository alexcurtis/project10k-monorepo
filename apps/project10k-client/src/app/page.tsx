'use client';
import dynamic from "next/dynamic";
import React from 'react';
import { useQuery, gql } from "@apollo/client";
import { Loader } from '@vspark/catalyst/loader';

import { ApolloAppProvider } from '@/app/graphql';
import { Workspaces } from '@/app/workspaces';

import { IAccountQL } from './types/ql';

const Q_MY_ACCOUNT = gql`query getAccount {
    account(id: "66a29b1877ea446646e74718") {
      _id
      firstName
      lastName
      email
      workspaces {
        _id
        name
        updatedAt
      }
    }
}`;

// TODO - Move This T
function PageLoader() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <Loader />
        </div>
    )
}

function WorkspacesPage() {
    const { loading, error, data } = useQuery<IAccountQL>(Q_MY_ACCOUNT);
    if (loading || !data) { return (<PageLoader />); }
    const workspaces = data.account.workspaces;
    return (
        <div className="dark min-h-screen w-full bg-zinc-950">
            <div className="py-11">
                <header>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
                            {`${data.account.firstName}'s Workspaces`}
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <Workspaces workspaces={workspaces} />
                    </div>
                </main>
            </div>
        </div>
    )
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

