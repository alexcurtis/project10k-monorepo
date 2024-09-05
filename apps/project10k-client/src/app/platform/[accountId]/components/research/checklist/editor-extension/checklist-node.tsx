import dynamic from "next/dynamic";
import { useCallback } from "react";
import { ICheckListScale } from "@/app/platform/[accountId]/types/entities";
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { StaticMathFieldProps } from "react-mathquill";
import ReactSlider from "react-slider";

const StaticMathField = dynamic<StaticMathFieldProps>(
    () => import("react-mathquill").then((mod) => mod.StaticMathField),
    {
        ssr: false,
    }
);

import { CheckListStateIcons } from "@platform/checklists/treeview";

import "@platform/checklists/mathquill.css";
import { Button } from "@vspark/catalyst/button";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";

interface ICheckListLeafNodeProps {
    updateAttributes: Function;
    node: Node & {
        attrs: {
            _id: string;
            locked: boolean;
            question: string;
            why: string;
            formula: string;
            metric: string;
            textual: boolean;
            scale: ICheckListScale;
            scaleAnswer: number;
            passFailAnswer: boolean;
        };
    };
}

function GetThemeFromScaleAnswer(scale: ICheckListScale, scaleAnswer: number) {
    const { pass, fail, danger, amazing } = CheckListStateIcons;
    if (scaleAnswer >= scale.amazing) {
        return amazing;
    }
    if (scaleAnswer >= scale.pass) {
        return pass;
    }
    if (scaleAnswer >= scale.danger) {
        return danger;
    }
    return fail;
}

function MetricScale({
    value,
    scale,
    onScaleChanged,
}: {
    value: number;
    scale: ICheckListScale;
    onScaleChanged: (n: number) => void;
}) {
    const max = scale.amazing;
    const { bgColour, icon } = GetThemeFromScaleAnswer(scale, value);
    return (
        <ReactSlider
            className="h-12"
            min={0}
            max={max}
            marks
            value={value}
            onChange={(value: number) => onScaleChanged(value)}
            renderTrack={({ key, ...props }) => (
                <div key={key} {...props} className="h-12 cursor-grab rounded-lg bg-zinc-800" />
            )}
            renderThumb={({ key, ...props }, state) => (
                <div
                    key={key}
                    {...props}
                    className={`text-xl h-12 w-20 ${bgColour} text-center p-2 rounded-lg cursor-grab`}
                >
                    {icon} {state.valueNow}
                </div>
            )}
        />
    );
}

function MetricPassFail({
    value,
    scale,
    onScaleChanged,
}: {
    value: boolean;
    scale: ICheckListScale;
    onScaleChanged: (v: boolean) => void;
}) {
    // Create A Binary Switch From Numerical Values
    const numericalValue = value ? 1 : 0;
    const strValueFromNumber = (num: number) => {
        return num ? "Yes" : "No";
    };
    const baseClass = "text-xl w-20 bg-red-600 text-center p-2 rounded-lg cursor-pointer";
    return (
        <ReactSlider
            className="h-12 w-44"
            min={0}
            max={1}
            marks={[0, 1]}
            value={numericalValue}
            onChange={(value: number) => onScaleChanged(value === 1)}
            renderMark={({ key, ...props }) => (
                <span key={key} {...props} className={`${baseClass} bg-zinc-600`}>
                    {strValueFromNumber(key as number)}
                </span>
            )}
            renderThumb={({ key, ...props }, state) => (
                <div key={key} {...props} className={`${baseClass} ${state.valueNow ? "bg-green-600" : "bg-red-600"}`}>
                    {strValueFromNumber(state.valueNow)}
                </div>
            )}
        />
    );
}

function CheckListQuestion({
    question,
    metric,
    scale,
    scaleAnswer,
    passFailAnswer,
}: {
    question: string;
    metric: string;
    scale: ICheckListScale;
    scaleAnswer: number;
    passFailAnswer: boolean;
}) {
    const { pass, fail, danger, amazing } = CheckListStateIcons;
    let theme = null;
    if (metric === "PASS_FAIL") {
        theme = passFailAnswer ? pass : fail;
    }
    if (metric === "SCALE") {
        theme = GetThemeFromScaleAnswer(scale, scaleAnswer);
    }
    const textColour = theme ? theme.textColour : "text-white";
    return (
        <h2 className={textColour}>
            {theme ? theme.icon : null} {question}
        </h2>
    );
}

