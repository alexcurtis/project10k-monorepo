import { useCallback, useContext, useState } from "react";

import { DocViewerPage, ICompany, ICompanyFiling, IDocViewerQuery } from "@/app/types/entities";
import { DocViewerContext } from "./context";

import { EmptyDocViewer } from "./empty";
import { CompanyFilings } from "./filings";
import { CompanyDocument } from "./document";
import { ITab, Tabs, TabsUnderline } from "@vspark/catalyst/tabs";
import { CompanySearch } from "./search";

import { useSub } from "@/app/hooks";

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
        company: undefined,
        filing: undefined,
    });

    // Subscribe To External Events
    useSub(
        "filing:navigate:scroll",
        ({ company, filing, scrollTo }: { company: ICompany; filing: ICompanyFiling; scrollTo: string }) => {
            console.log("Navigate To Filing!!!!!!!!", company, filing);
            setDocViewerQuery({
                page: DocViewerPage.Document,
                company,
                filing,
                scrollTo,
            });
        }
    );

    // Update The Context And Move To The Filings Page
    const onCompanyClicked = useCallback(
        (company: ICompany) => {
            setDocViewerQuery({
                page: DocViewerPage.Filings,
                company,
                filing: undefined,
            });
        },
        [setDocViewerQuery]
    );

    // Do Not Show Company Search On Empty View (As already has it)
    const showCompanySearch = docViewerQuery.page !== DocViewerPage.Empty;

    return (
        <>
            <TabsUnderline>
                <Tabs tabs={tabs} selectedTab={selectedTab} onClick={() => {}} />
                <div className="pl-2 w-96">
                    {showCompanySearch ? <CompanySearch onCompanyClicked={onCompanyClicked} /> : null}
                </div>
            </TabsUnderline>
            <DocViewerContext.Provider value={{ docViewerQuery, setDocViewerQuery }}>
                <DocViewerLayout />
            </DocViewerContext.Provider>
        </>
    );
}
