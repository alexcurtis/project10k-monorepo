import { createContext } from "react";
import { IDocViewerContext, DocViewerPage } from "@/app/types/entities";

export const DocViewerContext = createContext<IDocViewerContext>({
    docViewerQuery: {
        page: DocViewerPage.Empty,
        company: null,
        filing: null,
    },
    setDocViewerQuery: () => {},
});
