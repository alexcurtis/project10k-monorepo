import React, { memo, SyntheticEvent } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { XCircleIcon } from "@heroicons/react/16/solid";

import { Button } from "@vspark/catalyst/button";

const DefaultNode = memo(({ id, data, isConnectable, selected }: NodeProps) => {
    const onNodeDeleteCb = data.onNodeDeleteCb as Function;
    const label = data.label as string;
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
                <div>{label}</div>
            </div>
            <div className="absolute -bottom-3 right-1/2">
                <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
            </div>
        </div>
    );
});
DefaultNode.displayName = "DefaultNode";
export default DefaultNode;
