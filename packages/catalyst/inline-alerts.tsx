import React from "react";
import { XCircleIcon } from "@heroicons/react/20/solid";

interface IInlineError {
    headline: string;
    className?: string;
    errors?: { message: string }[];
}

export function InlineError({ headline, errors, className }: IInlineError) {
    const classNameExt = className ? className : "";
    return (
        <div className={`rounded-md bg-red-600 p-4 ${classNameExt}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <XCircleIcon aria-hidden="true" className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                    <h3 className="text-base font-medium text-white">{headline}</h3>
                    <div className="mt-2 text-sm text-white">
                        <ul role="list" className="list-disc space-y-1 pl-5">
                            {errors ? errors.map((error) => <li>{error.message}</li>) : null}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
