import React, { memo, SyntheticEvent } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Button } from "@vspark/catalyst/button";
import { XCircleIcon } from "@heroicons/react/16/solid";

export const DefaultNode = memo(({ id, data, isConnectable, selected }: NodeProps) => {
    const { onNodeDeleteCb } = data;
    return (
        <div className="relative">
            <div className="absolute -top-3 right-1/2">
                <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            </div>
            {selected ? (
                <div className="absolute -top-10 -right-6">
                    <Button
                        plain
                        className="nodrag"
                        onClick={(evnt: SyntheticEvent) => {
                            if (onNodeDeleteCb) {
                                onNodeDeleteCb(data.journalId);
                            }
                            evnt.stopPropagation();
                        }}
                    >
                        <XCircleIcon className="fill-red-600" />
                    </Button>
                </div>
            ) : null}
            <div>
                <div>{data.label}</div>
                <div>Citations: {data.citations}</div>
            </div>
            <div className="absolute -bottom-3 right-1/2">
                <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
            </div>
        </div>
    );
});
