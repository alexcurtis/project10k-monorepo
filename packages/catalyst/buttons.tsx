import React from "react";
import { Button } from "@vspark/catalyst/button";
import { CubeIcon } from "@heroicons/react/24/solid";

export const PrimaryActionButton = ({
    label,
    disabled,
    loading,
    className,
}: {
    label: string;
    disabled: boolean;
    loading: boolean;
    className: string;
}) => (
    <Button type="submit" disabled={loading || disabled} color="indigo" className={className}>
        <CubeIcon className={`${loading ? "animate-spin" : ""}`} />
        {label}
    </Button>
);
