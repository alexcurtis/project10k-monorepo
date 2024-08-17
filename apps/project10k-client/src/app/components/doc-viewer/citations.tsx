import { Dispatch, DragEvent, memo, SetStateAction, useCallback, useContext, useState } from "react";
import { format } from "date-fns";
import { ICitation } from "@/app/types/entities";
import { Badge } from "@vspark/catalyst/badge";
import { ChevronRightIcon, TrashIcon, ArrowRightIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { CITATIONS_QL_RESPONSE } from "@/app/graphql";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ICitationsOnWorkspaceQL } from "@/app/types/ql";
import { WorkspaceContext } from "@/app/context";
import { Loader } from "@vspark/catalyst/loader";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem, DropdownLabel } from "@vspark/catalyst/dropdown";
import { DeleteGateway, IDeleteGateway } from "@vspark/catalyst/common-dialogs";

import { usePub } from "@/app/hooks";

const dateTimeFormat = (date: Date) => format(date, "Pp");
const dateFormat = (date: Date) => format(date, "P");

// All Citations On Workspace Query - Entry Stored Seperatly from Journal (As can be big)
const Q_CITATIONS_ON_WORKSPACE = gql`
    query GetCitationsOnWorkspace($workspaceId: ID!) {
        citationsOnWorkspace(workspaceId: $workspaceId) ${CITATIONS_QL_RESPONSE} 
    }
`;

// Journal Entry Query - Entry Stored Seperatly from Journal (As can be big)
const M_DELETE_CITATION = gql`
    mutation DeleteCitation($id: ID!) {
        deleteCitation(id: $id) {
            _id
        }
    }
`;

export function OptionsButton() {
    return (
        <>
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon aria-hidden="true" className="stroke-white" />
        </>
    );
}

export function Citation({
    citation,
    onGoToSource,
    onDelete,
}: {
    citation: ICitation;
    onGoToSource: (c: ICitation) => void;
    onDelete: (c: ICitation) => void;
}) {
    const onDragStartCb = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.dataTransfer.setData("citation", JSON.stringify(citation));
        },
        [citation]
    );
    return (
        <div className="bg-zinc-900 mb-2 cursor-move rounded-sm" draggable={true} onDragStart={onDragStartCb}>
            <div className="px-4 py-5">
                <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                        <img
                            alt=""
                            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            className="h-10 w-10 rounded-full"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white">
                            <span>
                                {citation.company.title} {`(${citation.company.ticker})`}
                            </span>
                            <span>
                                <ChevronRightIcon className="h-6 w-6 inline-block" />
                            </span>
                            <span>
                                {citation.filing.name}
                                <Badge className="ml-2" color="zinc">
                                    {"Period: " + dateFormat(citation.filing.period)}
                                </Badge>
                                <Badge className="ml-1" color="zinc">
                                    {"Filed: " + dateFormat(citation.filing.filedOn)}
                                </Badge>
                            </span>
                        </p>
                        <p className="text-sm text-white/50">{dateTimeFormat(citation.updatedAt)}</p>
                    </div>
                    <div className="flex flex-shrink-0 self-center">
                        <Dropdown>
                            <DropdownButton plain aria-label="More options" className="h-12 w-12">
                                <OptionsButton />
                            </DropdownButton>
                            <DropdownMenu>
                                <DropdownItem onClick={() => onGoToSource(citation)}>
                                    <ArrowRightIcon />
                                    <DropdownLabel>Source</DropdownLabel>
                                </DropdownItem>
                                <DropdownItem onClick={() => onDelete(citation)}>
                                    <TrashIcon />
                                    <DropdownLabel>Delete</DropdownLabel>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-5">
                <p className="text-white/75">{citation.text}</p>
            </div>
        </div>
    );
}

function CitationsLoader() {
    return (
        <div className="">
            <Loader />
        </div>
    );
}

export function Citations() {
    const [deleteCitationGateway, setDeleteCitationGateway] = useState<IDeleteGateway>({
        name: "",
        isOpen: false,
        deleteAction: () => {},
    });

    const workspaceContext = useContext(WorkspaceContext);
    if (!workspaceContext) {
        return;
    }
    const { workspace } = workspaceContext;

    // Mutators
    const [deleteCitation, {}] = useMutation(M_DELETE_CITATION, {
        update(cache, { data: { deleteCitation } }) {
            // After Citation Removed. Update Cache So It Will Refetch Citations
            cache.evict({ fieldName: "citationsOnWorkspace" });
            cache.evict({ fieldName: "citationsOnFiling" });
        },
    });

    // Event Aggregator For Certain Actions
    const publish = usePub();

    const onGoToSourceCb = useCallback(
        (citation: ICitation) => {
            publish("filing:navigate:scroll", {
                company: citation.company,
                filing: citation.filing,
                scrollTo: citation._id,
            });
        },
        [publish]
    );

    const deleteCitationCb = useCallback(
        (citation: ICitation) => {
            setDeleteCitationGateway({
                name: "<citation_name>",
                isOpen: true,
                deleteAction: () => {
                    deleteCitation({
                        variables: { id: citation._id },
                    });
                },
            });
        },
        [setDeleteCitationGateway, deleteCitation]
    );

    // Citations On Workspace Query
    const { loading, error, data } = useQuery<ICitationsOnWorkspaceQL>(Q_CITATIONS_ON_WORKSPACE, {
        variables: { workspaceId: workspace._id },
    });

    // Saftey Gate - If Loading or No Data
    if (loading || !data) {
        return <CitationsLoader />;
    }

    return (
        <>
            <DeleteGateway
                title="Delete Citation"
                entity="Citation"
                gateway={deleteCitationGateway}
                setDeleteGateway={setDeleteCitationGateway}
            />
            <div className="h-full">
                <ul className="px-2 pt-2">
                    {data.citationsOnWorkspace.map((citation) => (
                        <Citation
                            key={citation._id}
                            citation={citation}
                            onGoToSource={onGoToSourceCb}
                            onDelete={deleteCitationCb}
                        />
                    ))}
                </ul>
            </div>
        </>
    );
}
