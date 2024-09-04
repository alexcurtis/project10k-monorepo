import { ICheckList } from "@/app/platform/[accountId]/types/entities";
import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Node } from "prosemirror-model";

function CheckListNodeFactory(checklist: ICheckList, view: EditorView): Node {
    return checklist.name ? CreateCheckListParentNode(checklist, view) : CreateCheckListLeafNode(checklist, view);
}

function CreateCheckListParentNode(checklist: ICheckList, view: EditorView): Node {
    const nodes = view.state.schema.nodes;
    const parentNode = nodes["checklistparentnode"];
    const attrs = {
        _id: checklist._id,
        name: checklist.name,
    };
    const children = checklist.children || [];
    const childNodes = children.map((child) => {
        return CheckListNodeFactory(child, view);
    });
    return parentNode.create(attrs, childNodes);
}

function CreateCheckListLeafNode(checklist: ICheckList, view: EditorView): Node {
    const nodes = view.state.schema.nodes;
    const leafNode = nodes["checklistleafnode"];
    const attrs = { ...checklist };
    return leafNode.create(attrs, []);
}

export const CheckList = Extension.create({
    name: "checklist",
    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handleDrop(view, event: DragEvent | any): boolean {
                        if (!event) return false;

                        event.preventDefault();

                        const coordinates = view.posAtCoords({
                            left: event.clientX,
                            top: event.clientY,
                        });

                        const checklistTransferData = event.dataTransfer.getData("checklist");

                        // This Might Not Be A CheckList Drop In. If Not Pass To Other Drop Handlers
                        if (!checklistTransferData) {
                            return false;
                        }

                        const checklist = JSON.parse(checklistTransferData) as ICheckList;
                        const node = CheckListNodeFactory(checklist, view);

                        //CreateCheckListLeafNode(checklist, view);

                        // const nodes = view.state.schema.nodes;
                        // const checklistNode = nodes["checklist-node"];
                        // const textNode = nodes.paragraph.create(null, [view.state.schema.text(checklist.text)]);

                        // const attrs = {
                        //     _id: checklist._id,
                        // };

                        if (coordinates) {
                            const dropTransaction = view.state.tr.insert(
                                coordinates.pos,
                                node
                                // checklistNode.create(attrs, [textNode])
                            );

                            dropTransaction.setMeta("isCheckListDropTransaction", true);
                            view.dispatch(dropTransaction);
                        }
                        return false;
                    },
                },
            }),
        ];
    },
});
