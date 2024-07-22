'use client';
import dynamic from "next/dynamic";
import React from 'react';

import { ApolloAppProvider } from '@/app/graphql';

function WorkspacePage({ params }: { params: { workspaceId: string }}) {
    return (
        <div className="dark min-h-screen w-full bg-zinc-950">
            <div className="bg-black">
                {params.workspaceId}
                {/* <ApolloAppProvider>
                </ApolloAppProvider> */}
            </div>
        </div>
    );
}

// Turn Off SSR for Main App
export default dynamic(async () => WorkspacePage, { ssr: false });

