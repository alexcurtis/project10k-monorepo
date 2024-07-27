import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Button } from "@vspark/catalyst/button";


export const DefaultNode = memo(({ data, isConnectable }) => {
    console.log('yoooo!', data.onNodeDeleteCb);
    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={isConnectable}
            />
            <div>
                {data.label}
                <Button onClick={(evnt) => {
                    console.log('in button click event', data);
                    data.onNodeDeleteCb();
                    evnt.stopPropagation();
                }}>
                    Delete
                </Button>
            </div>
            <input
                className="nodrag"
                type="color"
                onChange={data.onChange}
                defaultValue={data.color}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="b"
                style={{ bottom: 10, top: 'auto', background: '#555' }}
                isConnectable={isConnectable}
            />
        </>
    );
});
