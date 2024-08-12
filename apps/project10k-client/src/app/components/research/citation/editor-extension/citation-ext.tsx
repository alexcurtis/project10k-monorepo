import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";

export const Citation = Extension.create({
    name: "citation",
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

                        const citationTransferData = event.dataTransfer.getData("citation");

                        // This Might Not Be A Citation Drop In. If Not Pass To Other Drop Handlers
                        if (!citationTransferData) {
                            return false;
                        }

                        const citation = JSON.parse(citationTransferData);
                        const nodes = view.state.schema.nodes;
                        const citationNode = nodes["citation-node"];
                        const textNode = nodes.paragraph.create(null, [view.state.schema.text(citation.text)]);

                        const attrs = {
                            _id: citation._id,
                            company: citation.company,
                            filing: citation.filing,
                            updatedAt: citation.updatedAt,
                        };

                        if (coordinates) {
                            const dropTransaction = view.state.tr.insert(
                                coordinates.pos,
                                citationNode.create(attrs, [textNode])
                            );

                            dropTransaction.setMeta("isCitationDropTransaction", true);
                            view.dispatch(dropTransaction);
                        }

                        return false;
                    },
                },
            }),
        ];
    },
});
