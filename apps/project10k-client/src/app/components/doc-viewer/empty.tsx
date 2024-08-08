import { DocumentPlusIcon } from "@heroicons/react/20/solid";
import { DocViewerPage, ICompany } from "@/app/types/entities";

import { CompanySearch } from "./search";
import { DocViewerContext } from "./context";
import { useCallback, useContext } from "react";
import { id } from "date-fns/locale";

export function EmptyDocViewer() {
    const { setDocViewerQuery } = useContext(DocViewerContext);

    // Trigger The Context
    const onCompanyClicked = useCallback(
        (company: ICompany) => {
            setDocViewerQuery({
                page: DocViewerPage.Filings,
                companyId: company._id,
                filingId: "",
            });
        },
        [setDocViewerQuery]
    );

    // I Need to pass attributes like the selected company, etc.

    return (
        <div className="mx-auto max-w-lg pt-10">
            <div>
                <div className="text-center">
                    <DocumentPlusIcon className="text-center h-20 w-20 text-zinc-400 inline-block" />
                    <h2 className="mt-2 text-lg font-semibold leading-6 text-white">Add a company document</h2>
                    <p className="mt-1 text-base text-zinc-400">
                        It looks like you haven’t added any documents to your workspace. Try adding one by searching for
                        a company below.
                    </p>
                </div>
                <CompanySearch onCompanyClicked={onCompanyClicked} />
            </div>
        </div>
    );
}
