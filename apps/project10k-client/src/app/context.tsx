import { createContext } from 'react';
import { IWorkspaceContext } from './types/entities';
export const WorkspaceContext = createContext<IWorkspaceContext>({
    workspace: null,
    activeJournal: '',
    setActiveJournal: null
});