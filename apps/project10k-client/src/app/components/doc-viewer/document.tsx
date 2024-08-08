import React, { useRef, useEffect, useState, useContext } from "react";
import { DocViewerContext } from "./context";
// import axios from 'axios';
// import './HighlightIframe.css';

interface Highlight {
    text: string;
    range: string;
}

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

function hasText(node) {
    return /\S/.test(node.textContent);
}

function deepForEach(eachable, callback) {
    eachable.forEach((current) => {
        if (current.forEach) {
            deepForEach(current, callback);
        } else {
            callback(current);
        }
    });
}

// export function HtmlViewer() {
//     const [html, setHtml] = useState("");
//     const iframeRef = useRef<HTMLIFrameElement>(null);
//     const [selectedText, setSelectedText] = useState<string>("");

//     useEffect(() => {
//         const handleIframeLoad = () => {
//             const iframeDocument = iframeRef.current?.contentDocument;
//             if (!iframeDocument) return;

//             const handleMouseUp = () => {
//                 const selection = iframeDocument.getSelection();
//                 const selectedString = selection?.toString();
//                 if (selectedString && selection) {
//                     const range = selection.getRangeAt(0);
//                     const serializedRange = JSON.stringify(serializeRange(range));
//                     saveHighlight(selectedString, serializedRange);
//                     setSelectedText(selectedString);
//                     highlightSelection(range);

//                     selection.removeAllRanges();
//                 }
//             };

//             iframeDocument.addEventListener("mouseup", handleMouseUp);

//             return () => {
//                 iframeDocument.removeEventListener("mouseup", handleMouseUp);
//             };
//         };

//         const iframe = iframeRef.current;
//         iframe?.addEventListener("load", handleIframeLoad);

//         return () => {
//             iframe?.removeEventListener("load", handleIframeLoad);
//         };
//     }, []);

//     //   useEffect(() => {
//     //     // loadHighlights();
//     //   }, []);

//     useEffect(() => {
//         if (html) {
//             const iframe = iframeRef.current;
//             iframe?.addEventListener("load", loadHighlights);

//             return () => {
//                 iframe?.removeEventListener("load", loadHighlights);
//             };
//         }
//     }, [html]);

//     useEffect(() => {
//         const url = "http://localhost:3002/";
//         const fetchData = async () => {
//             const response = await fetch(url);
//             const htmly = await response.text();
//             setHtml(htmly);
//         };
//         fetchData();
//     }, [setHtml]);

//     const serializeRange = (range: Range) => {
//         const { startContainer, startOffset, endContainer, endOffset } = range;
//         return {
//             startContainerPath: getNodePath(startContainer),
//             startOffset,
//             endContainerPath: getNodePath(endContainer),
//             endOffset,
//         };
//     };

//     const getNodePath = (node: Node) => {
//         if (!node) {
//             throw new Error("Node is null");
//         }
//         const path: number[] = [];
//         while (node) {
//             const parentNode = node.parentNode;
//             if (!parentNode) break;
//             path.unshift(Array.prototype.indexOf.call(parentNode.childNodes, node));
//             node = parentNode;
//         }
//         return path;
//     };

//     const loadHighlights = async () => {
//         try {
//             const responseStr = localStorage.getItem("10k:highlights");
//             if (!responseStr) {
//                 return;
//             }
//             const response = JSON.parse(responseStr);
//             const iframeDocument = iframeRef.current?.contentDocument;
//             if (!iframeDocument) return;
//             response.forEach((highlight) => {
//                 const range = deserializeRange(iframeDocument, JSON.parse(highlight.range));
//                 highlightSelection(range);
//             });
//         } catch (error) {
//             console.error("Error loading highlights", error);
//         }
//     };

//     const deserializeRange = (document: Document, serializedRange: any) => {
//         const { startContainerPath, startOffset, endContainerPath, endOffset } = serializedRange;
//         const startContainer = getNodeFromPath(document, startContainerPath);
//         const endContainer = getNodeFromPath(document, endContainerPath);
//         const range = document.createRange();
//         range.setStart(startContainer, startOffset);
//         range.setEnd(endContainer, endOffset);
//         return range;
//     };

//     const getNodeFromPath = (document: Document, path: number[]) => {
//         let node: Node | null = document;
//         path.forEach((index) => {
//             if (node) {
//                 node = node.childNodes[index];
//             }
//         });
//         return node;
//     };

