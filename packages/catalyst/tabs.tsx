import { ReactNode } from "react";

export interface ITab {
    id: any;
    name: string;
}

export function Tab({ tab, selectedTab, onClick }: { tab: ITab; selectedTab: any; onClick: (tab: ITab) => void }) {
    return (
        <li onClick={() => onClick(tab)} className="cursor-pointer leading-9">
            <span className={tab.id === selectedTab ? "text-indigo-400" : ""}>{tab.name}</span>
        </li>
    );
}

export function Tabs({ tabs, selectedTab, onClick }: { tabs: ITab[]; selectedTab: any; onClick: (tab: ITab) => void }) {
    return (
        <ul role="list" className="flex gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400">
            {tabs.map((tab) => (
                <Tab key={tab.name} tab={tab} selectedTab={selectedTab} onClick={onClick} />
            ))}
        </ul>
    );
}

export function TabsUnderline({ children }: { children: ReactNode }) {
    return <nav className="flex border-b border-white/30 py-2">{children}</nav>;
}
