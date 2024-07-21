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

export const useBlockEditor = () => {

    // Should this be useCallback
    const onUpdate = useCallback((cb) => {

    }, [])


    const leftSidebar = useSidebar()
    const editor = useEditor(
        {
            autofocus: true,
            onCreate: ({ editor }) => {
            },
            onUpdate({ editor }) {
                console.log('editor updated', editor.getJSON());
            },
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


    // TODO - DO WE NEED A DESTRUCTOR HERE TO CLEANUP?

    const characterCount = editor?.storage.characterCount || { characters: () => 0, words: () => 0 }

    window.editor = editor

    return { editor, characterCount, leftSidebar }
}
