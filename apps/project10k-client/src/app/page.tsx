'use client';
import dynamic from "next/dynamic";
import React from 'react';

import { ApolloAppProvider } from '@/app/graphql';
import { Workspaces } from '@/app/workspaces';


function WorkspacesPage() {
    return (
        <div className="dark min-h-screen w-full bg-zinc-950">
            <div className="py-10">
                <header>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
                            Workspaces
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <ApolloAppProvider>
                            <Workspaces />
                        </ApolloAppProvider>
                    </div>
                </main>
            </div>



        </div>
    );
}

// Turn Off SSR for Main App
export default dynamic(async () => WorkspacesPage, { ssr: false });

