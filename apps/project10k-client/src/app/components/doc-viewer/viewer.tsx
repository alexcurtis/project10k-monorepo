import { useContext, useState } from "react";

import { DocViewerPage, ICompany, IDocViewerQuery } from "@/app/types/entities";
import { DocViewerContext } from "./context";

import { EmptyDocViewer } from "./empty";
import { CompanyFilings } from "./filings";
import { CompanyDocument } from "./document";
import { ITab, Tabs, TabsUnderline } from "@vspark/catalyst/tabs";
import { CompanySearch } from "./search";

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

const tabs: ITab[] = [
    {
        id: "all-references",
        name: "All References",
    },
    {
        id: "most-recent",
        name: "Most Recent",
    },
];

export function DocViewer() {
    // Default To New Citations Tab
    const [selectedTab, setSelectedTab] = useState("all-references");
    const [docViewerQuery, setDocViewerQuery] = useState<IDocViewerQuery>({
        page: DocViewerPage.Empty,
        company: null,
        filing: null,
    });
    return (
        <>
            <TabsUnderline>
                <Tabs tabs={tabs} selectedTab={selectedTab} onClick={() => {}} />
                <div className="pl-2 w-96">
                    <CompanySearch
                        onCompanyClicked={function (company: ICompany): void {
                            throw new Error("Function not implemented.");
                        }}
                    />
                </div>
            </TabsUnderline>
            <DocViewerContext.Provider value={{ docViewerQuery, setDocViewerQuery }}>
                <DocViewerLayout />
            </DocViewerContext.Provider>
        </>
    );
}
