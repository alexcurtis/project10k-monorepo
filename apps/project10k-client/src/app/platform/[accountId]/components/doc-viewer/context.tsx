import { createContext } from "react";
import { IDocViewerContext, DocViewerPage } from "@platform/types/entities";

export const emptyCompany = {
    _id: "",
    apidbId: "",
    ticker: [],
    title: "",
};

export const emptyFiling = {
    _id: "",
    form: "",
    name: "",
    period: new Date(),
    filedOn: new Date(),
    format: "",
    path: "",
    filename: "",
};

export const DocViewerContext = createContext<IDocViewerContext>({
    docViewerQuery: {
        page: DocViewerPage.Empty,
        company: emptyCompany,
        filing: emptyFiling,
    },
    setDocViewerQuery: () => {},
});
