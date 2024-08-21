"use client";
import { ElementType } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
    Dropdown,
    DropdownButton,
    DropdownDivider,
    DropdownItem,
    DropdownLabel,
    DropdownMenu,
} from "@vspark/catalyst/dropdown";

import {
    SidebarBody,
    SidebarFooter,
    SidebarHeader,
    SidebarItem,
    SidebarLabel,
    SidebarSection,
    SidebarSpacer,
} from "@vspark/catalyst/sidebar";
import { Avatar } from "@vspark/catalyst/avatar";

import { FolderIcon, AcademicCapIcon } from "@heroicons/react/24/solid";
import { IUser } from "./types/entities";

import {
    ArrowRightStartOnRectangleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    Cog8ToothIcon,
    LightBulbIcon,
    PlusIcon,
    ShieldCheckIcon,
    UserIcon,
} from "@heroicons/react/16/solid";
import {
    Cog6ToothIcon,
    HomeIcon,
    InboxIcon,
    MagnifyingGlassIcon,
    MegaphoneIcon,
    QuestionMarkCircleIcon,
    SparklesIcon,
    Square2StackIcon,
    TicketIcon,
} from "@heroicons/react/20/solid";

interface SidebarLink {
    name: string;
    href: string;
    icon: ElementType;
}

const navigation: SidebarLink[] = [
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

function SidebarLink({ item, pathname }: { item: SidebarLink; pathname: string }) {
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
                            <SidebarLink key={item.name} pathname={pathname} item={item} />
                        ))}
                    </ul>
                </li>
            </ul>
        </nav>
    );
}

export function User({ user }: { user: IUser }) {
    return (
        <>
            <Dropdown>
                <DropdownButton as={SidebarItem}>
                    <span className="flex min-w-0 items-center gap-3">
                        <Avatar src="/profile-photo.jpg" className="size-10" square alt="" />
                        <span className="min-w-0">
                            <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                                {user.firstName}
                            </span>
                            <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                                {user.email}
                            </span>
                        </span>
                    </span>
                    <ChevronUpIcon />
                </DropdownButton>
                <DropdownMenu className="min-w-64" anchor="top start">
                    <DropdownItem href="/my-profile">
                        <UserIcon />
                        <DropdownLabel>My profile</DropdownLabel>
                    </DropdownItem>
                    <DropdownItem href="/settings">
                        <Cog8ToothIcon />
                        <DropdownLabel>Settings</DropdownLabel>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem href="/privacy-policy">
                        <ShieldCheckIcon />
                        <DropdownLabel>Privacy policy</DropdownLabel>
                    </DropdownItem>
                    <DropdownItem href="/share-feedback">
                        <LightBulbIcon />
                        <DropdownLabel>Share feedback</DropdownLabel>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem href="/logout">
                        <ArrowRightStartOnRectangleIcon />
                        <DropdownLabel>Sign out</DropdownLabel>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    );
}

export function Sidebar({ user }: { user: IUser }) {
    const pathname = usePathname();
    return (
        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-48 xl:flex-col h-screen">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
                <Logo />
                <ApplicationLinks pathname={pathname} />
                <User user={user} />
            </div>
        </div>
    );
}
