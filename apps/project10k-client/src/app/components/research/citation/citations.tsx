import { DragEvent, useCallback, useState } from "react";
import { format } from "date-fns";
import { ICitation } from "@/app/types/entities";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { CodeBracketIcon, EllipsisVerticalIcon, FlagIcon, StarIcon } from "@heroicons/react/20/solid";
import { Badge } from "@vspark/catalyst/badge";
import { ITab, Tabs } from "@vspark/catalyst/tabs";

const dateTimeFormat = (date: Date) => format(date, "Pp");
const dateFormat = (date: Date) => format(date, "P");

export function Citation({ citation, onDragged }: { citation: ICitation; onDragged: (citation: ICitation) => void }) {
    const onDragStartCb = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.dataTransfer.setData("citation", JSON.stringify(citation));
        },
        [citation]
    );

    const onDragEndCb = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            const dropEffect = event.dataTransfer.dropEffect;
            // Check If Drop Was Successful. If Not. Abort
            if (dropEffect === "none") {
                return;
            }
            if (onDragged) {
                onDragged(citation);
            }
        },
        [citation, onDragged]
    );

    return (
        <div
            className="bg-zinc-900 mb-2 cursor-move rounded-sm"
            draggable={true}
            onDragStart={onDragStartCb}
            onDragEnd={onDragEndCb}
        >
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
                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <MenuButton className="-m-2 flex items-center rounded-full p-2 text-white hover:text-gray-600">
                                    <span className="sr-only">Open options</span>
                                    <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
                                </MenuButton>
                            </div>

                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                            >
                                <div className="py-1">
                                    <MenuItem>
                                        <a
                                            href="#"
                                            className="flex px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                        >
                                            <StarIcon aria-hidden="true" className="mr-3 h-5 w-5 text-gray-400" />
                                            <span>Add to favorites</span>
                                        </a>
                                    </MenuItem>
                                    <MenuItem>
                                        <a
                                            href="#"
                                            className="flex px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                        >
                                            <CodeBracketIcon
                                                aria-hidden="true"
                                                className="mr-3 h-5 w-5 text-gray-400"
                                            />
                                            <span>Embed</span>
                                        </a>
                                    </MenuItem>
                                    <MenuItem>
                                        <a
                                            href="#"
                                            className="flex px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                        >
                                            <FlagIcon aria-hidden="true" className="mr-3 h-5 w-5 text-gray-400" />
                                            <span>Report content</span>
                                        </a>
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-5">
                <p className="text-white/75">{citation.text}</p>
            </div>
        </div>
    );
}

interface ITabCitations extends ITab {
    filter: (citations: ICitation[]) => ICitation[];
}

const tabs: ITabCitations[] = [
    {
        id: "new",
        name: "New Citations",
        filter: (citations: ICitation[]) => citations.filter((citation) => !citation.embeddedOnJournalEntry),
    },
    {
        id: "all",
        name: "All Citations",
        filter: (citations: ICitation[]) => citations,
    },
];

export function Citations({
    citations,
    onDragged,
}: {
    citations: ICitation[];
    onDragged: (citation: ICitation) => void;
}) {
    // Default To New Citations Tab
    const [selectedTab, setSelectedTab] = useState("new");
    const displayedCitations = tabs.find((tab) => tab.id === selectedTab)?.filter(citations) || [];

    // Set Tab Callback On Tab Click
    const setTabCb = useCallback(
        (tab: ITab) => {
            setSelectedTab(tab.id);
        },
        [setSelectedTab]
    );

    return (
        <>
            <Tabs tabs={tabs} selectedTab={selectedTab} onClick={setTabCb} />
            <ul className="px-2 pt-2">
                {displayedCitations.map((citation) => (
                    <Citation key={citation._id} citation={citation} onDragged={onDragged} />
                ))}
            </ul>
        </>
    );
}
