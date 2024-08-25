import { XCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

export interface Toast {
    id: string;
    message: string;
    duration?: number;
    visible: boolean;
}

export const ErrorToast = (t: Toast) => (
    <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full flex rounded-md bg-red-600 p-2`}>
        <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <XCircleIcon aria-hidden="true" className="h-12 w-12 text-white" />
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-base font-medium text-white">{t.message}</p>
                </div>
            </div>
        </div>
    </div>
);
