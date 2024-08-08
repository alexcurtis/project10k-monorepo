import { useCallback, useState, ChangeEvent } from "react";
import { useQuery, gql } from "@apollo/client";
// import { debounce } from "lodash";

import { Input } from "@vspark/catalyst/input";
import { Loader } from "@vspark/catalyst/loader";

import { ICompany } from "@/app/types/entities";
import { ICompaniesSearchQL } from "@/app/types/ql";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

// How Often BE Search Is Triggered
// const SEARCH_DEBOUNCE = 500;

// Company Search Query
const Q_COMPANIES = gql`
    query CompanySearch($term: String!) {
        companySearch(term: $term) {
            _id
            title
            ticker
        }
    }
`;

function SearchLoader() {
    return <Loader text="Searching..." />;
}

function SearchResult({ company, onClick }: { company: ICompany; onClick: (company: ICompany) => void }) {
    const onClickCb = useCallback(() => {
        onClick(company);
    }, [company, onClick]);
    return (
        <li className="p-3 hover:bg-white/5 hover:cursor-pointer flex" onClick={onClickCb}>
            <p className="text-sm font-semibold text-white flex-none">{company.title}</p>
            <p className="text-sm font-semibold text-zinc-400 flex-auto ml-2">{company.ticker}</p>
            <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
        </li>
    );
}

function SearchResults({
    loading,
    results,
    onResultClicked,
}: {
    loading: boolean;
    results: ICompany[];
    onResultClicked: (company: ICompany) => void;
}) {
    return (
        <div className="rounded-lg text-white border border-white/10 bg-white/5 focus:outline-none p-6 mt-2">
            {!loading ? (
                <ul role="list" className="divide-y divide-white/10">
                    {results.map((company: ICompany) => (
                        <SearchResult key={company._id} company={company} onClick={onResultClicked} />
                    ))}
                </ul>
            ) : (
                <SearchLoader />
            )}
        </div>
    );
}

export function CompanySearch({ onCompanyClicked }: { onCompanyClicked: (company: ICompany) => void }) {
    const [search, setSearch] = useState("");

    // Company Search Query
    const { loading, error, data } = useQuery<ICompaniesSearchQL>(Q_COMPANIES, {
        variables: { term: search },
        skip: search === "",
    });

    const onSearchChangeCb = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
        },
        [setSearch]
    );

    return (
        <>
            <form action="#" className="mt-6 flex">
                <label htmlFor="compsearch" className="sr-only">
                    Company Search
                </label>
                <Input
                    name="compsearch"
                    type="text"
                    placeholder="Enter a company name or ticker"
                    value={search}
                    onChange={onSearchChangeCb}
                />
            </form>
            {data && data.companySearch ? (
                <SearchResults loading={loading} results={data.companySearch} onResultClicked={onCompanyClicked} />
            ) : null}
        </>
    );
}
