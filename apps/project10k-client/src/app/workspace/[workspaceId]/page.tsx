'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import { useQuery, gql } from '@apollo/client';

import { Loader } from '@vspark/catalyst/loader';
import { ApolloAppProvider } from '@/app/graphql';
import { IWorkspace } from '@/app/types/entities';
import { IWorkspaceQL } from '@/app/types/ql';

const Q_MY_WORKSPACE = gql`query GetWorkspace($id: String!) {
    workspace(id: $id){
        id,
        name,
        created_at,
        updated_at,
        companies {
            id, name
        }
    }
}`;

function Header({ name }: { name: string }) {
    return (
        <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h1 className="text-base font-semibold leading-7 text-white">{name}</h1>
        </header>
    );
}

function Content() {
    return (
        <></>
    );
}
function WorkspaceLayout({ workspaceId }: { workspaceId: string }) {
    const { loading, error, data } = useQuery<IWorkspaceQL>(Q_MY_WORKSPACE, {
        variables: { id: workspaceId }
    });
    if (loading || !data) { return (<Loader />); }
    const workspace = data.workspace;
    return (
        <>
            <Header name={workspace.name}/>
            <Content />
        </>
    );
}

function WorkspacePage({ params }: { params: { workspaceId: string } }) {
    return (
        <>
            <ApolloAppProvider>
                <WorkspaceLayout workspaceId={params.workspaceId} />
            </ApolloAppProvider>
        </>
    );
}

// Turn Off SSR for Main App
export default dynamic(async () => WorkspacePage, { ssr: false });