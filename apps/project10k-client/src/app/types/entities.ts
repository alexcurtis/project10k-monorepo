export type IWorkspace = {
    _id: string,
    name: string,
    updatedAt: string
    // journal: IJournal
}

export type IAccount = {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    workspaces: IWorkspace[]
}

// export type IJournal = {
//     id: string,
//     content: string
// }

