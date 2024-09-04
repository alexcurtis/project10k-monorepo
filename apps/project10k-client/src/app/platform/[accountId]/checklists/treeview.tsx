"use client";
import dynamic from "next/dynamic";
import React, { DragEvent, ChangeEvent, FormEvent, useCallback, useState } from "react";
import { ApolloClient, gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { EditableMathFieldProps } from "react-mathquill";

import { Loader } from "@vspark/catalyst/loader";

import { CHECKLIST_QL_RESPONSE, M_UPDATE_CHECKLIST, Q_CHECKLIST, Q_MY_ACCOUNT } from "@platform/graphql";
import { ICheckListQL } from "@platform/types/ql";
import { ICheckList, ICheckListScale } from "@platform/types/entities";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button } from "@vspark/catalyst/button";
import { PrimaryActionButton } from "@vspark/catalyst/buttons";
import { DescriptionList, DescriptionTerm, DescriptionDetails } from "@vspark/catalyst/description-list";
import { Field } from "@vspark/catalyst/fieldset";
import { Select } from "@vspark/catalyst/select";
import { Input } from "@vspark/catalyst/input";
import { Switch } from "@vspark/catalyst/switch";

const EditableMathField = dynamic<EditableMathFieldProps>(
    () => import("react-mathquill").then((mod) => mod.EditableMathField),
    {
        ssr: false,
    }
);

import "./mathquill.css";

// Build Out The CheckList Tree From The Apollo Cache
function GetCheckListTreeFromApolloCache(client: ApolloClient<object>, node: ICheckList): ICheckList {
    const id = `CheckList:${node._id}`;
    const checklist = client.readFragment<ICheckList>({
        id, // Checklist Cache ID
        fragment: gql`
            fragment CheckList on CheckList ${CHECKLIST_QL_RESPONSE}
        `,
    });
    // For Some Reason Not Found In Cache. As Node Has Bare-Bones CheckList Data. Better To Return That
    if (!checklist) {
        return node;
    }
    const { children } = checklist;
    // Populate The Children (Recursion)
    const populatedChildren = children?.map((child) => {
        return GetCheckListTreeFromApolloCache(client, child);
    });
    return { ...checklist, children: populatedChildren };
}

function NodeLoader() {
    return (
        <>
            <Loader />
        </>
    );
}

function ScaleAttribute({
    value,
    onChange,
    label,
    name,
    className,
    labelClassName,
}: {
    value: number;
    onChange: (v: ChangeEvent<HTMLInputElement>) => void;
    label: string;
    name: string;
    className?: string;
    labelClassName: string;
}) {
    return (
        <Field className={`flex mb-2 ${className}`}>
            <p className={`${labelClassName} flex-none w-24`}>{label}</p>
            <Input name={name} className="flex-grow ml-2" value={value} onChange={onChange} />
        </Field>
    );
}

function LeafEdit({ checklist, onCancel }: { checklist: ICheckList; onCancel: () => void }) {
    const [question, setQuestion] = useState(checklist.question);
    const [why, setWhy] = useState(checklist.why);
    const [formula, setFormula] = useState(checklist.formula);
    const [metric, setMetric] = useState(checklist.metric);
    const [textual, setTextual] = useState<boolean>(checklist.textual || false);
    const [scale, setScale] = useState<ICheckListScale>(checklist.scale || { danger: 0, fail: 0, pass: 0, amazing: 0 });

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
                        scale: {
                            danger: scale.danger,
                            fail: scale.fail,
                            pass: scale.pass,
                            amazing: scale.amazing,
                        },
                    },
                },
                onCompleted: () => onCancel(),
            });
            event.preventDefault();
        },
        [updateCheckList, checklist, question, why, formula, metric, textual, scale]
    );

    return (
        <li className="px-4 pt-1 pb-4 bg-zinc-900 mb-4 cursor-move rounded-sm">
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
                                <ScaleAttribute
                                    name="scale_danger"
                                    label="Fail ❌"
                                    labelClassName="text-red-500"
                                    value={scale.fail}
                                    onChange={(e) => setScale({ ...scale, fail: Number(e.target.value) })}
                                />
                                <ScaleAttribute
                                    name="scale_fail"
                                    label="Danger 🧨"
                                    labelClassName="text-yellow-500"
                                    value={scale.danger}
                                    onChange={(e) => setScale({ ...scale, danger: Number(e.target.value) })}
                                />
                                <ScaleAttribute
                                    name="scale_pass"
                                    label="Pass ✅"
                                    labelClassName="text-green-500"
                                    value={scale.pass}
                                    onChange={(e) => setScale({ ...scale, pass: Number(e.target.value) })}
                                />
                                <ScaleAttribute
                                    name="scale_amazing"
                                    label="Amazing 🎉"
                                    className="mb-0"
                                    labelClassName="text-white"
                                    value={scale.amazing}
                                    onChange={(e) => setScale({ ...scale, amazing: Number(e.target.value) })}
                                />
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
        </li>
    );
}

