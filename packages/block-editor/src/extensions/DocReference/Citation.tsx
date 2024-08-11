import { Node } from '@tiptap/core'

export const Citation = Node.create({
  name: 'citation',
  group: 'block',
  content: 'text*',
  defining: true,
  isolating: true,

  parseHTML() {
    return [
      {
        tag: 'div',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', HTMLAttributes, 0]
  },
})

export default Citation
