'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import { useQuery, gql } from '@apollo/client';

import { useState } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
} from '@headlessui/react'
import {
    ChartBarSquareIcon,
    Cog6ToothIcon,
    FolderIcon,
    GlobeAltIcon,
    ServerIcon,
    SignalIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon, ChevronRightIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { Loader } from '@vspark/catalyst/loader';
import { ApolloAppProvider } from '@/app/graphql';
import { IWorkspace } from '@/app/types/entities';
import { IWorkspaceQL } from '@/app/types/ql';

const Q_MY_WORKSPACE = gql`query GetWorkspace($id: String!) {
    workspace(id: $id){
        id,
        name,
        created_at,
        updated_at,
        companies {
            id, name
        }
    }
}`;

const navigation = [
    { name: 'Projects', href: '#', icon: FolderIcon, current: false },
    { name: 'Deployments', href: '#', icon: ServerIcon, current: true },
    { name: 'Activity', href: '#', icon: SignalIcon, current: false },
    { name: 'Domains', href: '#', icon: GlobeAltIcon, current: false },
    { name: 'Usage', href: '#', icon: ChartBarSquareIcon, current: false },
    { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: false },
]
const teams = [
    { id: 1, name: 'Planetaria', href: '#', initial: 'P', current: false },
    { id: 2, name: 'Protocol', href: '#', initial: 'P', current: false },
    { id: 3, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
]
const statuses = {
    offline: 'text-gray-500 bg-gray-100/10',
    online: 'text-green-400 bg-green-400/10',
    error: 'text-rose-400 bg-rose-400/10',
}
const environments = {
    Preview: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
    Production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
}
const deployments = [
    {
        id: 1,
        href: '#',
        projectName: 'ios-app',
        teamName: 'Planetaria',
        status: 'offline',
        statusText: 'Initiated 1m 32s ago',
        description: 'Deploys from GitHub',
        environment: 'Preview',
    },
    // More deployments...
]
const activityItems = [
    {
        user: {
            name: 'Michael Foster',
            imageUrl:
                'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        projectName: 'ios-app',
        commit: '2d89f0c8',
        branch: 'main',
        date: '1h',
        dateTime: '2023-01-23T11:00',
    },
    // More items...
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


function Header() {
    return (
        <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h1 className="text-base font-semibold leading-7 text-white">Deployments</h1>

            {/* Sort dropdown */}
            <Menu as="div" className="relative">
                <MenuButton className="flex items-center gap-x-1 text-sm font-medium leading-6 text-white">
                    Sort by
                    <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-500" />
                </MenuButton>
                <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    <MenuItem>
                        <a href="#" className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">
                            Name
                        </a>
                    </MenuItem>
                    <MenuItem>
                        <a href="#" className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">
                            Date updated
                        </a>
                    </MenuItem>
                    <MenuItem>
                        <a href="#" className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">
                            Environment
                        </a>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </header>
    );
}

function SearchHeader() {
    return (
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
            {/* <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-white xl:hidden">
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon aria-hidden="true" className="h-5 w-5" />
            </button> */}

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form action="#" method="GET" className="flex flex-1">
                    <label htmlFor="search-field" className="sr-only">
                        Search
                    </label>
                    <div className="relative w-full">
                        <MagnifyingGlassIcon
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                        />
                        <input
                            id="search-field"
                            name="search"
                            type="search"
                            placeholder="Search..."
                            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-sm"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}


function Sidebar() {
    return (
        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
                <div className="flex h-16 shrink-0 items-center">
                    <img
                        alt="Your Company"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        className="h-8 w-auto"
                    />
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <a
                                            href={item.href}
                                            className={classNames(
                                                item.current
                                                    ? 'bg-gray-800 text-white'
                                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                            )}
                                        >
                                            <item.icon aria-hidden="true" className="h-6 w-6 shrink-0" />
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li>
                            <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                                {teams.map((team) => (
                                    <li key={team.name}>
                                        <a
                                            href={team.href}
                                            className={classNames(
                                                team.current
                                                    ? 'bg-gray-800 text-white'
                                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                            )}
                                        >
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                                {team.initial}
                                            </span>
                                            <span className="truncate">{team.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="-mx-6 mt-auto">
                            <a
                                href="#"
                                className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                            >
                                <img
                                    alt=""
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    className="h-8 w-8 rounded-full bg-gray-800"
                                />
                                <span className="sr-only">Your profile</span>
                                <span aria-hidden="true">Tom Cook</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

function Aside() {
    return (
        <aside className="bg-black/10 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
            <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <h2 className="text-base font-semibold leading-7 text-white">Activity feed</h2>
                <a href="#" className="text-sm font-semibold leading-6 text-indigo-400">
                    View all
                </a>
            </header>
            <ul role="list" className="divide-y divide-white/5">
                {activityItems.map((item) => (
                    <li key={item.commit} className="px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-x-3">
                            <img alt="" src={item.user.imageUrl} className="h-6 w-6 flex-none rounded-full bg-gray-800" />
                            <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-white">{item.user.name}</h3>
                            <time dateTime={item.dateTime} className="flex-none text-xs text-gray-600">
                                {item.date}
                            </time>
                        </div>
                        <p className="mt-3 truncate text-sm text-gray-500">
                            Pushed to <span className="text-gray-400">{item.projectName}</span> (
                            <span className="font-mono text-gray-400">{item.commit}</span> on{' '}
                            <span className="text-gray-400">{item.branch}</span>)
                        </p>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

function Content() {
    return (
        <></>
    );
}
function WorkspaceLayout({ workspaceId }: { workspaceId: string }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { loading, error, data } = useQuery<IWorkspaceQL>(Q_MY_WORKSPACE, {
        variables: { id: workspaceId }
    });
    if (loading || !data) { return (<Loader />); }
    const workspace = data.workspace;
    return (
        <div>
            <Sidebar />
            <div className="xl:pl-72">
                <SearchHeader />
                <main className="lg:pr-96">
                    <Header />
                    <Content />
                </main>
                <Aside />
            </div>
        </div>
    );
}

function WorkspacePage({ params }: { params: { workspaceId: string } }) {
    return (
        <div className="dark min-h-screen w-full bg-zinc-950">
            <ApolloAppProvider>
                <WorkspaceLayout workspaceId={params.workspaceId} />
            </ApolloAppProvider>
        </div>
    );
}

// Turn Off SSR for Main App
export default dynamic(async () => WorkspacePage, { ssr: false });