import React, {
    useState,
    useCallback,
    SyntheticEvent,
    ChangeEvent,
    KeyboardEvent
} from 'react';

export interface EditableTextSubmitEvent {
    value: string;
}

export interface EditableText {
    value: string;
    placeholder?: string;
    onBlur?: (event: SyntheticEvent) => void;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onSubmit?: (event: EditableTextSubmitEvent) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export function EditableText({ value, placeholder, onBlur, onChange, onSubmit, onKeyUp }: EditableText) {
    const [editing, setEditing] = useState(false);
    const [internalValue, setinternalValue] = useState(value);

    const onBlurCb = useCallback((evnt: SyntheticEvent) => {
        if (onBlur) { onBlur(evnt); }
        if (onSubmit) { onSubmit({ value: internalValue }); }
        setEditing(false);
    }, [internalValue, setEditing, onBlur]);

    const onClickCb = useCallback(() => {
        setEditing(true);
    }, [setEditing]);

    const onChangeCb = useCallback((evnt: ChangeEvent<HTMLInputElement>) => {
        const newValue = evnt.target.value;
        if (onChange) { onChange(evnt); }
        setinternalValue(newValue);
    }, [internalValue, setEditing]);


    const onKeyUpCb = useCallback((evnt: KeyboardEvent<HTMLInputElement>) => {
        const key = evnt.key;
        // Only Trigger onBlur When Enter Presset
        if (key !== 'Enter') { return; }
        if (onKeyUp) { onKeyUp(evnt); }
        if (onSubmit) { onSubmit({ value: internalValue }); }
        setEditing(false);
    }, [internalValue, onChangeCb]);


    return (
        <>
            {editing ?
                <input
                    placeholder={placeholder}
                    onBlur={onBlurCb}
                    autoFocus
                    value={internalValue}
                    onChange={onChangeCb}
                    onKeyUp={onKeyUpCb}
                />
                :
                <span onClick={onClickCb}>
                    {internalValue}
                </span>
            }
        </>
    );
}