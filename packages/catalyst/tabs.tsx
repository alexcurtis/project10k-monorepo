export interface ITab {
    id: string;
    name: string;
}

export function Tab({ tab, selectedTab, onClick }: { tab: ITab; selectedTab: string; onClick: (tab: ITab) => void }) {
    return (
        <li onClick={() => onClick(tab)} className="cursor-pointer">
            <span className={tab.id === selectedTab ? "text-indigo-400" : ""}>{tab.name}</span>
        </li>
    );
}

export function Tabs({
    tabs,
    selectedTab,
    onClick,
}: {
    tabs: ITab[];
    selectedTab: string;
    onClick: (tab: ITab) => void;
}) {
    return (
        <nav className="flex border-b border-white/10 py-4">
            <ul
                role="list"
                className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400"
            >
                {tabs.map((tab) => (
                    <Tab key={tab.name} tab={tab} selectedTab={selectedTab} onClick={onClick} />
                ))}
            </ul>
        </nav>
    );
}
