export type IMindMapNodePosition = {
    x: number,
    y: number
}

export type IMindMapNode = {
    position: IMindMapNodePosition    
}

export type IJournal = {
    _id: string,
    name: string,
    mindMapNode: IMindMapNode
}

export type IWorkspace = {
    _id: string,
    name: string,
    updatedAt: string
    journals: IJournal[]
}

export type IAccount = {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    workspaces: IWorkspace[]
}



