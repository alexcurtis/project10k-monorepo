import { ApolloError } from "@apollo/client";
import {
    IWorkspace
} from './entities';

export interface IQueryLanguage {
    error: ApolloError,
    loading: boolean
}

export interface IWorkspacesQL extends IQueryLanguage {
    workspaces: IWorkspace[]
}