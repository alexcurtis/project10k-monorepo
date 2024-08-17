import React from "react";
import { Dispatch, memo, SetStateAction } from "react";
import { Dialog, DialogActions, DialogDescription, DialogTitle } from "./dialog";
import { Button } from "./button";

export interface IDeleteGateway {
    isOpen: boolean;
    deleteAction: () => void | null;
    name: string;
}

export interface IDeleteJournalGatewayProps {
    title: string;
    gateway: IDeleteGateway;
    setDeleteGateway: Dispatch<SetStateAction<IDeleteGateway>>;
    entity: string;
}

export const DeleteGateway = memo(function ({ title, gateway, setDeleteGateway, entity }: IDeleteJournalGatewayProps) {
    const closeDeleteJournalGatewayCb = () => setDeleteGateway({ ...gateway, isOpen: false });
    const triggerDeleteAction = () => {
        gateway.deleteAction();
        closeDeleteJournalGatewayCb();
    };
    return (
        <>
            <Dialog open={gateway.isOpen} onClose={closeDeleteJournalGatewayCb}>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    {`Are you sure you want to delete the ${entity} ${gateway.name}?`}
                </DialogDescription>
                <DialogActions>
                    <Button plain onClick={closeDeleteJournalGatewayCb}>
                        Cancel
                    </Button>
                    <Button color="red" onClick={triggerDeleteAction}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});
