"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useQuery, gql } from "@apollo/client";

import { Loader } from "@vspark/catalyst/loader";
import { ApolloAppProvider } from "@/app/graphql";
import { IWorkspaceQL } from "@/app/types/ql";

import { WorkspaceContext } from "@/app/context";
import { Journal } from "@/app/components/research/journal";
import { MindMap } from "@/app/components/mindmap/mindmap";
import { DocViewer } from "@/app/components/doc-viewer/viewer";
import { WORKSPACE_QL_RESPONSE } from "@/app/graphql";

const Q_MY_WORKSPACE = gql`query GetWorkspace($id: ID!) {
    workspace(id: $id)${WORKSPACE_QL_RESPONSE}
}`;

const DEFAULT_MIN_PANEL_SIZE = 10;

function ContentPanels() {
    return (
        <>
            <PanelGroup autoSaveId="layout-h-persistence" direction="horizontal">
                <Panel minSize={DEFAULT_MIN_PANEL_SIZE}>
                    <PanelGroup autoSaveId="layout-v-persistence" direction="vertical">
                        <Panel minSize={DEFAULT_MIN_PANEL_SIZE}>
                            <Journal />
                        </Panel>
                        <PanelResizeHandle className="h-1 bg-white/5" />
                        <Panel minSize={DEFAULT_MIN_PANEL_SIZE} defaultSize={40}>
                            <MindMap />
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle className="w-1 bg-white/5" />
                <Panel minSize={DEFAULT_MIN_PANEL_SIZE}>
                    <DocViewer />
                </Panel>
            </PanelGroup>
        </>
    );
}

function WorspacePageLoader() {
    return (
        <div className="p-4">
            <Loader />
        </div>
    );
}

function WorkspaceLayout({ workspaceId }: { workspaceId: string }) {
    console.log("rendering workspace layout - workspaceId", workspaceId);
    const [activeJournal, setActiveJournal] = useState<string>();

    const { loading, error, data } = useQuery<IWorkspaceQL>(Q_MY_WORKSPACE, {
        variables: { id: workspaceId },
        onCompleted: () => {
            if (!data || !data.workspace.journals || data.workspace.journals.length === 0) {
                return;
            }
            // Default To First Journal As Active On A New Opened Workspace
            const firstJournal = data?.workspace.journals[0]._id;
            setActiveJournal(firstJournal);
        },
    });
    // Ensure Data and ActiveJournal Are Synced Before Rendering Workspace
    if (loading || !data) {
        return <WorspacePageLoader />;
    }
    const workspace = data.workspace;
    console.log("---------rendering real workspace-----------", activeJournal, workspace);
    return (
        <>
            <WorkspaceContext.Provider
                value={{
                    workspace,
                    activeJournal,
                    setActiveJournal,
                }}
            >
                <ContentPanels />
            </WorkspaceContext.Provider>
        </>
    );
}

function WorkspacePage({ params }: { params: { workspaceId: string } }) {
    console.log("rendering workspace page");
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
