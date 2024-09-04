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

import "@platform/checklists/mathquill.css";

interface ICheckListNodeProps {
    updateAttributes: Function;
    node: Node & {
        attrs: {
            _id: string;
            question: string;
            why: string;
            formula: string;
            metric: string;
            textual: boolean;
            scale: ICheckListScale;
            scaleAnswer: number;
            passFailAnswer: boolean;
            content: {
                content: [
                    {
                        type: string;
                        content: {
                            content: [
                                {
                                    type: string;
                                    text: string;
                                }
                            ];
                        };
                    }
                ];
            };
        };
    };
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
    const min = scale.fail;
    const max = scale.amazing;
    return (
        <ReactSlider
            className="h-10"
            thumbClassName="example-thumb1"
            trackClassName="example-track1"
            min={min}
            max={max}
            value={value}
            onChange={(value: number) => onScaleChanged(value)}
            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
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
    return (
        <ReactSlider
            className="h-10"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            min={0}
            max={1}
            marks={[0, 1]}
            value={numericalValue}
            onChange={(value: number) => onScaleChanged(value === 1)}
            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        />
    );
}

function CheckListStateIcon({
    metric,
    scale,
    scaleAnswer,
    passFailAnswer,
}: {
    metric: string;
    scale: ICheckListScale;
    scaleAnswer: number;
    passFailAnswer: boolean;
}) {
    // TODO - MAKE THIS REUSABLE BETWEEN THIS AND THE CHECKLIST EDITABLE VIEW
    const icons = {
        fail: "❌",
        danger: "🧨",
        pass: "✅",
        amazing: "🎉",
    };
    console.log("scaleAnswer >= scale.danger", scaleAnswer, scale.danger);
    if (metric === "PASS_FAIL") {
        return passFailAnswer ? icons.pass : icons.fail;
    }
    if (metric === "SCALE") {
        if (scaleAnswer >= scale.amazing) {
            return icons.amazing;
        }
        if (scaleAnswer >= scale.pass) {
            return icons.pass;
        }
        if (scaleAnswer >= scale.danger) {
            return icons.danger;
        }
        return icons.fail;
    }
}

function CheckListLeaf(props: ICheckListNodeProps) {
    const { node, updateAttributes } = props;
    const { attrs } = node;
    const { _id, question, why, formula, textual, metric, scale, scaleAnswer, passFailAnswer } = attrs;

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

    return (
        <NodeViewWrapper className="checklist-node text-white bg-zinc-900 p-4 rounded-sm">
            <div className="">
                <h2 contentEditable={false}>
                    <CheckListStateIcon
                        metric={metric}
                        scale={scale}
                        scaleAnswer={scaleAnswer}
                        passFailAnswer={passFailAnswer}
                    />{" "}
                    {question}
                </h2>
                <p className="italic" contentEditable={false}>
                    {why}
                </p>
                <StaticMathField>{formula}</StaticMathField>
                {textual ? (
                    <NodeViewContent
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
    name: "checklist-leaf-node",
    group: "block",
    content: "block*",
    isolating: true,
    draggable: true,
    addAttributes() {
        return {
            _id: {
                default: null,
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

// export default CitationNode;
