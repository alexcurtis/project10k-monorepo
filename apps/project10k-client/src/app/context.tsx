import { createContext } from 'react';
import { IWorkspace } from './types/entities';
export const WorkspaceContext = createContext<IWorkspace | null>(null);