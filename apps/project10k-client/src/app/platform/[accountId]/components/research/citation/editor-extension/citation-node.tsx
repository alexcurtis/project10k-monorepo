import { useCallback } from "react";
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { Button } from "@vspark/catalyst/button";

import { usePub } from "@platform/hooks";
import { ICompany, ICompanyFiling } from "@platform/types/entities";

interface ICitationProps {
    node: Node & {
        attrs: {
            _id: string;
            company: ICompany;
            filing: ICompanyFiling;
        };
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
}

function Citation(props: ICitationProps) {
    const { node } = props;
    const { attrs } = node;
    const publish = usePub();
    const onNavigateToFilingCb = useCallback(() => {
        publish("filing:navigate:scroll", { company: attrs.company, filing: attrs.filing, scrollTo: attrs._id });
    }, [publish, attrs]);
    return (
        <NodeViewWrapper className="citation text-white flex flex-row relative min-h-9">
            <div className="flex-none w-2 bg-yellow-400 rounded-sm" />
            <div className="flex-grow ml-4">
                <p>{node.content.content[0].content.content[0].text}</p>
            </div>
            <div className="absolute -right-14 top-0 h-full w-10">
                <Button outline onClick={onNavigateToFilingCb}>
                    <ArrowRightIcon className="stroke-white" />
                </Button>
            </div>
        </NodeViewWrapper>
    );
}

export const CitationNode = Node.create({
    name: "citation-node",
    group: "block",
    defining: true,
    isolating: true,
    atom: true,
    draggable: true,
    addAttributes() {
        return {
            _id: {
                default: null,
            },
            company: {
                default: null,
            },
            filing: {
                default: null,
            },
            updatedAt: {
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
        return ReactNodeViewRenderer(Citation);
    },
});

export default CitationNode;