//     const saveHighlight = async (text: string, range: string) => {
//         try {
//             const payload = { text, range };
//             const existingStr = localStorage.getItem("10k:highlights");
//             const existing = existingStr ? JSON.parse(existingStr) : [];
//             existing.push(payload);
//             localStorage.setItem("10k:highlights", JSON.stringify(existing));
//             //   await axios.post('http://localhost:5000/save-highlight', { text, range });
//         } catch (error) {
//             console.error("Error saving highlight", error);
//         }
//     };

//     const highlightSelection = (range: Range) => {
//         const startContainer = range.startContainer;
//         const endContainer = range.endContainer;

//         const highlightNode = (node: Node, startOffset?: number, endOffset?: number) => {
//             const span = document.createElement("span");
//             span.style.backgroundColor = "yellow";
//             const rangePart = document.createRange();
//             if (startOffset !== undefined && endOffset !== undefined) {
//                 rangePart.setStart(node, startOffset);
//                 rangePart.setEnd(node, endOffset);
//             } else {
//                 rangePart.selectNodeContents(node);
//             }
//             rangePart.surroundContents(span);
//         };

//         if (startContainer === endContainer) {
//             highlightNode(startContainer, range.startOffset, range.endOffset);
//         } else {
//             // Walk Through Nodes Between The Start and End Containers
//             const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT, {
//                 acceptNode(node) {
//                     return range.intersectsNode(node) && node !== startContainer && node !== endContainer
//                         ? NodeFilter.FILTER_ACCEPT
//                         : NodeFilter.FILTER_REJECT;
//                 },
//             });

//             // Highlight The Inter-Nodes
//             const textNodes = [...iterateWalker(walker)].filter(hasText);
//             textNodes.forEach((node) => {
//                 highlightNode(node);
//             });

//             // Highlight The Start and End Containers
//             highlightNode(startContainer, range.startOffset, startContainer.textContent?.length ?? 0);
//             highlightNode(endContainer, 0, range.endOffset);
//         }
//     };

//     return (
//         <div style={{ position: "relative", width: "100%", height: "100%" }}>
//             <iframe
//                 ref={iframeRef}
//                 srcDoc={html}
//                 style={{ width: "100%", height: "100%", border: "none" }}
//                 title="Selectable Content"
//             />
//             <p>Selected Text: {selectedText}</p>
//         </div>
//     );
// }

