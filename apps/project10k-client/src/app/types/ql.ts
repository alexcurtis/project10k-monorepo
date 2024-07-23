import { ApolloError } from "@apollo/client";
import {
    IWorkspace,
    IJournal
} from './entities';

export interface IQueryLanguage {
}

export interface IWorkspacesQL extends IQueryLanguage {
    workspaces: IWorkspace[]
}

export interface IWorkspaceQL extends IQueryLanguage {
    workspace: IWorkspace
}

// export interface IJournalQL extends IQueryLanguage {
//     journal: IJournal
// }