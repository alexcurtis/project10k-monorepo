import { createContext } from "react";
import { IWorkspaceContext } from "@platform/types/entities";
export const WorkspaceContext = createContext<IWorkspaceContext>({
    workspace: null,
    activeJournal: "",
    setActiveJournal: () => {},
});
