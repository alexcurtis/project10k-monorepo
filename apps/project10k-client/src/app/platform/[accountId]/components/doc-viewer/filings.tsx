import { useCallback, useState, ChangeEvent, useContext } from "react";
import { useQuery, gql } from "@apollo/client";
import { AgGridReact } from "ag-grid-react";
import { RowClickedEvent, ColDef } from "ag-grid-community";

import { Loader } from "@vspark/catalyst/loader";

import { ICompanyFilingsQL } from "@platform/types/ql";
import { DocViewerPage, ICompany, ICompanyFiling } from "@platform/types/entities";
import { DocViewerContext } from "./context";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const FINANCIAL_FORMS = ["10-K", "10-Q", "10-K/A", "10-Q/A", "NT 10-K", "NT 10-Q", "10-K405"];
const NEWS_FORMS = ["8-K", "8-K/A"];
const PROXY_FORMS = ["PX14A6G", "PX14A6N", "DEFA14A", "DEF 14A"];
const OWNERSHIP_FORMS = ["4", "4/A", "144", "3", "3/A", "SC 13G", "SC 13G/A"];

const CONTENT_HEIGHT = 519;

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
            path
            filename
        }
    }
`;

function DocumentsLoader() {
    return (
        <div className="border" style={{ height: CONTENT_HEIGHT }}>
            <Loader />
        </div>
    );
}

const defaultColDefs: ColDef[] = [
    { field: "form" },
    { field: "name", flex: 1 },
    { field: "period" },
    { field: "filedOn" },
];

function FilingTable({ filings, onClick }: { filings: ICompanyFiling[]; onClick: (filing: ICompanyFiling) => void }) {
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs] = useState(defaultColDefs);

    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 25, 50];

    const onRowClickedCb = useCallback(
        (event: RowClickedEvent<ICompanyFiling>) => {
            if (event.data) {
                return onClick(event.data);
            }
        },
        [onClick]
    );

    return (
        <div className="ag-theme-alpine-dark" style={{ height: CONTENT_HEIGHT }}>
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
    );
}

function CompanyFilingsGroup({
    title,
    forms,
    company,
    onClick,
}: {
    title: string;
    forms: string[];
    company: ICompany;
    onClick: (filing: ICompanyFiling) => void;
}) {
    // Company Group Query
    const { loading, error, data } = useQuery<ICompanyFilingsQL>(Q_COMPANY_FILINGS, {
        variables: {
            companyId: company._id,
            forms,
        },
    });

    const companyFilings = data?.companyFilings;

    return (
        <>
            <div className="mb-10">
                <h2 className="text-xl mb-4">{title}</h2>
                {loading || !data || !companyFilings ? (
                    <DocumentsLoader />
                ) : (
                    <FilingTable filings={companyFilings} onClick={onClick} />
                )}
            </div>
        </>
    );
}

function Header({ title, ticker }: { title: string; ticker: string[] }) {
    return (
        <>
            <h1 className="text-2xl mb-5 mt-4">
                {title} <span className="text-zinc-400">{`(${ticker})`}</span>
            </h1>
        </>
    );
}

export function CompanyFilings() {
    const { docViewerQuery, setDocViewerQuery } = useContext(DocViewerContext);
    const { company } = docViewerQuery;

    // Update The Context And Move To The Document Page
    const onFilingClicked = useCallback(
        (filing: ICompanyFiling) => {
            setDocViewerQuery({
                page: DocViewerPage.Document,
                company,
                filing,
            });
        },
        [company, setDocViewerQuery]
    );

    return (
        <div className="pl-4 pb-4 flex flex-col h-full max-h-full">
            <Header title={company.title} ticker={company.ticker} />
            <div className="overflow-y-scroll flex-grow pr-4">
                <div className="relative">
                    <CompanyFilingsGroup
                        title="Financials"
                        forms={FINANCIAL_FORMS}
                        company={company}
                        onClick={onFilingClicked}
                    />
                    <CompanyFilingsGroup title="News" forms={NEWS_FORMS} company={company} onClick={onFilingClicked} />
                    <CompanyFilingsGroup
                        title="Proxies"
                        forms={PROXY_FORMS}
                        company={company}
                        onClick={onFilingClicked}
                    />
                    <CompanyFilingsGroup
                        title="Ownership"
                        forms={OWNERSHIP_FORMS}
                        company={company}
                        onClick={onFilingClicked}
                    />
                </div>
            </div>
        </div>
    );
}
