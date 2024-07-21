'use client';
import dynamic from "next/dynamic";
import React from 'react';
import Link from 'next/link';

import { ApolloAppProvider } from '@/app/graphql';
import { Workspaces } from '@/app/workspaces';


function WorkspacesPage() {
    return (
        <div className="dark flex flex-row min-h-screen bg-slate-700">
            <div className="bg-black">
                <ApolloAppProvider>
                    <Workspaces />
                    <Link href="/workspace/id">this page!</Link>
                </ApolloAppProvider>
            </div>
        </div>
    );
}

// Turn Off SSR for Main App
export default dynamic(async () => WorkspacesPage, { ssr: false });

