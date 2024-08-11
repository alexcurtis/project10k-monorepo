import { useCallback, useContext } from "react";
import { CompanySearch } from "./search";
import { DocViewerContext } from "./context";
import { DocViewerPage, ICompany } from "@/app/types/entities";

export function DocViewerHeader() {
    const { setDocViewerQuery } = useContext(DocViewerContext);

    // Update The Context And Move To The Filings Page
    const onCompanyClicked = useCallback(
        (company: ICompany) => {
            setDocViewerQuery({
                page: DocViewerPage.Filings,
                company,
                filing: null,
            });
        },
        [setDocViewerQuery]
    );
    return (
        <div className="mb-5">
            <CompanySearch onCompanyClicked={onCompanyClicked} />
        </div>
    );
}
