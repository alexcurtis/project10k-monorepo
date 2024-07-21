import {
    EditorContent,
    useEditor
} from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';

// TipTap Extensions
const extensions = [StarterKit];

export interface BlockEditor {
    content: object;
    onUpdate: (json: object) => void;
}

export function BlockEditor({ content, onUpdate }: BlockEditor) {
    console.log('block editor rendering', content);
    // Editor Hook. Re-Render when content changes
    // https://stackoverflow.com/questions/73424668/tiptap-react-update-editor-initial-content-based-on-dropdown-selection
    const editor = useEditor({
        extensions,
        content,
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            console.log('update editor occured', json);
            onUpdate(json);
        }
    }, [content]);
    return (
        <EditorContent editor={editor}/>
    );
}