function CheckListLeaf(props: ICheckListLeafNodeProps) {
    const { node, updateAttributes } = props;
    const { attrs } = node;
    const { locked, question, why, formula, textual, metric, scale, scaleAnswer, passFailAnswer } = attrs;

    const onScaleAnswerChanged = useCallback(
        (scaleAnswer: number) => {
            updateAttributes({ scaleAnswer });
        },
        [updateAttributes]
    );

    const onPassFailAnswerChanged = useCallback(
        (passFailAnswer: boolean) => {
            updateAttributes({ passFailAnswer });
        },
        [updateAttributes]
    );

    const onLockedChanged = useCallback(() => {
        updateAttributes({ locked: !locked });
    }, [updateAttributes, locked]);

    return (
        <NodeViewWrapper className="checklist-node text-white bg-zinc-900 p-4 rounded-sm">
            <div className="">
                <h2 contentEditable={false}>
                    <CheckListQuestion
                        question={question}
                        metric={metric}
                        scale={scale}
                        scaleAnswer={scaleAnswer}
                        passFailAnswer={passFailAnswer}
                    />
                </h2>
                <p className="italic" contentEditable={false}>
                    {why}
                </p>
                <div className="flex">
                    <StaticMathField className="flex-grow" contentEditable={false}>
                        {formula}
                    </StaticMathField>
                    <Button outline className="flex-none" onClick={onLockedChanged}>
                        {locked ? <LockOpenIcon /> : <LockClosedIcon />}
                    </Button>
                </div>
                {textual ? (
                    <NodeViewContent
                        contentEditable={!locked}
                        as="p"
                        className="content is-editable p-4 bg-zinc-950 min-h-28 rounded-sm border border-solid border-zinc-800"
                    />
                ) : null}
                {metric === "SCALE" ? (
                    <MetricScale value={scaleAnswer} scale={scale} onScaleChanged={onScaleAnswerChanged} />
                ) : null}
                {metric === "PASS_FAIL" ? (
                    <MetricPassFail value={passFailAnswer} scale={scale} onScaleChanged={onPassFailAnswerChanged} />
                ) : null}
            </div>
        </NodeViewWrapper>
    );
}

export const CheckListLeafNode = Node.create({
    name: "checklistleafnode",
    group: "block",
    content: "block*",
    isolating: true,
    draggable: true,
    addAttributes() {
        return {
            _id: {
                default: null,
            },
            locked: {
                default: false,
            },
            question: {
                default: null,
            },
            why: {
                default: null,
            },
            formula: {
                default: null,
            },
            metric: {
                default: null,
            },
            textual: {
                default: null,
            },
            scale: {
                default: {
                    danger: 0,
                    fail: 0,
                    pass: 0,
                    amazing: 0,
                },
            },
            scaleAnswer: {
                default: 0,
            },
            passFailAnswer: {
                default: false,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "div",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(CheckListLeaf);
    },
});

interface ICheckListParentNodeProps {
    node: Node & {
        attrs: {
            _id: string;
            name: string;
        };
    };
}

function CheckListParent(props: ICheckListParentNodeProps) {
    const { node } = props;
    const { attrs } = node;
    const { name } = attrs;

    return (
        <NodeViewWrapper className="checklist-node text-white bg-zinc-900 p-4 rounded-sm">
            <div className="">
                <h2 className="mb-1 text-zinc-300" contentEditable={false}>
                    {name}
                </h2>
                <NodeViewContent className="content" />
            </div>
        </NodeViewWrapper>
    );
}

export const CheckListParentNode = Node.create({
    name: "checklistparentnode",
    group: "block",
    content: "(checklistparentnode|checklistleafnode)*",
    isolating: true,
    draggable: true,
    addAttributes() {
        return {
            _id: {
                default: null,
            },
            name: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "div",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(CheckListParent);
    },
});
