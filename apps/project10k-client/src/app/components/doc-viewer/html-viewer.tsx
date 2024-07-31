import { se } from 'date-fns/locale';
import {
    useEffect,
    useState,
    useCallback,
    SyntheticEvent,
    Component
} from 'react';
import { v4 as uuidv4 } from 'uuid';








/**
 * Call a function for each leaf element
 *
 * @param {*} eachable
 * @param {function} callback
 */
function deepForEach(eachable, callback) {
    eachable.forEach(current => {
        if (current.forEach) {
            deepForEach(current, callback)
        } else {
            callback(current)
        }
    })
}



/**
 * Helper to conveniently iterate a tree walker
 *
 * @param {TreeWalker} walker
 * @returns {IterableIterator}
 */
function iterateWalker(walker: TreeWalker) {
    return {
        [Symbol.iterator]() {
            return this
        },
        next() {
            const value = walker.nextNode()
            return { value, done: !value }
        }
    }
}


/**
* Get the text nodes contained in a given range
*
* @param {Range} range
* @returns {Text[]}
*/
function getSelectedNodes(range: Range) {
    const parent = range.commonAncestorContainer.parentElement;
    if (!parent) { return null; }
    const walker = document.createTreeWalker(
        parent,
        NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            return range.intersectsNode(node)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT
            }
        }
    )

    return [...iterateWalker(walker)]
}

/**
* Test if a given node has some actual
* text other than whitespace
*
* @param {Node} node
* @returns {boolean}
*/
function hasText(node) {
    return /\S/.test(node.textContent)
}









/**
 * Initialize a range with a given node
 *
 * @param {Node} node
 * @returns {Range}
 */
function initRange(node, offsets) {
    const range = document.createRange()
    // if(offsets.start === 0 && offsets.end === 0){
    //     range.selectNode(node);
    //     return range
    // }
    range.selectNode(node);
    if(offsets.start !== 0) { range.setStart(node, offsets.start); }
    if(offsets.end !== 0) { range.setEnd(node, offsets.end); }
    return range
}

/**
 * Extend the last range to the given node if
 * applicable, or push a new range otherwise
 *
 * @param {Range[]} ranges
 * @param {Node} node
 */
function extendRanges(ranges, node, offsets) {
    const [current] = ranges.slice(-1)

    if (current.intersectsNode(node.previousSibling)) {
        current.setEndAfter(node)
    } else {
        const range = initRange(node, offsets)
        ranges.push(range)
    }
}





/**
 * Given an array of nodes, map their common parent
 * nodes to ranges containing the respective nodes
 *
 * @param {Node[]} nodes
 * @returns {Map<Node, Range[]>}
 */
function createRangesByParent(nodes, startNode, endNode) {
    return nodes.reduce((carry, node, index) => {
        const { parentNode } = node
        const offsets = { start: 0, end: 0 };
        if(node === startNode.node){ offsets.start = startNode.offset }
        if(node === endNode.node){ offsets.end = endNode.offset };

        if (carry.has(parentNode)) {
            const ranges = carry.get(parentNode)
            extendRanges(ranges, node, offsets)
        } else {
            const range = initRange(node, offsets)
            carry.set(parentNode, [range])
        }

        return carry
    }, new Map())
}


function highlightSelected() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) { return; }
    console.log({ selection: selection.toString() });

    const range = selection.getRangeAt(0);

    const startNode = { node: range.startContainer, offset: range.startOffset };
    const endNode = { node: range.endContainer, offset: range.endOffset };


    console.log('selection', selection, range);
    const selectedNodes = getSelectedNodes(range).filter(hasText);
    console.log('selected nodes', selectedNodes);

    const idPrefix = uuidv4();
    let idCount = 0;
    deepForEach(
        createRangesByParent(selectedNodes, startNode, endNode),
        range => {
            const mark = document.createElement('mark')
            mark.setAttribute('id', `${idPrefix}-${idCount}`);
            idCount++;
            range.surroundContents(mark)
        }
    )
    selection.removeAllRanges();
}


export function HtmlViewer() {
    console.log('Html Viewer Render');
    const [html, setHtml] = useState('');

    useEffect(() => {
        const url = 'http://localhost:3002/'
        const fetchData = async () => {
            const response = await fetch(url);
            const htmly = await response.text();
            setHtml(htmly);
        };
        fetchData();
    }, [setHtml]);


    const onMouseUpCb = useCallback((evnt: SyntheticEvent) => {
        console.log('event mouse up', evnt);
        highlightSelected();
    }, []);

    return (
        <>
            <div className='bg-white overflow-x-hidden overflow-y-scroll h-full'>
                <div className="px-2"
                    onMouseUp={onMouseUpCb}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>

        </>
    )
}


