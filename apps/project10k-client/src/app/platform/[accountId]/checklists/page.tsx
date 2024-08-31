"use client";
import dynamic from "next/dynamic";
import React, { FormEvent, useCallback, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { EditableMathField } from "react-mathquill";

import { Loader } from "@vspark/catalyst/loader";

import { M_UPDATE_CHECKLIST, Q_CHECKLIST, Q_MY_ACCOUNT } from "@platform/graphql";
import { IAccountQL, ICheckListQL } from "@platform/types/ql";
import { ICheckList } from "@platform/types/entities";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button } from "@vspark/catalyst/button";
import { DescriptionList, DescriptionTerm, DescriptionDetails } from "@vspark/catalyst/description-list";
import { Field } from "@vspark/catalyst/fieldset";
import { Select } from "@vspark/catalyst/select";
import { Input } from "@vspark/catalyst/input";
import { Switch } from "@vspark/catalyst/switch";

import "./mathquill.css";
import { PrimaryActionButton } from "@vspark/catalyst/buttons";

function PageLoader() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <Loader />
        </div>
    );
}

function BranchLoader() {
    return (
        <div className="">
            <Loader />
        </div>
    );
}

function LeafEdit({ checklist, onCancel }: { checklist: ICheckList; onCancel: () => void }) {
    const [question, setQuestion] = useState(checklist.question);
    const [why, setWhy] = useState(checklist.why);
    const [formula, setFormula] = useState(checklist.formula);
    const [metric, setMetric] = useState(checklist.metric);
    const [textual, setTextual] = useState<boolean>(checklist.textual || false);
    const [updateCheckList, { loading }] = useMutation(M_UPDATE_CHECKLIST);

    const onSubmitCb = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            updateCheckList({
                variables: {
                    id: checklist._id,
                    checklist: {
                        question,
                        why,
                        formula,
                        metric,
                        textual,
                    },
                },
                onCompleted: () => onCancel(),
            });
            event.preventDefault();
        },
        [updateCheckList, checklist, question, why, formula, metric, textual]
    );

    return (
        <li className="p-4 bg-zinc-900 mb-2 cursor-move rounded-sm">
            <div className="p-4">
                <form onSubmit={onSubmitCb}>
                    <DescriptionList>
                        <DescriptionTerm className="leading-9">Question</DescriptionTerm>
                        <DescriptionDetails className="leading-9">
                            <Field>
                                <Input name="question" value={question} onChange={(e) => setQuestion(e.target.value)} />
                            </Field>
                        </DescriptionDetails>
                        <DescriptionTerm className="leading-9">Why? (Optional)</DescriptionTerm>
                        <DescriptionDetails className="leading-9">
                            <Field>
                                <Input name="why" value={why} onChange={(e) => setWhy(e.target.value)} />
                            </Field>
                        </DescriptionDetails>
                        <DescriptionTerm className="leading-9">Formula (Optional)</DescriptionTerm>
                        <DescriptionDetails>
                            <Field>
                                <EditableMathField latex={formula} onChange={(e) => setFormula(e.latex())} />
                            </Field>
                        </DescriptionDetails>
                        <DescriptionTerm className="leading-9">Metric</DescriptionTerm>
                        <DescriptionDetails className="leading-9">
                            <Field className="w-64">
                                <Select name="metric" value={metric} onChange={(e) => setMetric(e.target.value)}>
                                    <option value="PASS_FAIL">Pass/Fail</option>
                                    <option value="SCALE">Scale</option>
                                    <option value="NONE">None</option>
                                </Select>
                            </Field>
                        </DescriptionDetails>
                        {metric === "SCALE" ? (
                            <>
                                <DescriptionTerm className="leading-9">Scale</DescriptionTerm>
                                <DescriptionDetails className="leading-9">
                                    {checklist.scale?.amazing}
                                </DescriptionDetails>
                            </>
                        ) : null}
                        <DescriptionTerm className="leading-9">Textual Answer</DescriptionTerm>
                        <DescriptionDetails className="leading-9">
                            <Field>
                                <Switch name="textual" checked={textual} onChange={(e) => setTextual(e)} />
                            </Field>
                        </DescriptionDetails>
                    </DescriptionList>
                    <div className="flex justify-end">
                        <Button outline onClick={onCancel}>
                            Cancel
                        </Button>
                        <PrimaryActionButton loading={loading} disabled={loading} label="Save" className="ml-2" />
                    </div>
                </form>
            </div>
        </li>
    );
}

function LeafReadOnly({ checklist, onEdit }: { checklist: ICheckList; onEdit: (v: boolean) => void }) {
    const [hover, setHover] = useState(false);
    const onMouseEnterCb = useCallback(() => {
        setHover(true);
    }, [setHover]);
    const onMouseLeaveCb = useCallback(() => {
        setHover(false);
    }, [setHover]);
    return (
        <li
            className="p-4 bg-zinc-900 mb-2 cursor-move rounded-sm"
            onMouseEnter={onMouseEnterCb}
            onMouseLeave={onMouseLeaveCb}
        >
            <div className="p-4">
                <div className="flex">
                    <div className="flex-grow">
                        <p className="text-base leading-9">{checklist.question}</p>
                    </div>
                    <div className={`flex-none ${hover ? "visible" : "invisible"}`}>
                        <div className="flex">
                            <Button onClick={() => onEdit(true)} className="ml-2">
                                <PencilIcon />
                            </Button>
                            <Button color="red" className="ml-2">
                                <TrashIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}

function Leaf({ checklist }: { checklist: ICheckList }) {
    const [edit, setEdit] = useState(false);
    const onEditCb = useCallback((value: boolean) => setEdit(value), [setEdit]);
    return edit ? (
        <LeafEdit checklist={checklist} onCancel={() => onEditCb(false)} />
    ) : (
        <LeafReadOnly checklist={checklist} onEdit={onEditCb} />
    );
}

function Parent({ checklist }: { checklist: ICheckList }) {
    const { children } = checklist;
    return (
        <li className="pl-4">
            <div className="p-4">
                <p className="text-base text-zinc-400">{checklist.name}</p>
                {children ? <CheckListGroup checklists={children} /> : null}
            </div>
        </li>
    );
}

function Branch({ checklist }: { checklist: ICheckList }) {
    // Checklist Branch Query
    const { loading, data } = useQuery<ICheckListQL>(Q_CHECKLIST, {
        variables: { id: checklist._id },
    });

    if (loading || !data) {
        return <BranchLoader />;
    }

    // Only Parents Have Names
    const { name } = data.checklist;
    return (
        <ul role="list" className="">
            {name ? (
                <Parent key={checklist._id} checklist={data.checklist} />
            ) : (
                <Leaf key={checklist._id} checklist={data.checklist} />
            )}
        </ul>
    );
}

function CheckListGroup({ checklists }: { checklists: ICheckList[] | undefined }) {
    if (!checklists) {
        return null;
    }
    return (
        <>
            {checklists.map((checklist) => (
                <Branch key={checklist._id} checklist={checklist} />
            ))}
        </>
    );
}

function CheckLists({ accountId }: { accountId: string }) {
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
            <CheckListGroup checklists={checklists} />
        </>
    );
}

function CheckListsPage({ params }: { params: { accountId: string } }) {
    return (
        <>
            <div className="dark min-h-screen w-full bg-zinc-950">
                <CheckLists accountId={params.accountId} />
            </div>
        </>
    );
}

// Turn Off SSR for Main App
export default dynamic(async () => CheckListsPage, { ssr: false });
