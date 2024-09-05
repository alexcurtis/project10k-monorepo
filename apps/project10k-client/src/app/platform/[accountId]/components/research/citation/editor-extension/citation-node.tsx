import { useCallback } from "react";
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { ArrowRightIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

import { Button } from "@vspark/catalyst/button";

import { usePub } from "@platform/hooks";
import { ICompany, ICompanyFiling } from "@platform/types/entities";
import { dateFormat, dateTimeFormat, GenerateCompanyLogoSrcUrl } from "@platform/components/doc-viewer/citations";
import { Badge } from "@vspark/catalyst/badge";

interface ICitationProps {
    node: Node & {
        attrs: {
            _id: string;
            company: ICompany;
            filing: ICompanyFiling;
            updatedAt: Date;
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
    const { company, filing } = attrs;
    const publish = usePub();
    const onNavigateToFilingCb = useCallback(() => {
        publish("filing:navigate:scroll", { company, filing, scrollTo: attrs._id });
    }, [publish, attrs]);
    const logoSrc = GenerateCompanyLogoSrcUrl(company.ticker[0]);
    return (
        <NodeViewWrapper className="citation text-white flex flex-row relative min-h-9">
            <div className="flex-none w-2 bg-yellow-400 rounded-sm" />
            <div className="flex-grow">
                <div className="flex flex-col">
                    <div className="flex-none ml-4 mb-2">
                        <div className="flex space-x-3">
                            <div className="h-12 w-12">
                                <img className="rounded-sm" src={logoSrc} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-white !m-0">
                                    <span>
                                        {company.title} {`(${company.ticker})`}
                                    </span>
                                    <span>
                                        <ChevronRightIcon className="h-6 w-6 inline-block" />
                                    </span>
                                    <span>
                                        {filing.name}
                                        <Badge className="ml-2" color="zinc">
                                            {"Period: " + dateFormat(filing.period)}
                                        </Badge>
                                        <Badge className="ml-1" color="zinc">
                                            {"Filed: " + dateFormat(filing.filedOn)}
                                        </Badge>
                                    </span>
                                </p>
                                <p className="text-sm text-white/50 !m-0">{dateTimeFormat(attrs.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow ml-4">
                        <p>{node.content.content[0].content.content[0].text}</p>
                    </div>
                </div>
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
