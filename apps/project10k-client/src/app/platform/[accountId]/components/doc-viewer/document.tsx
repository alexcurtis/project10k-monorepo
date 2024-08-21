import React, { useRef, useEffect, useState, useContext } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";

import { Loader } from "@vspark/catalyst/loader";

import { DocViewerContext } from "./context";
import { WorkspaceContext } from "@platform/context";
import { CITATIONS_QL_RESPONSE, COMPANY_FILING_QL_RESPONSE } from "@platform/graphql";
import { ICompanyFilingDatasetQL } from "@platform/types/ql";
import { ICitation } from "@platform/types/entities";

// Filing Query
const Q_COMPANY_FILING_DATASET = gql`
    query GetCompanyFilingDataset($workspaceId: ID!, $filingId: ID!) {
        companyFiling(id: $filingId) ${COMPANY_FILING_QL_RESPONSE}
        citationsOnFiling(workspaceId: $workspaceId filingId: $filingId) ${CITATIONS_QL_RESPONSE}
    }
`;

// TODO ^^ NEEDS TO BE THE CITATIONS ON THE FILING ON THE WORKSPACE

// Citation Create Mutation
const M_CREATE_CITATION = gql`
    mutation CreateCitation($citation: InputCitationDto!) {
        createCitation(citation: $citation) ${CITATIONS_QL_RESPONSE}
    }
`;

// Highlight ID Generator From Citation
function generateHighlightId(citationId: string, index?: string | number) {
    const realIndex = index ? index : 0;
    return `${citationId}-${realIndex}`;
}

// Tree Walker Iterator
function iterateWalker(walker: TreeWalker) {
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            const value = walker.nextNode();
            return { value, done: !value };
        },
    };
}

// Test If Node Is Text Or Not
function hasText(node: { textContent: string }) {
    return /\S/.test(node.textContent);
}

const serialiseRange = (range: Range) => {
    const { startContainer, startOffset, endContainer, endOffset } = range;
    return {
        startContainerPath: getNodePath(startContainer),
        startOffset,
        endContainerPath: getNodePath(endContainer),
        endOffset,
    };
};

const getNodePath = (node: Node) => {
    if (!node) {
        throw new Error("Node is null");
    }
    const path: number[] = [];
    while (node) {
        const parentNode = node.parentNode;
        if (!parentNode) break;
        path.unshift(Array.prototype.indexOf.call(parentNode.childNodes, node));
        node = parentNode;
    }
    return path;
};

const loadCitations = async (iframeRef, citations: ICitation[]) => {
    const iframeDocument = iframeRef.current?.contentDocument;
    if (!iframeDocument) return;

    citations.forEach((citation: ICitation) => {
        try {
            const range = deserialiseRange(iframeDocument, citation.range);
            highlightSelection(citation._id, range);
        } catch (error) {
            console.error("Error loading highlights", error);
        }
    });
};

const deserialiseRange = (document: Document, serializedRange: any) => {
    const { startContainerPath, startOffset, endContainerPath, endOffset } = serializedRange;
    const startContainer = getNodeFromPath(document, startContainerPath);
    const endContainer = getNodeFromPath(document, endContainerPath);
    const range = document.createRange();
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
    return range;
};

const getNodeFromPath = (document: Document, path: number[]) => {
    let node: Node | null = document;
    path.forEach((index) => {
        if (node) {
            node = node.childNodes[index];
        }
    });
    return node;
};

const highlightSelection = (citationId: string, range: Range) => {
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;

    const highlightNode = (id: string, node: Node, startOffset?: number, endOffset?: number) => {
        const span = document.createElement("span");
        span.setAttribute("id", id);
        span.style.backgroundColor = "yellow";
        const rangePart = document.createRange();
        if (startOffset !== undefined && endOffset !== undefined) {
            rangePart.setStart(node, startOffset);
            rangePart.setEnd(node, endOffset);
        } else {
            rangePart.selectNodeContents(node);
        }
        rangePart.surroundContents(span);
    };

    if (startContainer === endContainer) {
        // Create Unique ID
        const nodeId = generateHighlightId(citationId);
        highlightNode(nodeId, startContainer, range.startOffset, range.endOffset);
    } else {
        // Walk Through Nodes Between The Start and End Containers
        const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                return range.intersectsNode(node) && node !== startContainer && node !== endContainer
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
            },
        });

        // Highlight The Inter-Nodes
        const textNodes = [...iterateWalker(walker)].filter(hasText);
        textNodes.forEach((node, index) => {
            if (!node) {
                return;
            }
            // Create A Unique ID From Citation Id and Index
            const nodeId = generateHighlightId(citationId, index + 1);
            highlightNode(nodeId, node);
        });

        // Highlight The Start and End Containers
        highlightNode(
            generateHighlightId(citationId),
            startContainer,
            range.startOffset,
            startContainer.textContent?.length ?? 0
        );
        highlightNode(generateHighlightId(citationId, textNodes.length), endContainer, 0, range.endOffset);
    }
};

