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

const fixedTabs: ITab[] = [
    {
        id: DocViewerPage.Empty.toString(),
        name: "All References",
    },
];

export function DocViewer() {
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

    // Tab Building
    const { filing, company } = docViewerQuery;
    const selectedTab = filing && company ? DocViewerPage.Document : DocViewerPage.Empty;
    const tabs =
        !filing || !company
            ? fixedTabs
            : fixedTabs.concat([
                  {
                      id: DocViewerPage.Document.toString(),
                      name: `${company.title} (${company.ticker}) > ${filing.name}`,
                  },
              ]);

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex-none">
                    <TabsUnderline>
                        <Tabs tabs={tabs} selectedTab={selectedTab.toString()} onClick={() => {}} />
                        <div className="pl-2 w-96">
                            {showCompanySearch ? <CompanySearch onCompanyClicked={onCompanyClicked} /> : null}
                        </div>
                    </TabsUnderline>
                </div>
                <div className="flex-grow">
                    <DocViewerContext.Provider value={{ docViewerQuery, setDocViewerQuery }}>
                        <DocViewerLayout />
                    </DocViewerContext.Provider>
                </div>
            </div>
        </>
    );
}
