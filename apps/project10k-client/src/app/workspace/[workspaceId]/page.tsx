'use client';
import dynamic from 'next/dynamic';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useQuery, gql } from '@apollo/client';

import { Loader } from '@vspark/catalyst/loader';
import { ApolloAppProvider } from '@/app/graphql';
import { IWorkspaceQL } from '@/app/types/ql';

import { WorkspaceContext } from '@/app/context';
import { Journal } from '@/app/components/journal';

const Q_MY_WORKSPACE = gql`query GetWorkspace($id: String!) {
    workspace(id: $id, withJournal: false){
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
        <header className="flex items-center justify-between border-b border-white/5 p-4">
            <h1 className="text-lg font-semibold leading-7 text-white">{name}</h1>
        </header>
    );
}

const MIN_PANEL_SIZE = 10;

function ContentPanels() {
    return (
        <>
            <PanelGroup
                autoSaveId="layout-h-persistence"
                direction="horizontal"
                >
                <Panel minSize={MIN_PANEL_SIZE}>
                    <PanelGroup
                        autoSaveId="layout-v-persistence"
                        direction="vertical"
                        >
                        <Panel minSize={MIN_PANEL_SIZE}>
                            <Journal/>
                        </Panel>
                        <PanelResizeHandle className="h-1 bg-white/5" />
                        <Panel
                            minSize={MIN_PANEL_SIZE}
                            defaultSize={40}
                            >
                            {'panel 2'}
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle className="w-1 bg-white/5" />
                <Panel minSize={MIN_PANEL_SIZE}>
                    {'panel 3'}
                </Panel>
            </PanelGroup>
        </>
    );
}
function WorkspaceLayout({ workspaceId }: { workspaceId: string }) {
    const { loading, error, data } = useQuery<IWorkspaceQL>(Q_MY_WORKSPACE, {
        variables: { id: workspaceId }
    });
    if (loading || !data) { return (<Loader />); }
    const workspace = data.workspace;
    console.log('rendering workspace layout');
    return (
        <>
            <Header name={workspace.name} />
            <WorkspaceContext.Provider value={{ id: workspaceId }}>
                <ContentPanels />
            </WorkspaceContext.Provider>
        </>
    );
}

function WorkspacePage({ params }: { params: { workspaceId: string } }) {
    console.log('rendering workspace page');
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


// 'use client';
// import dynamic from 'next/dynamic';
// import { useQuery, gql } from '@apollo/client';

// import { Loader } from '@vspark/catalyst/loader';
// import { ApolloAppProvider } from '@/app/graphql';
// import { IWorkspaceQL } from '@/app/types/ql';

// import { WorkspaceContext } from '@/app/context';
// import { Journal } from '@/app/components/journal';

// const Q_MY_WORKSPACE = gql`query GetWorkspace($id: String!) {
//     workspace(id: $id, withJournal: false){
//         id,
//         name,
//         created_at,
//         updated_at,
//         companies {
//             id, name
//         }
//     }
// }`;

// function Header({ name }: { name: string }) {
//     return (
//         <header className="flex items-center justify-between border-b border-white/5 p-4">
//             <h1 className="text-lg font-semibold leading-7 text-white">{name}</h1>
//         </header>
//     );
// }

// function Content() {
//     return (
//         <>
//             <div className="px-4 py-2">
//                 <Journal/>
//             </div>
//         </>
//     );
// }
// function WorkspaceLayout({ workspaceId }: { workspaceId: string }) {
//     const { loading, error, data } = useQuery<IWorkspaceQL>(Q_MY_WORKSPACE, {
//         variables: { id: workspaceId }
//     });
//     if (loading || !data) { return (<Loader />); }
//     const workspace = data.workspace;
//     console.log('rendering workspace layout');
//     return (
//         <>
//             <Header name={workspace.name}/>
//             <WorkspaceContext.Provider value={{ id: workspaceId }}>
//                 <Content />
//             </WorkspaceContext.Provider>
//         </>
//     );
// }

// function WorkspacePage({ params }: { params: { workspaceId: string } }) {
//     console.log('rendering workspace page');
//     return (
//         <>
//             <ApolloAppProvider>
//                 <WorkspaceLayout workspaceId={params.workspaceId} />
//             </ApolloAppProvider>
//         </>
//     );
// }

// // Turn Off SSR for Main App
// export default dynamic(async () => WorkspacePage, { ssr: false });