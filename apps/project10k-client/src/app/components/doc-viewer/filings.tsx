import { useCallback, useState, ChangeEvent, useContext } from "react";
import { useQuery, gql } from "@apollo/client";
import { AgGridReact } from "ag-grid-react";
import { RowClickedEvent } from "ag-grid-community";

import { Loader } from "@vspark/catalyst/loader";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { ICompanyFilingsQL } from "@/app/types/ql";
import { DocViewerPage, ICompanyFiling } from "@/app/types/entities";
import { DocViewerContext } from "./context";

const FINANCIAL_FORMS = ["10-K", "10-Q", "10-K/A", "10-Q/A", "NT 10-K", "NT 10-Q", "10-K405"];
const NEWS_FORMS = ["8-K", "8-K/A"];
const PROXY_FORMS = ["PX14A6G", "PX14A6N", "DEFA14A", "DEF 14A"];
const OWNERSHIP_FORMS = ["4", "4/A", "144", "3", "3/A", "SC 13G", "SC 13G/A"];

// Company Documents Query
const Q_COMPANY_FILINGS = gql`
    query CompanyFilings($companyId: ID!, $forms: [String!]) {
        companyFilings(companyId: $companyId, forms: $forms) {
            _id
            form
            name
            period
            filedOn
            format
            location
        }
    }
`;

function DocumentsLoader() {
    return (
        <div className="mx-5">
            <Loader />
        </div>
    );
}

function FilingTable({
    title,
    filings,
    onClick,
}: {
    title: string;
    filings: ICompanyFiling[];
    onClick: (id: string) => void;
}) {
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        { field: "form" },
        { field: "name", flex: 1 },
        { field: "period" },
        { field: "filedOn" },
    ]);

    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 25, 50];

    const onRowClickedCb = useCallback(
        (event: RowClickedEvent<ICompanyFiling>) => {
            if (event.data) {
                return onClick(event.data._id);
            }
        },
        [onClick]
    );

    return (
        <div className="mb-10">
            <h2 className="text-xl mb-4">{title}</h2>
            <div className="ag-theme-alpine-dark" style={{ height: 519 }}>
                <AgGridReact
                    rowData={filings}
                    columnDefs={colDefs}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    rowSelection="single"
                    onRowClicked={onRowClickedCb}
                    suppressCellFocus={true}
                />
            </div>
        </div>
    );
}

function CompanyFilingsGroup({
    title,
    forms,
    onClick,
}: {
    title: string;
    forms: string[];
    onClick: (id: string) => void;
}) {
    // Company Group Query
    const { loading, error, data } = useQuery<ICompanyFilingsQL>(Q_COMPANY_FILINGS, {
        variables: {
            companyId: "66b281d563f0188007a263c0",
            forms,
        },
    });

    const companyFilings = data?.companyFilings;
    if (loading || !data || !companyFilings) {
        return <DocumentsLoader />;
    }

    return (
        <>
            <FilingTable title={title} filings={companyFilings} onClick={onClick} />
        </>
    );
}

function Header() {
    return (
        <>
            <h1 className="text-2xl flex-none mb-5">
                Apple <span className="text-zinc-400">(AAPL)</span>
            </h1>
        </>
    );
}

export function CompanyFilings() {
    const { docViewerQuery, setDocViewerQuery } = useContext(DocViewerContext);
    const { companyId } = docViewerQuery;

    // Update The Context And Move To The Document Page
    const onFilingClicked = useCallback(
        (id: string) => {
            setDocViewerQuery({
                page: DocViewerPage.Document,
                companyId: companyId,
                filingId: id,
            });
        },
        [companyId, setDocViewerQuery]
    );

    return (
        <div className="p-4 h-full w-full flex flex-col">
            <Header />
            <div className="overflow-auto flex-grow">
                <CompanyFilingsGroup title="Financials" forms={FINANCIAL_FORMS} onClick={onFilingClicked} />
                <CompanyFilingsGroup title="News" forms={NEWS_FORMS} onClick={onFilingClicked} />
                <CompanyFilingsGroup title="Proxies" forms={PROXY_FORMS} onClick={onFilingClicked} />
                <CompanyFilingsGroup title="Ownership" forms={OWNERSHIP_FORMS} onClick={onFilingClicked} />
            </div>
        </div>
    );
}
