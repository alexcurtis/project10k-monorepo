"use client";
import { ElementType } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { FolderIcon, AcademicCapIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";

interface SidebarItem {
    name: string;
    href: string;
    icon: ElementType;
}

const navigation: SidebarItem[] = [
    { name: "Workspaces", href: "/workspaces", icon: FolderIcon },
    { name: "Log Out", href: "/logout", icon: ArrowRightStartOnRectangleIcon },
];

function Logo() {
    return (
        <>
            <div className="flex h-16 shrink-0 items-center">
                <AcademicCapIcon className="size-11 text-zinc-200" />
            </div>
        </>
    );
}

const ACTIVE_ITEM_CLASSNAMES = "bg-zinc-800 text-white";
const INACTIVE_ITEM_CLASSNAMES = "text-zinc-400 hover:bg-zinc-800 hover:text-white";

function SidebarItem({ item, pathname }: { item: SidebarItem; pathname: string }) {
    const active = pathname === item.href;
    const classNames = active ? ACTIVE_ITEM_CLASSNAMES : INACTIVE_ITEM_CLASSNAMES;
    return (
        <li>
            <Link legacyBehavior={true} passHref href={item.href}>
                <a className={`${classNames} group flex gap-x-3 rounded-md p-2 text-base font-semibold leading-6`}>
                    <item.icon aria-hidden="true" className="h-6 w-6 shrink-0" />
                    {item.name}
                </a>
            </Link>
        </li>
    );
}

export function ApplicationLinks({ pathname }: { pathname: string }) {
    return (
        <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                    <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                            <SidebarItem key={item.name} pathname={pathname} item={item} />
                        ))}
                    </ul>
                </li>
            </ul>
        </nav>
    );
}

export function Sidebar() {
    const pathname = usePathname();
    return (
        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-48 xl:flex-col h-screen">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
                <Logo />
                <ApplicationLinks pathname={pathname} />
            </div>
        </div>
    );
}