export function CompanyDocument() {
    const { docViewerQuery, setDocViewerQuery } = useContext(DocViewerContext);
    const [html, setHtml] = useState("");
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [selectedText, setSelectedText] = useState<string>("");

    const location = docViewerQuery.filing?.location;

    useEffect(() => {
        const handleIframeLoad = () => {
            const iframeDocument = iframeRef.current?.contentDocument;
            if (!iframeDocument) return;

            const handleMouseUp = () => {
                const selection = iframeDocument.getSelection();
                const selectedString = selection?.toString();
                if (selectedString && selection) {
                    const range = selection.getRangeAt(0);
                    const serializedRange = JSON.stringify(serializeRange(range));
                    saveHighlight(selectedString, serializedRange);
                    setSelectedText(selectedString);
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
    }, []);

    //   useEffect(() => {
    //     // loadHighlights();
    //   }, []);

    useEffect(() => {
        if (html) {
            const iframe = iframeRef.current;
            iframe?.addEventListener("load", loadHighlights);

            return () => {
                iframe?.removeEventListener("load", loadHighlights);
            };
        }
    }, [html]);

    useEffect(() => {
        // const url = "http://localhost:3002/";

        // todo - fire to ussec proxy or something to remove cors problem....

        console.log("trying to fetch ", location);
        const fetchData = async () => {
            const response = await fetch(location);
            const htmly = await response.text();
            setHtml(htmly);
        };
        fetchData();
    }, [setHtml]);

    const serializeRange = (range: Range) => {
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

    const loadHighlights = async () => {
        try {
            const responseStr = localStorage.getItem("10k:highlights");
            if (!responseStr) {
                return;
            }
            const response = JSON.parse(responseStr);
            const iframeDocument = iframeRef.current?.contentDocument;
            if (!iframeDocument) return;
            response.forEach((highlight) => {
                const range = deserializeRange(iframeDocument, JSON.parse(highlight.range));
                highlightSelection(range);
            });
        } catch (error) {
            console.error("Error loading highlights", error);
        }
    };

    const deserializeRange = (document: Document, serializedRange: any) => {
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

    const saveHighlight = async (text: string, range: string) => {
        try {
            const payload = { text, range };
            const existingStr = localStorage.getItem("10k:highlights");
            const existing = existingStr ? JSON.parse(existingStr) : [];
            existing.push(payload);
            localStorage.setItem("10k:highlights", JSON.stringify(existing));
            //   await axios.post('http://localhost:5000/save-highlight', { text, range });
        } catch (error) {
            console.error("Error saving highlight", error);
        }
    };

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

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <iframe
                ref={iframeRef}
                srcDoc={html}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Selectable Content"
            />
            <p>Selected Text: {selectedText}</p>
        </div>
    );
}

// export function CompanyDocument() {
//     const { docViewerQuery, setDocViewerQuery } = useContext(DocViewerContext);
//     return (
//         <>
//             Document Here {docViewerQuery.company?._id} {docViewerQuery.filing?._id}
//         </>
//     );
// }

// import React, {
//     useRef,
//     useEffect,
//     useState
// } from 'react';

// interface Tooltip {
//     style: React.CSSProperties;
//     onHighlightClick: () => void;
// }

// const Tooltip: React.FC<Tooltip> = ({ style, onHighlightClick }) => {
//     return (
//         <div className="test-tooltip" style={style}>
//             <button onClick={onHighlightClick}>Highlight</button>
//         </div>
//     );
// };

// interface Highlight {
//     text: string;
//     range: string;
// }

// export function HtmlViewer() {
//     const iframeRef = useRef<HTMLIFrameElement>(null);
//     const [html, setHtml] = useState('');
//     const [selectedText, setSelectedText] = useState<string>('');
//     const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({ display: 'none' });
//     const [height, setHeight] = useState("0px");

//     useEffect(() => {
//         const handleIframeLoad = () => {
//             const iframeDocument = iframeRef.current?.contentDocument;
//             if (!iframeDocument) return;

//             const handleMouseUp = () => {
//                 const selection = iframeDocument.getSelection();
//                 const selectedString = selection?.toString();
//                 if (selectedString && selection) {
//                     const range = selection.getRangeAt(0);
//                     setSelectedText(selectedString);
//                     const rect = range.getBoundingClientRect();
//                         setTooltipStyle({
//                         display: 'block',
//                         position: 'absolute',
//                         top: `${rect.top + iframeDocument.documentElement.scrollTop}px`,
//                         left: `${rect.left + iframeDocument.documentElement.scrollLeft}px`,
//                         });

//                 } else {
//                     setTooltipStyle({ display: 'none' });
//                 }
//             };

//             iframeDocument.addEventListener('mouseup', handleMouseUp);

//             return () => {
//                 iframeDocument.removeEventListener('mouseup', handleMouseUp);
//             };
//         };

//         const iframe = iframeRef.current;
//         iframe?.addEventListener('load', handleIframeLoad);

//         return () => {
//             iframe?.removeEventListener('load', handleIframeLoad);
//         };
//     }, []);

//     useEffect(() => {
//         // loadHighlights();
//     }, []);

//     useEffect(() => {
//         const url = 'http://localhost:3002/'
//         const fetchData = async () => {
//             const response = await fetch(url);
//             const htmly = await response.text();
//             setHtml(htmly);
//         };
//         fetchData();
//     }, [setHtml]);

//     const serializeRange = (range: Range) => {
//         const { startContainer, startOffset, endContainer, endOffset } = range;
//         return {
//             startContainerPath: getNodePath(startContainer),
//             startOffset,
//             endContainerPath: getNodePath(endContainer),
//             endOffset,
//         };
//     };

//     const getNodePath = (node: Node) => {
//         if (!node) {
//             throw new Error('Node is null');
//         }
//         const path: number[] = [];
//         while (node) {
//             const parentNode = node.parentNode;
//             if (!parentNode) break;
//             path.unshift(Array.prototype.indexOf.call(parentNode.childNodes, node));
//             node = parentNode;
//         }
//         return path;
//     };

//     //   const loadHighlights = async () => {
//     //     try {
//     //       const response = await axios.get<Highlight[]>('http://localhost:5000/load-highlights');
//     //       const iframeDocument = iframeRef.current?.contentDocument;
//     //       if (!iframeDocument) return;
//     //       response.data.forEach((highlight) => {
//     //         const range = deserializeRange(iframeDocument, JSON.parse(highlight.range));
//     //         highlightSelection(range);
//     //       });
//     //     } catch (error) {
//     //       console.error('Error loading highlights', error);
//     //     }
//     //   };

//     const deserializeRange = (document: Document, serializedRange: any) => {
//         const { startContainerPath, startOffset, endContainerPath, endOffset } = serializedRange;
//         const startContainer = getNodeFromPath(document, startContainerPath);
//         const endContainer = getNodeFromPath(document, endContainerPath);
//         const range = document.createRange();
//         range.setStart(startContainer, startOffset);
//         range.setEnd(endContainer, endOffset);
//         return range;
//     };

//     const getNodeFromPath = (document: Document, path: number[]) => {
//         let node: Node | null = document;
//         path.forEach((index) => {
//             if (node) {
//                 node = node.childNodes[index];
//             }
//         });
//         return node;
//     };

//     const saveHighlight = async (text: string, range: string) => {
//         try {
//             console.log('highlight', { text, range });
//             //   await axios.post('http://localhost:5000/save-highlight', { text, range });
//         } catch (error) {
//             console.error('Error saving highlight', error);
//         }
//     };

//     const highlightSelection = (range: Range) => {
//         const startContainer = range.startContainer;
//         const endContainer = range.endContainer;
//         const commonAncestor = range.commonAncestorContainer;

//         if (startContainer === endContainer) {
//             const span = document.createElement('span');
//             span.style.backgroundColor = 'yellow';
//             range.surroundContents(span);
//         } else {
//             const walker = document.createTreeWalker(commonAncestor, NodeFilter.SHOW_TEXT, null, false);
//             let node = walker.nextNode();
//             while (node) {
//                 if (
//                     node === startContainer ||
//                     node === endContainer ||
//                     (walker.currentNode.compareDocumentPosition(startContainer) & Node.DOCUMENT_POSITION_FOLLOWING &&
//                         walker.currentNode.compareDocumentPosition(endContainer) & Node.DOCUMENT_POSITION_PRECEDING)
//                 ) {
//                     const span = document.createElement('span');
//                     span.style.backgroundColor = 'yellow';
//                     const rangePart = document.createRange();
//                     if (node === startContainer) {
//                         rangePart.setStart(node, range.startOffset);
//                         rangePart.setEnd(node, node.textContent?.length ?? 0);
//                     } else if (node === endContainer) {
//                         rangePart.setStart(node, 0);
//                         rangePart.setEnd(node, range.endOffset);
//                     } else {
//                         rangePart.setStart(node, 0);
//                         rangePart.setEnd(node, node.textContent?.length ?? 0);
//                     }
//                     rangePart.surroundContents(span);
//                     node = span.nextSibling;
//                 }
//                 node = walker.nextNode();
//             }
//         }
//     };

//     const handleHighlightClick = () => {
//         const iframeDocument = iframeRef.current?.contentDocument;
//         const selection = iframeDocument?.getSelection();
//         if (selection && selection.rangeCount > 0) {
//             const range = selection.getRangeAt(0);
//             const serializedRange = JSON.stringify(serializeRange(range));
//             setSelectedText(selection.toString());
//             saveHighlight(selection.toString(), serializedRange);
//             highlightSelection(range);
//             selection.removeAllRanges();
//             setTooltipStyle({ display: 'none' });
//         }
//     };

//     // const onLoad = () => {
//     //     setHeight(iframeRef.current.contentWindow.document.body.scrollHeight + "px");
//     //   };

//     return (
//         <div style={{ position: 'relative', width: '100%', height: '100%' }}>
//             <Tooltip style={tooltipStyle} onHighlightClick={handleHighlightClick} />
//             <iframe
//                 ref={iframeRef}
//                 srcDoc={html}
//                 // onLoad={onLoad}
//                 width="100%"
//                 // scrolling="no"
//                 // height={height}
//                 style={{ width: '100%', height: '100%', border: 'none', position: 'relative' }}
//                 title="HTML Document Viewer"
//             >
//                 <Tooltip style={tooltipStyle} onHighlightClick={handleHighlightClick} />
//                 </iframe>

//         </div>
//     );
// };
