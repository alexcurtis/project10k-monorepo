"use client";
import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Squares2X2Icon, ViewColumnsIcon } from "@heroicons/react/16/solid";

import { Loader } from "@vspark/catalyst/loader";
import { Button } from "@vspark/catalyst/button";
import { EditableText, EditableTextSubmitEvent } from "@vspark/catalyst/editable-text";

import { IWorkspaceQL } from "@platform/types/ql";
import { WorkspaceContext } from "@platform/context";
import { Journal } from "@platform/components/research/journal";
import { MindMap } from "@platform/components/mindmap/mindmap";
import { DocViewer } from "@platform/components/doc-viewer/viewer";
import { WORKSPACE_QL_RESPONSE } from "@platform/graphql";
import { IWorkspace } from "@platform/types/entities";

const Q_MY_WORKSPACE = gql`query GetWorkspace($id: ID!) {
    workspace(id: $id)${WORKSPACE_QL_RESPONSE}
}`;

// Workspace Update Mutation
const M_UPDATE_WORKSPACE = gql`
    mutation UpdateWorkspace($id: ID!, $workspace: InputWorkspaceDto!) {
        updateWorkspace(id: $id, workspace: $workspace) {
            _id
            name
        }
    }
`;

const DEFAULT_MIN_PANEL_SIZE = 10;
const LAYOUT_SAVE_KEY = "layout-orientation";

enum Orientation {
    Columns = "layout-columns",
    Quadrant = "layout-quadrant",
}

function saveLayoutOrientation(orientation: Orientation) {
    return localStorage.setItem(LAYOUT_SAVE_KEY, orientation);
}

function loadLayoutOrientation(): Orientation {
    const layout = localStorage.getItem(LAYOUT_SAVE_KEY);
    // Return Default If Saved Value Not Available
    if (!layout) {
        return Orientation.Quadrant;
    }
    return layout as Orientation;
}

function WorkspaceHeader({
    name,
    onLayoutOrientation,
    onWorkspaceNameChange,
}: {
    name: string;
    onLayoutOrientation: (o: Orientation) => void;
    onWorkspaceNameChange: (name: EditableTextSubmitEvent) => void;
}) {
    return (
        <div className="px-4 flex border-b border-white/30 py-2">
            <h3 className="text-lg font-semibold leading-9 align-middle text-white flex-grow">
                <EditableText
                    placeholder="Placeholder"
                    value={name}
                    onSubmit={onWorkspaceNameChange}
                    neverEmpty={true}
                />
            </h3>
            <div className="flex-none">
                <div className="flex">
                    <Button outline onClick={() => onLayoutOrientation(Orientation.Quadrant)}>
                        <Squares2X2Icon />
                    </Button>
                    <Button outline className="ml-2" onClick={() => onLayoutOrientation(Orientation.Columns)}>
                        <ViewColumnsIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function ContentArea({
    workspace,
    onLayoutOrientation,
}: {
    workspace: IWorkspace;
    onLayoutOrientation: (o: Orientation) => void;
}) {
    // Mutators
    const [updateWorkspace] = useMutation(M_UPDATE_WORKSPACE);
    const onWorkspaceNameChangeCb = useCallback(
        ({ value }: EditableTextSubmitEvent) => {
            updateWorkspace({
                variables: {
                    id: workspace._id,
                    workspace: { name: value },
                },
            });
        },
        [updateWorkspace, workspace]
    );
    return (
        <div className="flex flex-col h-full max-h-full">
            <div className="flex-none">
                <WorkspaceHeader
                    name={workspace.name}
                    onLayoutOrientation={onLayoutOrientation}
                    onWorkspaceNameChange={onWorkspaceNameChangeCb}
                />
            </div>
            <div className="flex-grow">
                <Journal />
            </div>
        </div>
    );
}

function QuadrantContentPanels({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PanelGroup autoSaveId="layout-quadrant-persistence" direction="horizontal">
                <Panel minSize={DEFAULT_MIN_PANEL_SIZE}>
                    <PanelGroup autoSaveId="layout-quadrant-v-persistence" direction="vertical">
                        <Panel minSize={DEFAULT_MIN_PANEL_SIZE}>{children}</Panel>
                        <PanelResizeHandle className="h-px bg-white/30" />
                        <Panel minSize={DEFAULT_MIN_PANEL_SIZE} defaultSize={40}>
                            <MindMap />
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle className="w-px bg-white/30" />
                <Panel minSize={DEFAULT_MIN_PANEL_SIZE}>
                    <DocViewer />
                </Panel>
            </PanelGroup>
        </>
    );
}

function ColumnContentPanels({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PanelGroup autoSaveId="layout-column-persistence" direction="horizontal">
                <Panel minSize={DEFAULT_MIN_PANEL_SIZE}>{children}</Panel>
                <PanelResizeHandle className="w-px bg-white/30" />
                <Panel minSize={DEFAULT_MIN_PANEL_SIZE}>
                    <DocViewer />
                </Panel>
                <PanelResizeHandle className="w-px bg-white/30" />
                <Panel minSize={DEFAULT_MIN_PANEL_SIZE} defaultSize={40}>
                    <MindMap />
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

const orientationRegistry = {
    [Orientation.Columns]: ColumnContentPanels,
    [Orientation.Quadrant]: QuadrantContentPanels,
};

function LayoutOrientation({ orientation, children }: { orientation: Orientation; children: React.ReactNode }) {
    const SelectedLayout = orientationRegistry[orientation];
    return <SelectedLayout>{children}</SelectedLayout>;
}

function WorkspaceLayout({ workspaceId }: { workspaceId: string }) {
    const [activeJournal, setActiveJournal] = useState<string>();
    const [orientation, setOrientation] = useState(loadLayoutOrientation());

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

    const onLayoutOrientation = useCallback(
        (orientation: Orientation) => {
            saveLayoutOrientation(orientation);
            setOrientation(orientation);
        },
        [setOrientation]
    );

    // Ensure Data and ActiveJournal Are Synced Before Rendering Workspace
    if (loading || !data) {
        return <WorspacePageLoader />;
    }

    const { workspace } = data;
    return (
        <>
            <WorkspaceContext.Provider
                value={{
                    workspace,
                    activeJournal,
                    setActiveJournal,
                }}
            >
                <LayoutOrientation orientation={orientation}>
                    <ContentArea workspace={workspace} onLayoutOrientation={onLayoutOrientation} />
                </LayoutOrientation>
            </WorkspaceContext.Provider>
        </>
    );
}

function WorkspacePage({ params }: { params: { workspaceId: string } }) {
    return (
        <>
            <WorkspaceLayout workspaceId={params.workspaceId} />
        </>
    );
}

// Turn Off SSR for Main App
export default dynamic(async () => WorkspacePage, { ssr: false });
