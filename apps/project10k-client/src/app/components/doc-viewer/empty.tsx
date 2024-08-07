import { Input } from "@vspark/catalyst/input";
import { PlusIcon, DocumentPlusIcon } from "@heroicons/react/20/solid";
import { CompanySearch } from "./search";

const people = [
    {
        name: "Lindsay Walton",
        role: "Front-end Developer",
        imageUrl:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
        name: "Courtney Henry",
        role: "Designer",
        imageUrl:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
        name: "Tom Cook",
        role: "Director of Product",
        imageUrl:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
];

export function EmptyDocViewer() {
    return (
        <div className="mx-auto max-w-lg pt-10">
            <div>
                <div className="text-center">
                    <DocumentPlusIcon className="text-center h-20 w-20 text-zinc-400 inline-block" />
                    <h2 className="mt-2 text-lg font-semibold leading-6 text-white">Add a company document</h2>
                    <p className="mt-1 text-base text-zinc-400">
                        It looks like you haven’t added any documents to your workspace. Try adding one by searching for
                        a company below.
                    </p>
                </div>
                <CompanySearch />
            </div>
        </div>
    );
}
