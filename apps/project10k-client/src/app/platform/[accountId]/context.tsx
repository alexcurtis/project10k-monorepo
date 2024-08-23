import { createContext } from "react";
import { IWorkspaceContext } from "@platform/types/entities";

export const emptyAccount = {
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    workspaces: [],
};

export const emptyWorkspace = {
    _id: "",
    account: emptyAccount,
    name: "",
    updatedAt: "",
    journals: [],
};

export const WorkspaceContext = createContext<IWorkspaceContext>({
    workspace: emptyWorkspace,
    activeJournal: "",
    setActiveJournal: () => {},
});
