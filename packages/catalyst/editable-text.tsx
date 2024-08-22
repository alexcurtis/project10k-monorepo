import React, { useState, useCallback, useEffect, SyntheticEvent, ChangeEvent, KeyboardEvent } from "react";

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
    neverEmpty?: boolean;
}

export function EditableText({ value, placeholder, onBlur, onChange, onSubmit, onKeyUp, neverEmpty }: EditableText) {
    const [editing, setEditing] = useState(false);
    const [internalValue, setinternalValue] = useState(() => value);

    // Update Local State When Value Changes From Parent
    useEffect(() => {
        setinternalValue(value);
    }, [value]);

    const onSubmitCb = useCallback(
        (evnt: EditableTextSubmitEvent) => {
            // If Can Be Empty. Just Pass Through
            if (!neverEmpty && onSubmit) {
                return onSubmit(evnt);
            }

            // If Never Empty and Empty, Revert To Original Value + No Trigger On Submit
            if (neverEmpty && evnt.value === "") {
                setinternalValue(value);
            }
            // As Value Is Not Empty. Trigger Submit If Available
            else if (onSubmit) {
                onSubmit(evnt);
            }

            // Finally Ensure Input Is Turned Back To Regular Text
            setEditing(false);
        },
        [value, setinternalValue, onSubmit]
    );

    const onBlurCb = useCallback(
        (evnt: SyntheticEvent) => {
            if (onBlur) {
                onBlur(evnt);
            }
            onSubmitCb({ value: internalValue });
            setEditing(false);
        },
        [internalValue, setEditing, onBlur]
    );

    const onClickCb = useCallback(() => {
        setEditing(true);
    }, [setEditing]);

    const onChangeCb = useCallback(
        (evnt: ChangeEvent<HTMLInputElement>) => {
            const newValue = evnt.target.value;
            if (onChange) {
                onChange(evnt);
            }
            setinternalValue(newValue);
        },
        [internalValue, setEditing]
    );

    const onKeyUpCb = useCallback(
        (evnt: KeyboardEvent<HTMLInputElement>) => {
            const key = evnt.key;
            // Only Trigger onBlur When Enter Presset
            if (key !== "Enter") {
                return;
            }
            if (onKeyUp) {
                onKeyUp(evnt);
            }
            onSubmitCb({ value: internalValue });
            setEditing(false);
        },
        [internalValue, onChangeCb]
    );

    return (
        <>
            {editing ? (
                <input
                    placeholder={placeholder}
                    onBlur={onBlurCb}
                    autoFocus
                    value={internalValue}
                    onChange={onChangeCb}
                    onKeyUp={onKeyUpCb}
                />
            ) : (
                <span onClick={onClickCb}>{internalValue}</span>
            )}
        </>
    );
}
