import { Dispatch, SetStateAction } from "react";

export type ICompany = {
    _id: string;
    externalId: string;
    ticker: string;
    title: string;
};

export type ICompanyFiling = {
    _id: string;
    form: string;
    name: string;
    period: Date;
    filedOn: Date;
    format: string;
    path: string;
    filename: string;
};

export type IJournalEntry = {
    _id: string;
    content: object;
};

export type IMindMapNodePosition = {
    x: number;
    y: number;
};

export type IMindMapEdge = {
    _id: string;
    target: string;
};

export type IMindMapNode = {
    _id: string;
    position: IMindMapNodePosition;
    edges: IMindMapEdge[];
};

export type ICitation = {
    _id: string;
    text: string;
    range: object;
    company: ICompany;
    filing: ICompanyFiling;
    updatedAt: Date;
    embeddedOnJournalEntry: boolean;
};

export type IJournal = {
    _id: string;
    name: string;
    mindMapNode: IMindMapNode;
    journalEntry: IJournalEntry;
    citations: ICitation[];
};

export type IWorkspace = {
    _id: string;
    name: string;
    updatedAt: string;
    journals: IJournal[];
};

export type IAccount = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    workspaces: IWorkspace[];
};

// Context For Workspaces
export type IWorkspaceContext = {
    workspace: IWorkspace;
    activeJournal: string | undefined;
    setActiveJournal: Dispatch<string>;
};

// Context For Doc Viewer
export enum DocViewerPage {
    Empty,
    Filings,
    Document,
}

export type IDocViewerQuery = {
    page: DocViewerPage;
    company?: ICompany;
    filing?: ICompanyFiling;
    scrollTo?: string;
};

export type IDocViewerContext = {
    docViewerQuery: IDocViewerQuery;
    setDocViewerQuery: Dispatch<SetStateAction<IDocViewerQuery>>;
};
