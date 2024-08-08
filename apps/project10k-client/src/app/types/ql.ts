import { ApolloError } from "@apollo/client";
import { IAccount, IWorkspace, IJournalEntry, ICompany, ICompanyFiling } from "./entities";

export interface IQueryLanguage {}

export interface IAccountQL extends IQueryLanguage {
    account: IAccount;
}

export interface IWorkspacesQL extends IQueryLanguage {
    workspaces: IWorkspace[];
}

export interface IWorkspaceQL extends IQueryLanguage {
    workspace: IWorkspace;
}

export interface IJournalEntryQL extends IQueryLanguage {
    journalEntry: IJournalEntry;
}

export interface ICompaniesSearchQL extends IQueryLanguage {
    companySearch: ICompany[];
}

export interface ICompanyFilingsQL extends IQueryLanguage {
    companyFilings: ICompanyFiling[];
}
