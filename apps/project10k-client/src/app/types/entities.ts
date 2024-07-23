export type IJournal = {
    id: string,
    content: string
}

export type IWorkspace = {
    id: string,
    name: string,
    journal: IJournal
}