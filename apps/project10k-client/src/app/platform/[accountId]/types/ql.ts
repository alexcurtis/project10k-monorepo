import { IAccount, IWorkspace, ICompany, ICompanyFiling, IJournal, ICitation, IUser } from "./entities";

export interface IQueryLanguage {}

export interface IAccountQL extends IQueryLanguage {
    account: IAccount;
    me: IUser;
}

export interface IWorkspacesQL extends IQueryLanguage {
    workspaces: IWorkspace[];
}

export interface IWorkspaceQL extends IQueryLanguage {
    workspace: IWorkspace;
}

export interface ICitationQL extends IQueryLanguage {
    citation: ICitation;
}

export interface IJournalQL extends IQueryLanguage {
    journal: IJournal;
}

export interface ICompaniesSearchQL extends IQueryLanguage {
    companySearch: ICompany[];
}

export interface ICitationsOnWorkspaceQL extends IQueryLanguage {
    citationsOnWorkspace: ICitation[];
}

export interface ICompanyFilingQL extends IQueryLanguage {
    companyFiling: ICompanyFiling;
}

export interface ICompanyFilingDatasetQL extends IQueryLanguage {
    companyFiling: ICompanyFiling;
    citationsOnFiling: ICitation[];
}

export interface ICompanyFilingsQL extends IQueryLanguage {
    companyFilings: ICompanyFiling[];
}
