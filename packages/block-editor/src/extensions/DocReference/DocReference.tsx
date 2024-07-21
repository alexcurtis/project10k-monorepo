import { Node, NodeViewRendererProps } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { DocumentReference } from '@/components/DocumentReference'

const DocReferenceContent = (props: NodeViewRendererProps) => {
  const { editor } = props

  return (
    <NodeViewWrapper>
      <div className="p-2 -m-2 rounded-lg" contentEditable={false}>
        <DocumentReference editor={editor} />
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

export const DocReference = Node.create({
  name: 'docReference',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  inline: false,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="doc-reference"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'doc-reference' }]
  },

  addNodeView() {
    return ReactNodeViewRenderer(DocReferenceContent)
  },

  addCommands() {
    return {
      insertDocReference:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          })
        },
    }
  },
})