const scrollToHightlight = (iFrameRef, highlightId) => {
    const iframeDocument = iFrameRef.current?.contentDocument;
    if (!iframeDocument || !highlightId) return;
    iframeDocument.getElementById(highlightId)?.scrollIntoView({
        behavior: "smooth",
    });
};

export function CompanyDocument() {
    const { docViewerQuery } = useContext(DocViewerContext);
    const [html, setHtml] = useState("");
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const workspaceContext = useContext(WorkspaceContext);
    const { workspace } = workspaceContext;
    const { company } = docViewerQuery;

    // Mutators
    const [createCitation, {}] = useMutation(M_CREATE_CITATION, {
        update(cache, { data: { createCitation } }) {
            // After Citation Added. Update Cache So It Will Refetch Citations
            cache.evict({ fieldName: "citationsOnWorkspace" });
            cache.evict({ fieldName: "citationsOnFiling" });
        },
    });

    // Query
    const { loading, error, data } = useQuery<ICompanyFilingDatasetQL>(Q_COMPANY_FILING_DATASET, {
        variables: { workspaceId: workspace._id, filingId: docViewerQuery.filing._id },
    });

    const { scrollTo } = docViewerQuery;
    const scrollToHighlightId = scrollTo ? generateHighlightId(scrollTo) : null;

    useEffect(() => {
        // If IFrame Is Already Rendered. Scroll To The Correct Place (If Required)
        scrollToHightlight(iframeRef, scrollToHighlightId);
    }, [iframeRef, scrollToHighlightId]);

    console.log("RENDERING COMPANY DOCUMENT", data);

    useEffect(() => {
        if (!data) {
            return;
        }
        const { companyFiling } = data;
        const { path, filename } = companyFiling;
        const url = `http://localhost:3005/apidbdocproxy/document?path=${path}&filename=${filename}`;
        const fetchData = async () => {
            const response = await fetch(url);
            const htmly = await response.text();
            setHtml(htmly);
        };
        fetchData();
    }, [data, setHtml]);

    useEffect(() => {
        if (!data || !company) {
            return;
        }
        const { companyFiling } = data;
        const handleIframeLoad = () => {
            const iframeDocument = iframeRef.current?.contentDocument;
            if (!iframeDocument) return;

            const handleMouseUp = () => {
                const selection = iframeDocument.getSelection();
                const selectedString = selection?.toString();
                if (selectedString && selection) {
                    const range = selection.getRangeAt(0);
                    const serialisedRange = serialiseRange(range);
                    const id = uuidv4();
                    createCitation({
                        variables: {
                            citation: {
                                _id: id,
                                workspace: workspace._id,
                                text: selectedString,
                                range: serialisedRange,
                                company: company._id,
                                filing: companyFiling._id,
                            },
                        },
                    });

                    highlightSelection(id, range);

                    selection.removeAllRanges();
                }
            };

            iframeDocument.addEventListener("mouseup", handleMouseUp);

            return () => {
                iframeDocument.removeEventListener("mouseup", handleMouseUp);
            };
        };

        const iframe = iframeRef.current;
        iframe?.addEventListener("load", handleIframeLoad);

        return () => {
            iframe?.removeEventListener("load", handleIframeLoad);
        };
    }, [iframeRef, createCitation, data, company]);

    useEffect(() => {
        if (!data || !html) {
            return;
        }

        const onIframeLoad = () => {
            loadCitations(iframeRef, data.citationsOnFiling);
            scrollToHightlight(iframeRef, scrollToHighlightId);
        };

        if (data && html) {
            const iframe = iframeRef.current;
            iframe?.addEventListener("load", onIframeLoad);

            return () => {
                iframe?.removeEventListener("load", onIframeLoad);
            };
        }
    }, [data, html, workspace, iframeRef, scrollToHighlightId]);

    if (loading || !data) {
        return (
            <div className="p-4">
                <Loader />
            </div>
        );
    }

    const { companyFiling } = data;

    return (
        <div className="px-4 pb-4 h-full w-full flex flex-col">
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <iframe
                    ref={iframeRef}
                    srcDoc={html}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    title="Document Viewer"
                />
            </div>
        </div>
    );
}
