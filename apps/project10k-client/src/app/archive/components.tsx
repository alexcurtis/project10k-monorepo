import {
    useState,
    SyntheticEvent,
    useId,
    useEffect,
    useRef
} from 'react';

import { Button as HButton } from '@headlessui/react';

// Editable Text -------------------------------

function InputPlaceholder({ value }: { value: string; }) {
    return (
        <div className=" text-zinc-500 text-4xl font-bold w-full absolute min-h-10 pointer-events-none">
            {value}
        </div>
    )
}

interface EditableTextEvent extends SyntheticEvent {
    value: string | null;
    length?: number;
}

export interface EditableText {
    value: string;
    placeholder: string;
    onBlur?: (event: EditableTextEvent) => void;
    onInput?: (event: EditableTextEvent) => void
}

const convertEventToEditableTextEvent = (evnt: SyntheticEvent) => {
    const textContent = evnt.currentTarget ? evnt.currentTarget.textContent : '';
    return {
        value: textContent,
        length: textContent ? textContent.length : 0,
        ...evnt
    };
}

export function EditableText({ value, placeholder, onBlur, onInput }: EditableText) {
    const [editing, setEditing] = useState(false);
    const [charCount, setCharCount] = useState(value ? value.length : 0);

    // Show Placeholder If No Characters
    const inputPlaceholder = charCount === 0 ? <InputPlaceholder value={placeholder} /> : null;

    const onBlurHandler = (evnt: SyntheticEvent) => {
        setEditing(false);
        const editableTextEvent = convertEventToEditableTextEvent(evnt);
        if (onBlur) { onBlur(editableTextEvent); }
    };

    const onInputHandler = (evnt: SyntheticEvent) => {
        const editableTextEvent = convertEventToEditableTextEvent(evnt);
        setCharCount(editableTextEvent.length)
        if (onInput) { onInput(editableTextEvent); }
    };

    return (
        <div className="relative">
            {inputPlaceholder}
            <div
                contentEditable={editing}
                suppressContentEditableWarning={true}
                className="bg-zinc-900 outline-none text-4xl font-bold w-full bg-transparent min-h-10 break-words"
                onClick={() => setEditing(true)}
                onBlur={onBlurHandler}
                onChange={(e) => console.log('e', e)}
                onInput={onInputHandler}
            >
                {value}
            </div>
        </div>
    );
}

// Buttons -------------------------------
export interface Button {
    onClick: () => void,
    children: any,
    className: string
}



export function Button({ onClick, children, className }: Button) {
    return (
        <HButton className={`${className} cursor-pointer inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white`}
            onClick={onClick}
        >
            {children}
        </HButton>
    )
}