function ParentEdit({ checklist, onCancel }: { checklist: ICheckList; onCancel: () => void }) {
    const [name, setName] = useState(checklist.name);
    const [updateCheckList, { loading }] = useMutation(M_UPDATE_CHECKLIST);

    const onSubmitCb = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            updateCheckList({
                variables: {
                    id: checklist._id,
                    checklist: {
                        name,
                    },
                },
                onCompleted: () => onCancel(),
            });
            event.preventDefault();
        },
        [updateCheckList, checklist, name]
    );

    return (
        <li className="px-4 pt-1 pb-4 bg-zinc-900 mb-4 cursor-move rounded-sm">
            <form onSubmit={onSubmitCb}>
                <DescriptionList>
                    <DescriptionTerm className="leading-9">Name</DescriptionTerm>
                    <DescriptionDetails className="leading-9">
                        <Field>
                            <Input name="name" value={name} onChange={(e) => setName(e.target.value)} />
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
        </li>
    );
}

function ReadOnlyNode({ checklist, onEdit }: { checklist: ICheckList; onEdit: (v: boolean) => void }) {
    const [hover, setHover] = useState(false);
    const onMouseEnterCb = useCallback(() => {
        setHover(true);
    }, [setHover]);
    const onMouseLeaveCb = useCallback(() => {
        setHover(false);
    }, [setHover]);
    const { name, question } = checklist;
    return (
        <li className="cursor-move mb-4" onMouseEnter={onMouseEnterCb} onMouseLeave={onMouseLeaveCb}>
            <div className="p-4 bg-zinc-900 rounded-sm">
                <div className="flex">
                    <div className="flex-grow">
                        <p className="text-base leading-9">{name ? name : question}</p>
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
    return (
        <div className="ml-3">
            {edit ? (
                <LeafEdit checklist={checklist} onCancel={() => onEditCb(false)} />
            ) : (
                <ReadOnlyNode checklist={checklist} onEdit={onEditCb} />
            )}
        </div>
    );
}

function Parent({ checklist }: { checklist: ICheckList }) {
    const [edit, setEdit] = useState(false);
    const onEditCb = useCallback((value: boolean) => setEdit(value), [setEdit]);
    const { children } = checklist;
    return (
        <div className="ml-4 border-l-4 border-indigo-400">
            {edit ? (
                <ParentEdit checklist={checklist} onCancel={() => onEditCb(false)} />
            ) : (
                <ReadOnlyNode checklist={checklist} onEdit={onEditCb} />
            )}
            {children ? <CheckListTree checklists={children} /> : null}
        </div>
    );
}

function Node({ checklist }: { checklist: ICheckList }) {
    const client = useApolloClient();
    // Checklist Node Query
    const { loading, data } = useQuery<ICheckListQL>(Q_CHECKLIST, {
        variables: { id: checklist._id },
    });

    const onDragStartCb = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            // Stop Drag Event Bubbling Up To Parent (Tree View)
            event.stopPropagation();
            if (!data) {
                return;
            }
            const populatedCheckList = GetCheckListTreeFromApolloCache(client, data.checklist);
            event.dataTransfer.setData("checklist", JSON.stringify(populatedCheckList));
            console.log("checklist", populatedCheckList);
            console.log("checklist json", JSON.stringify(populatedCheckList));
        },
        [client, data]
    );

    if (loading || !data) {
        return <NodeLoader />;
    }

    // Only Parents Have Names
    const { name } = data.checklist;
    return (
        <ul role="list" className="relative">
            <div
                draggable={true}
                onDragStart={onDragStartCb}
                className="ml-1 before:absolute before:border-t-4 before:border-solid before:border-indigo-400 before:top-8 before:w-5 before:left-px"
            >
                {name ? (
                    <Parent key={checklist._id} checklist={data.checklist} />
                ) : (
                    <Leaf key={checklist._id} checklist={data.checklist} />
                )}
            </div>
        </ul>
    );
}

export function CheckListTree({ checklists }: { checklists: ICheckList[] | undefined }) {
    if (!checklists) {
        return null;
    }
    return (
        <>
            {checklists.map((checklist) => (
                <Node key={checklist._id} checklist={checklist} />
            ))}
        </>
    );
}
