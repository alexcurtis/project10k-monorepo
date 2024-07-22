'use client';
import dynamic from "next/dynamic";
import React from 'react';

import { ApolloAppProvider } from '@/app/graphql';
import { Workspaces } from '@/app/workspaces';


function WorkspacePage({ params }: { params: { workspaceId: string }}) {
    return (
        <div className="dark min-h-screen w-full bg-slate-700">
            <div className="bg-black">
                {params.workspaceId}
                <ApolloAppProvider>
                    <Workspaces />
                </ApolloAppProvider>
            </div>
        </div>
    );
}

// Turn Off SSR for Main App
export default dynamic(async () => WorkspacePage, { ssr: false });

