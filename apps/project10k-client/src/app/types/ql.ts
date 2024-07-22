import { ApolloError } from "@apollo/client";
import {
    IWorkspace
} from './entities';

export interface IQueryLanguage {
}

export interface IWorkspacesQL extends IQueryLanguage {
    workspaces: IWorkspace[]
}

export interface IWorkspaceQL extends IQueryLanguage {
    workspace: IWorkspace
}