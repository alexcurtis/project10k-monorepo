import { useCallback } from 'react'
import { Editor, useEditor } from '@tiptap/react'
import { ExtensionKit } from '@/extensions/extension-kit'
import { useSidebar } from './useSidebar'
// import { initialContent } from '@/lib/data/initialContent' INITIAL CONTENT FILL

declare global {
    interface Window {
        editor: Editor | null
    }
}

export const useBlockEditor = ({ onUpdate }: { onUpdate: () => void }) => {
    const leftSidebar = useSidebar()
    const editor = useEditor({
        // Performance Options
        // https://tiptap.dev/blog/release-notes/say-hello-to-tiptap-2-5-our-most-performant-editor-yet
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        //----
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
    },
        [],
    )

    console.log('Use Block Editor');

    // TODO - DO WE NEED A DESTRUCTOR HERE TO CLEANUP?

    const characterCount = editor?.storage.characterCount || { characters: () => 0, words: () => 0 }

    window.editor = editor

    return { editor, characterCount, leftSidebar }
}
