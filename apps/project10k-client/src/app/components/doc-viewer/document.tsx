import React, { useRef, useEffect, useState, useContext } from "react";
import { DocViewerContext } from "./context";
import { DocViewerHeader } from "./header";
import { Loader } from "@vspark/catalyst/loader";
import { gql, useMutation } from "@apollo/client";
import { WorkspaceContext } from "@/app/context";
import { CITATIONS_QL_RESPONSE } from "@/app/graphql";

// Citation Add Mutation
const M_ADD_CITATION_TO_JOURNAL = gql`
    mutation AddCitationToJournal($id: ID!, $citation: InputCitation!) {
        addCitationToJournal(id: $id, citation: $citation) {
            _id
            ${CITATIONS_QL_RESPONSE}
        }
    }
`;

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

export function CompanyDocument() {
    const { docViewerQuery } = useContext(DocViewerContext);
    const [html, setHtml] = useState("");
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const workspaceContext = useContext(WorkspaceContext);

    // Mutators
    const [addCitationToJournal, {}] = useMutation(M_ADD_CITATION_TO_JOURNAL);

    const { filing } = docViewerQuery;
    const { company } = docViewerQuery;
    const { activeJournal, workspace } = workspaceContext;

    // Get All Citations From Workspace That Relate To This Filing
    const citations = workspace.journals.flatMap((workspace) => {
        return workspace.citations.flatMap((citation) => {
            return citation.filing === filing._id ? citation : [];
        });
    });

    console.log("CITATIONS FOUND: ", citations);

    // If For Some (Strange) Reason No Active Journal. TODO - Make This An Error Gate
    if (!activeJournal) {
        return;
    }

    useEffect(() => {
        const handleIframeLoad = () => {
            const iframeDocument = iframeRef.current?.contentDocument;
            if (!iframeDocument) return;

            const handleMouseUp = () => {
                const selection = iframeDocument.getSelection();
                const selectedString = selection?.toString();
                if (selectedString && selection) {
                    const range = selection.getRangeAt(0);
                    const serialisedRange = serialiseRange(range);
                    // saveHighlight(selectedString, serializedRange);

                    console.log("GONNA SAVE THIS HIGHLIGHT AS A CITATION", {
                        variables: {
                            id: activeJournal,
                            citation: {
                                text: selectedString,
                                range: serialisedRange,
                                company: company._id,
                                filing: filing._id,
                                embeddedOnJournalEntry: false,
                            },
                        },
                    });

                    addCitationToJournal({
                        variables: {
                            id: activeJournal,
                            citation: {
                                text: selectedString,
                                range: serialisedRange,
                                company: company._id,
                                filing: filing._id,
                            },
                        },
                    });

                    highlightSelection(range);

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
    }, [addCitationToJournal, activeJournal, company, filing]);

    //   useEffect(() => {
    //     // loadCitations();
    //   }, []);

    useEffect(() => {
        if (html) {
            const iframe = iframeRef.current;
            iframe?.addEventListener("load", loadCitations);

            return () => {
                iframe?.removeEventListener("load", loadCitations);
            };
        }
    }, [html]);

    useEffect(() => {
        const url = `http://localhost:3005/apidbdocproxy/document?path=${filing.path}&filename=${filing.filename}`;
        const fetchData = async () => {
            const response = await fetch(url);
            const htmly = await response.text();
            setHtml(htmly);
        };
        fetchData();
    }, [filing, setHtml]);

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

    const loadCitations = async () => {
        const iframeDocument = iframeRef.current?.contentDocument;
        if (!iframeDocument) return;

        citations.forEach((citation) => {
            try {
                const range = deserialiseRange(iframeDocument, citation.range);
                highlightSelection(range);
            } catch (error) {
                console.error("Error loading highlights", error);
            }
        });

        // try {
        //     const responseStr = localStorage.getItem("10k:highlights");
        //     if (!responseStr) {
        //         return;
        //     }
        //     const response = JSON.parse(responseStr);
        //     const iframeDocument = iframeRef.current?.contentDocument;
        //     if (!iframeDocument) return;
        //     response.forEach((highlight) => {
        //         const range = deserialiseRange(iframeDocument, JSON.parse(highlight.range));
        //         highlightSelection(range);
        //     });
        // } catch (error) {
        //     console.error("Error loading highlights", error);
        // }
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

    // const saveHighlight = async (text: string, range: string) => {
    //     try {
    //         const payload = { text, range };
    //         const existingStr = localStorage.getItem("10k:highlights");
    //         const existing = existingStr ? JSON.parse(existingStr) : [];
    //         existing.push(payload);
    //         localStorage.setItem("10k:highlights", JSON.stringify(existing));
    //         //   await axios.post('http://localhost:5000/save-highlight', { text, range });
    //     } catch (error) {
    //         console.error("Error saving highlight", error);
    //     }
    // };

    const highlightSelection = (range: Range) => {
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;

        const highlightNode = (node: Node, startOffset?: number, endOffset?: number) => {
            const span = document.createElement("span");
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
            highlightNode(startContainer, range.startOffset, range.endOffset);
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
            textNodes.forEach((node) => {
                highlightNode(node);
            });

            // Highlight The Start and End Containers
            highlightNode(startContainer, range.startOffset, startContainer.textContent?.length ?? 0);
            highlightNode(endContainer, 0, range.endOffset);
        }
    };

    // TODO - THIS BUSTS THE HIGHLIGHTING.
    // if (!html) {
    //     return <Loader />;
    // }
    return (
        <div className="px-4 pb-4 h-full w-full flex flex-col">
            <DocViewerHeader />
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <iframe
                    ref={iframeRef}
                    srcDoc={html}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    title="Selectable Content"
                />
            </div>
        </div>
    );
}
