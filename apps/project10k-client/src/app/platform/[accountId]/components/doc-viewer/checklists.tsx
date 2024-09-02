"use client";
import dynamic from "next/dynamic";
import React from "react";
import { useQuery } from "@apollo/client";
import { BriefcaseIcon } from "@heroicons/react/24/solid";

import { Loader } from "@vspark/catalyst/loader";
import { Q_MY_ACCOUNT } from "@platform/graphql";
import { IAccountQL } from "@platform/types/ql";
import { CheckListTree } from "@platform/checklists/treeview";

function PageLoader() {
    return (
        <div className="p-4">
            <Loader />
        </div>
    );
}

export function CheckLists() {
    // TODO - GET THIS FROM CONTEXT
    const accountId = "66c713cc625eaacab9ebb0bf";

    // Account Query + Root Checklists
    const { loading, data } = useQuery<IAccountQL>(Q_MY_ACCOUNT, {
        variables: { id: accountId },
    });

    if (loading || !data) {
        return <PageLoader />;
    }

    const { checklists } = data.account;
    return (
        <>
            <div className="p-4">
                <CheckListTree checklists={checklists} />
            </div>
        </>
    );
}
