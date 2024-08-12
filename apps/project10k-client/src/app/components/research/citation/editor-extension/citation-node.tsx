import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";

interface ICitationProps {
    node: Node & {
        attrs: {};
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
    return (
        <NodeViewWrapper className="citation bg-indigo-400/25 p-2 rounded-sm text-white outline outline-2 outline-indigo-300/25">
            <p>{props.node.content.content[0].content.content[0].text}</p>
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

// import { Node } from '@tiptap/core'

// export const CitationNode = Node.create({
//   name: 'citation-node',
//   group: 'block',
//   content: 'text*',
//   defining: true,
//   isolating: true,
//   atom: true,
//   draggable: true,
//   addAttributes() {
//     return {
//       _id: {
//         default: null,
//       },
//       company: {
//         default: null,
//       },
//       filing: {
//         default: null,
//       },
//       updatedAt: {
//         default: null,
//       },
//     }
//   },

//   parseHTML() {
//     return [
//       {
//         tag: 'div',
//       },
//     ]
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ['div', HTMLAttributes, 0]
//   },
// })

// export default CitationNode
