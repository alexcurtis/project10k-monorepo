import { Dispatch } from 'react';

export type IMindMapNodePosition = {
    x: number,
    y: number
}

export type IMindMapEdge = {
    _id: string,
    target: string
}

export type IMindMapNode = {
    _id: string,
    position: IMindMapNodePosition,
    edges: IMindMapEdge[]
}

export type IJournalEntry = {
    _id: string,
    content: object
}

export type IJournal = {
    _id: string,
    name: string,
    mindMapNode: IMindMapNode,
    journalEntry: string
}

export type IWorkspace = {
    _id: string,
    name: string,
    updatedAt: string
    journals: IJournal[]
}

export type IAccount = {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    workspaces: IWorkspace[]
}

// Context For Workspaces
export type IWorkspaceContext = {
    workspace: IWorkspace,
    activeJournal: string | undefined,
    setActiveJournal: Dispatch<string>
}

