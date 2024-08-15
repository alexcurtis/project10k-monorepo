import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { usePub } from "@/app/hooks";
import { Button } from "@vspark/catalyst/button";
import { useCallback } from "react";
import { ICompany, ICompanyFiling } from "@/app/types/entities";

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
    console.log("NODE VIEW CITIATION props", props);
    const { node } = props;
    const { attrs } = node;
    const publish = usePub();
    const onNavigateToFilingCb = useCallback(() => {
        publish("filing:navigate:scroll", { company: attrs.company, filing: attrs.filing, scrollTo: attrs._id });
    }, [node]);
    return (
        <NodeViewWrapper className="citation  text-white flex flex-row relative">
            <div className="flex-none w-2 bg-yellow-400 rounded-sm" />
            <div className="flex-grow ml-4">
                <p>{node.content.content[0].content.content[0].text}</p>
            </div>
            <div className="absolute right-0 top-0">
                <Button onClick={onNavigateToFilingCb}>GO GO GO!</Button>
            </div>
        </NodeViewWrapper>

        // <NodeViewWrapper className="citation bg-indigo-400/25 p-2 rounded-sm text-white outline outline-2 outline-indigo-300/25">
        //     <p>{node.content.content[0].content.content[0].text}</p>
        //     <Button onClick={onNavigateToFilingCb}>GO GO GO!</Button>
        // </NodeViewWrapper>
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
