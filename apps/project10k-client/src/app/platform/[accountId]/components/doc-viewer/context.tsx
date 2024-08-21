import { createContext } from "react";
import { IDocViewerContext, DocViewerPage } from "@platform/types/entities";

export const DocViewerContext = createContext<IDocViewerContext>({
    docViewerQuery: {
        page: DocViewerPage.Empty,
    },
    setDocViewerQuery: () => {},
});
