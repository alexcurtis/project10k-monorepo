import { Editor, useEditor } from '@tiptap/react'
import { ExtensionKit } from '@/extensions/extension-kit'

declare global {
    interface Window {
        editor: Editor | null
    }
}

export const useBlockEditor = ({ content, onUpdate }: { content: object, onUpdate: () => void }) => {
    console.log('end hook for use editor', content);
    const editor = useEditor({
        // Performance Options
        // https://tiptap.dev/blog/release-notes/say-hello-to-tiptap-2-5-our-most-performant-editor-yet
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        //----
        content: content,
        autofocus: true,
        onCreate: ({ editor }) => {
        },
        onUpdate: onUpdate,
        extensions: [
            ...ExtensionKit({}),
        ],
        editorProps: {
            attributes: {
                autocomplete: 'off',
                autocorrect: 'off',
                autocapitalize: 'off',
                class: 'min-h-full',
            },
        },
    }, [content, onUpdate]);

    console.log('Use Block Editor');
    window.editor = editor
    return { editor }
}
