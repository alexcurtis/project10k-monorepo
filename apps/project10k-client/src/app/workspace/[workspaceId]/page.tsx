'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import { useQuery, gql } from '@apollo/client';

import { Loader } from '@vspark/catalyst/loader';

import { ApolloAppProvider } from '@/app/graphql';
import { IWorkspace } from '@/app/types/entities';
import { IWorkspaceQL } from '@/app/types/ql';

const Q_MY_WORKSPACE = gql`query {
    workspace(id: "254627db-8666-4926-8a40-ccc19858c1eb"){
        id,
        name,
        created_at,
        updated_at,
        companies {
            id, name
        }
    }
}`;

function WorkspaceFramework({ workspaceId }: { workspaceId: string }) {
    const { loading, error, data } = useQuery<IWorkspaceQL>(Q_MY_WORKSPACE, {
        variables: { id: workspaceId }
      });
    if (loading || !data) { return (<Loader />); }
    const workspace = data.workspace;
    return (
        <div className="py-5">
            {workspace.name}
        </div>
    );
}

function WorkspacePage({ params }: { params: { workspaceId: string } }) {
    return (
        <div className="dark min-h-screen w-full bg-zinc-950">
            <div className="py-10">
                <header>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
                            {params.workspaceId}
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <ApolloAppProvider>
                            <WorkspaceFramework workspaceId={params.workspaceId} />
                        </ApolloAppProvider>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Turn Off SSR for Main App
export default dynamic(async () => WorkspacePage, { ssr: false });