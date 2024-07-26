import React, {
    useState,
    useCallback,
    SyntheticEvent,
    ChangeEvent
} from 'react';

export interface EditableText {
    value: string;
    placeholder: string;
    onBlur?: (event: SyntheticEvent) => void;
    onChange?: (event: SyntheticEvent) => void
}

export function EditableText({ value, placeholder, onBlur, onChange }: EditableText) {
    const [editing, setEditing] = useState(false);
    const [internalValue, setinternalValue] = useState(value);

    const onBlurCb = useCallback((evnt: SyntheticEvent) => {
        setEditing(false);
        if (onBlur) { onBlur(evnt); }
    }, [setEditing, onBlur]);

    const onClickCb = useCallback(() => {
        setEditing(true);
    }, [setEditing]);

    const onChangeCb = useCallback((evnt: ChangeEvent<HTMLInputElement>) => {
        const newValue = evnt.target.value;
        if (onChange) { onChange(evnt); }
        setinternalValue(newValue);
    }, [setEditing]);

    return (
        <>
            {editing ?
                <input
                    placeholder={placeholder}
                    onBlur={onBlurCb}
                    autoFocus
                    value={internalValue}
                    onChange={onChangeCb}
                />
                : 
                <span onClick={onClickCb}>
                    {internalValue}
                </span>
            }
        </>
    );
}