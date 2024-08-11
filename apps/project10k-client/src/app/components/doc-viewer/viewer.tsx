import { useContext, useState } from "react";

import { DocViewerPage, IDocViewerQuery } from "@/app/types/entities";
import { DocViewerContext } from "./context";

import { EmptyDocViewer } from "./empty";
import { CompanyFilings } from "./filings";
import { CompanyDocument } from "./document";

function DocViewerLayout() {
    // Load The Doc Viewer Page Based On Context
    const { docViewerQuery } = useContext(DocViewerContext);
    switch (docViewerQuery.page) {
        case DocViewerPage.Empty: {
            return <EmptyDocViewer />;
        }
        case DocViewerPage.Filings: {
            return <CompanyFilings />;
        }
        case DocViewerPage.Document: {
            return <CompanyDocument />;
        }
    }
}

export function DocViewer() {
    const [docViewerQuery, setDocViewerQuery] = useState<IDocViewerQuery>({
        page: DocViewerPage.Empty,
        company: null,
        filing: null,
    });
    return (
        <>
            <DocViewerContext.Provider value={{ docViewerQuery, setDocViewerQuery }}>
                <DocViewerLayout />
            </DocViewerContext.Provider>
        </>
    );
}
