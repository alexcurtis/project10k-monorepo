import { BookOpenIcon } from "@heroicons/react/24/solid";

export function EmptyJournal() {
    return (
        <div className="mx-auto max-w-lg pt-40">
            <div>
                <div className="text-center">
                    <BookOpenIcon className="text-center h-20 w-20 text-zinc-400 inline-block" />
                    <h2 className="mt-2 text-lg font-semibold leading-6 text-white">No Journal Selected</h2>
                    <p className="mt-1 text-base text-zinc-400">
                        It looks like you haven’t selected a Journal from your workspace.
                    </p>
                </div>
            </div>
        </div>
    );
}
