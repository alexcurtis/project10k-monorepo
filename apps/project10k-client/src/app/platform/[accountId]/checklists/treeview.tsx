"use client";
import dynamic from "next/dynamic";
import React, { DragEvent, ChangeEvent, FormEvent, useCallback, useState, createContext, useContext } from "react";
import { ApolloClient, gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { EditableMathFieldProps } from "react-mathquill";

import { Loader } from "@vspark/catalyst/loader";

import { CHECKLIST_QL_RESPONSE, M_UPDATE_CHECKLIST, Q_CHECKLIST, Q_MY_ACCOUNT } from "@platform/graphql";
import { ICheckListQL } from "@platform/types/ql";
import { ICheckList, ICheckListScale } from "@platform/types/entities";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
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

interface ICheckListContext {
    editable: boolean;
}

export const CheckListContext = createContext<ICheckListContext>({
    editable: false,
});

export const CheckListStateIcons = {
    fail: { icon: "👎", textColour: "text-red-600", bgColour: "bg-red-600" },
    danger: { icon: "🧨", textColour: "text-yellow-600", bgColour: "bg-yellow-600" },
    pass: { icon: "👍", textColour: "text-green-600", bgColour: "bg-green-600" },
    amazing: { icon: "🎉", textColour: "text-indigo-500", bgColour: "bg-indigo-600" },
};

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
    const [scale, setScale] = useState<ICheckListScale>(
        checklist.scale || { min: 0, max: 0, danger: 0, fail: 0, pass: 0, amazing: 0 }
    );

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
                            min: scale.min,
                            max: scale.max,
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
                                    name="scale_min"
                                    label="Min"
                                    labelClassName="text-white"
                                    value={scale.min}
                                    onChange={(e) => setScale({ ...scale, min: Number(e.target.value) })}
                                />
                                <ScaleAttribute
                                    name="scale_max"
                                    label="Max"
                                    labelClassName="text-white"
                                    value={scale.max}
                                    onChange={(e) => setScale({ ...scale, max: Number(e.target.value) })}
                                />
                                <ScaleAttribute
                                    name="scale_danger"
                                    label={`Fail ${CheckListStateIcons.fail.icon}`}
                                    labelClassName={CheckListStateIcons.fail.textColour}
                                    value={scale.fail}
                                    onChange={(e) => setScale({ ...scale, fail: Number(e.target.value) })}
                                />
                                <ScaleAttribute
                                    name="scale_fail"
                                    label={`Danger ${CheckListStateIcons.danger.icon}`}
                                    labelClassName={CheckListStateIcons.danger.textColour}
                                    value={scale.danger}
                                    onChange={(e) => setScale({ ...scale, danger: Number(e.target.value) })}
                                />
                                <ScaleAttribute
                                    name="scale_pass"
                                    label={`Pass ${CheckListStateIcons.pass.icon}`}
                                    labelClassName={CheckListStateIcons.pass.textColour}
                                    value={scale.pass}
                                    onChange={(e) => setScale({ ...scale, pass: Number(e.target.value) })}
                                />
                                <ScaleAttribute
                                    name="scale_amazing"
                                    label={`Amazing ${CheckListStateIcons.amazing.icon}`}
                                    labelClassName={CheckListStateIcons.amazing.textColour}
                                    className="mb-0"
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

// Both Parent and Leaf Have Same ReadOnly Node
function ReadOnlyNode({ checklist, onEdit }: { checklist: ICheckList; onEdit: (v: boolean) => void }) {
    const { editable } = useContext(CheckListContext);
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
                        {editable ? (
                            <div className="flex">
                                {/* Only Parents (With a Name Can Create Sub Groups / CheckLists) */}
                                {checklist.name ? (
                                    <>
                                        <Button onClick={() => onEdit(true)} className="ml-2">
                                            <PlusIcon /> New Group
                                        </Button>
                                        <Button onClick={() => onEdit(true)} className="ml-2">
                                            <PlusIcon /> New Check
                                        </Button>
                                    </>
                                ) : null}
                                <Button onClick={() => onEdit(true)} className="ml-2">
                                    <PencilIcon />
                                </Button>
                                <Button color="red" className="ml-2">
                                    <TrashIcon />
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </li>
    );
}

function Leaf({ checklist, root }: { checklist: ICheckList; root?: boolean }) {
    const { editable } = useContext(CheckListContext);
    const [edit, setEdit] = useState(false);
    const onEditCb = useCallback((value: boolean) => setEdit(value), [setEdit]);
    const ident = !root ? "ml-3" : "";
    return (
        <div className={ident}>
            {edit ? (
                <LeafEdit checklist={checklist} onCancel={() => onEditCb(false)} />
            ) : (
                <ReadOnlyNode checklist={checklist} onEdit={onEditCb} />
            )}
        </div>
    );
}

function Parent({ checklist, root }: { checklist: ICheckList; root?: boolean }) {
    const [edit, setEdit] = useState(false);
    const onEditCb = useCallback((value: boolean) => setEdit(value), [setEdit]);
    const { children } = checklist;
    const ident = !root ? "ml-4" : "";
    return (
        <div className={`${ident} border-l-4 border-indigo-400`}>
            {edit ? (
                <ParentEdit checklist={checklist} onCancel={() => onEditCb(false)} />
            ) : (
                <ReadOnlyNode checklist={checklist} onEdit={onEditCb} />
            )}
            {children ? <CheckListTree parent={checklist} checklists={children} /> : null}
        </div>
    );
}

function Node({ checklist, root }: { checklist: ICheckList; root?: boolean }) {
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
        },
        [client, data]
    );

    if (loading || !data) {
        return <NodeLoader />;
    }

    // Only Parents Have Names
    const { name } = data.checklist;
    // Do Not Style Root Nodes
    const className = !root
        ? "ml-1 before:absolute before:border-t-4 before:border-solid before:border-indigo-400 before:top-8 before:w-5 before:left-px"
        : "";
    return (
        <ul role="list" className="relative">
            <div draggable={true} onDragStart={onDragStartCb} className={className}>
                {name ? (
                    <Parent key={checklist._id} checklist={data.checklist} root={root} />
                ) : (
                    <Leaf key={checklist._id} checklist={data.checklist} root={root} />
                )}
            </div>
        </ul>
    );
}

function CheckListTree({ parent, checklists }: { parent?: ICheckList; checklists: ICheckList[] | undefined }) {
    if (!checklists) {
        return null;
    }
    return (
        <>
            {checklists.map((checklist) => (
                <Node key={checklist._id} checklist={checklist} root={parent ? false : true} />
            ))}
        </>
    );
}

export function CheckListComponent({ editable, checklists }: { editable: boolean; checklists?: ICheckList[] }) {
    return (
        <CheckListContext.Provider value={{ editable }}>
            <CheckListTree checklists={checklists} />
        </CheckListContext.Provider>
    );
}
