import { mergeAttributes, Node, NodeViewRendererProps } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { Citation } from './Citation'
import { Figure } from '../Figure'

// import { Citation } from '@/components/Citation'

const DocReferenceContent = (props: NodeViewRendererProps) => {
  const { node } = props

  return (
    <NodeViewWrapper>
      <div className="p-2 -m-2 rounded-lg" contentEditable={false}>
        {/* <Citation content={node.content} /> */}
      </div>
    </NodeViewWrapper>
  )
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    docReference: {
      insertDocReference: () => ReturnType
    }
  }
}

export const DocReference = Figure.extend({
  name: 'docReference',
  group: 'block',
  content: 'citation',
  isolating: true,
  addExtensions() {
    return [Citation]
  },

  //   parseHTML() {
  //     return [
  //       {
  //         tag: 'div[data-type="doc-reference"]',
  //       },
  //     ]
  //   },

  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes, { 'data-type': this.name }), ['div', {}, 0]]
  },

  addAttributes() {
    return {
      ...this.parent?.(),
    }
  },

  //   addNodeView() {
  //     return ReactNodeViewRenderer(DocReferenceContent)
  //   },

  //   addCommands() {
  //     return {
  //       insertDocReference:
  //         () =>
  //         ({ commands }) => {
  //           return commands.insertContent({
  //             type: this.name,
  //           })
  //         },
  //     }
  //   },
})
