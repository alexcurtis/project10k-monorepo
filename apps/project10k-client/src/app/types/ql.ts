import { ApolloError } from "@apollo/client";
import { IAccount, IWorkspace, IJournalEntry, ICompany, ICompanyFiling, IJournal } from "./entities";

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

export interface IJournalQL extends IQueryLanguage {
    journal: IJournal;
}

export interface ICompaniesSearchQL extends IQueryLanguage {
    companySearch: ICompany[];
}

export interface ICompanyFilingQL extends IQueryLanguage {
    companyFiling: ICompanyFiling;
}

export interface ICompanyFilingsQL extends IQueryLanguage {
    companyFilings: ICompanyFiling[];
}
