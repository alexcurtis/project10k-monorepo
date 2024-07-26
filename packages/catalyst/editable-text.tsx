import React, {
    useState,
    useCallback,
    SyntheticEvent,
    ChangeEvent,
    KeyboardEvent
} from 'react';

export interface EditableTextChangedEvent {
    value: string;
}

export interface EditableText {
    value: string;
    placeholder: string;
    onBlur?: (event: EditableTextChangedEvent) => void;
    onChange?: (event: EditableTextChangedEvent) => void
}

export function EditableText({ value, placeholder, onBlur, onChange }: EditableText) {
    const [editing, setEditing] = useState(false);
    const [internalValue, setinternalValue] = useState(value);

    const onBlurCb = useCallback((evnt: SyntheticEvent) => {
        if (onBlur) { onBlur({ value: internalValue }); }
        setEditing(false);
    }, [setEditing, onBlur]);

    const onClickCb = useCallback(() => {
        setEditing(true);
    }, [setEditing]);

    const onChangeCb = useCallback((evnt: ChangeEvent<HTMLInputElement>) => {
        const newValue = evnt.target.value;
        if (onChange) { onChange({ value: internalValue }); }
        setinternalValue(newValue);
    }, [setEditing]);


    const onKeyUpCb = useCallback((evnt: KeyboardEvent<HTMLInputElement>) => {
        const key = evnt.key;
        // Only Trigger onBlur When Enter Presset
        if(key !== 'Enter'){ return; }
        if (onBlur) { onBlur({ value: internalValue }); }
        setEditing(false);
    }, [onChangeCb]);


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