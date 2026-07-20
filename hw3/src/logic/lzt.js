"use strict";
// lazy-tree.ts
// Michael Elhadad - June 2020
// A lazy tree has a root, and a generator that generates the direct children of the root (a finite number of children).
// It can represent infinite trees (those that include infinite depth paths).
// The key constructor is expandLZT
// Compile with: tsc ./lzt.ts --downlevelIteration --strict  
Object.defineProperty(exports, "__esModule", { value: true });
exports.lztFindFirst = exports.lztFilter = exports.lztMap = exports.lztDfs = exports.expandLZT = exports.lztChildren = exports.genToList = exports.take = exports.isLZT = exports.makeLZT = exports.isEmptyLZT = exports.makeEmptyLZT = exports.rest = exports.first = exports.cons = void 0;
exports.map$ = map$;
exports.lztFilter$ = lztFilter$;
exports.lztInOrder$ = lztInOrder$;
exports.lztBFS$ = lztBFS$;
const ramda_1 = require("ramda");
const cons = (x, xs) => [x, ...xs];
exports.cons = cons;
const first = (x) => x[0];
exports.first = first;
const rest = (x) => x.slice(1);
exports.rest = rest;
const isEmpty = (x) => x.length === 0;
const makeEmptyLZT = () => ({ tag: "EmptyLZT" });
exports.makeEmptyLZT = makeEmptyLZT;
const isEmptyLZT = (x) => x.tag === "EmptyLZT";
exports.isEmptyLZT = isEmptyLZT;
const makeLZT = (root, children$) => ({ tag: "LZT", root, children$ });
exports.makeLZT = makeLZT;
const isLZT = (x) => x.tag === "LZT";
exports.isLZT = isLZT;
const take = (gen, n) => {
    let res = [];
    let next = gen.next();
    while (!next.done && n-- > 0) {
        res.push(next.value);
        next = gen.next();
    }
    return res;
};
exports.take = take;
// Like take til end of generator
const genToList = (g) => {
    const next = g.next();
    return next.done ? [] :
        (0, exports.cons)(next.value, (0, exports.genToList)(g));
};
exports.genToList = genToList;
// lztChildren forces the evaluation of the children iterator
const lztChildren = (lzt) => (0, exports.isEmptyLZT)(lzt) ? [] :
    (0, exports.genToList)(lzt.children$);
exports.lztChildren = lztChildren;
// Map from array to generator 
function* map$(f, a) {
    if (isEmpty(a))
        return [];
    yield f((0, exports.first)(a));
    yield* map$(f, (0, exports.rest)(a));
}
;
// This is the key LZT constructor: given a function that computes the direct children of a node (expander)
// return the transitive closure of the children relation as a potentially infinite LZT.
const expandLZT = (root, expander) => (0, exports.makeLZT)(root, map$((child) => (0, exports.expandLZT)(child, expander), expander(root)));
exports.expandLZT = expandLZT;
// ==============================================
// LZT Traversals and transformers
// Traverse tree in-order depth first - only works on finite trees
const lztDfs = (lzt) => (0, exports.isEmptyLZT)(lzt) ? [] :
    (0, exports.cons)(lzt.root, (0, ramda_1.chain)(exports.lztDfs, (0, exports.lztChildren)(lzt)));
exports.lztDfs = lztDfs;
// Maps a finite LZT (fully expands it)
const lztMap = (f, lzt) => (0, exports.isEmptyLZT)(lzt) ? lzt :
    (0, exports.makeLZT)(f(lzt.root), map$((child) => (0, exports.lztMap)(f, child), (0, exports.lztChildren)(lzt)));
exports.lztMap = lztMap;
// Filters a finite LZT (fully expands it)
const lztFilter = (pred, lzt) => (0, exports.isEmptyLZT)(lzt) ? [] :
    pred(lzt.root) ? (0, exports.cons)(lzt.root, (0, ramda_1.chain)((child) => (0, exports.lztFilter)(pred, child), (0, exports.lztChildren)(lzt))) :
        (0, ramda_1.chain)((child) => (0, exports.lztFilter)(pred, child), (0, exports.lztChildren)(lzt));
exports.lztFilter = lztFilter;
// =============================================================
// The following functions can operate over infinite LZTs
// Find the first node in lzt in depth-first traversal that satisfies filter - false if not found.
// Can loop forever if there is no node that satisfies pred on an infinite path in the DFS.
const lztFindFirst = (pred, lzt) => {
    const collect = (lzt) => (0, exports.isEmptyLZT)(lzt) ? false :
        pred(lzt.root) ? lzt.root :
            findFirstInTrees((0, exports.lztChildren)(lzt));
    const findFirstInTrees = (trees) => isEmpty(trees) ? false :
        checkFirstTree(collect((0, exports.first)(trees)), (0, exports.rest)(trees));
    const checkFirstTree = (n, trees) => n ? n :
        findFirstInTrees(trees);
    return collect(lzt);
};
exports.lztFindFirst = lztFindFirst;
function* lztFilter$(pred, lzt) {
    function* collectInTrees$(trees) {
        if (isEmpty(trees))
            return [];
        yield* lztFilter$(pred, (0, exports.first)(trees));
        yield* collectInTrees$((0, exports.rest)(trees));
    }
    if ((0, exports.isEmptyLZT)(lzt))
        return [];
    if (pred(lzt.root))
        yield lzt.root;
    yield* collectInTrees$((0, exports.lztChildren)(lzt));
}
// In order traversal of a lzt as a generator
function* lztInOrder$(lzt) {
    function* traverseTrees$(trees) {
        if (isEmpty(trees))
            return [];
        yield* lztInOrder$((0, exports.first)(trees));
        yield* traverseTrees$((0, exports.rest)(trees));
    }
    if ((0, exports.isEmptyLZT)(lzt))
        return [];
    yield lzt.root;
    yield* traverseTrees$((0, exports.lztChildren)(lzt));
}
// Breadth-first traversal of a lzt as a generator
function* lztBFS$(lzt) {
    function* traverseTrees$(trees) {
        if (isEmpty(trees))
            return [];
        for (const t of trees) {
            if ((0, exports.isLZT)(t))
                yield t.root;
        }
        yield* traverseTrees$((0, ramda_1.chain)(exports.lztChildren, trees));
    }
    if ((0, exports.isEmptyLZT)(lzt))
        return [];
    yield* traverseTrees$([lzt]);
}
// ============================================
// Examples
// Tests for take / genToList
function* g1() {
    yield 1;
    yield 2;
}
console.log((0, exports.take)(g1(), 1));
console.log((0, exports.take)(g1(), 2));
console.log((0, exports.take)(g1(), 3));
console.log((0, exports.genToList)(g1()));
// Example: A finite lazy-tree 0 1 1 2 2 2 2 3 3 3 3 3 3 3 3 ...
const t1 = (limit) => (0, exports.expandLZT)(0, (node) => node < limit ? [node + 1, node + 1] : []);
// Example: An infinite lazy-tree
const t2 = () => (0, exports.expandLZT)(0, (node) => [node + 1, node + 1]);
// Only works on finite trees
console.log((0, exports.lztDfs)(t1(2)));
console.log((0, exports.lztDfs)((0, exports.lztMap)((x) => x + 1, t1(2))));
const isEven = (n) => (n % 2) === 0;
console.log((0, exports.lztFilter)(isEven, t1(2)));
console.log((0, exports.lztFindFirst)(isEven, t1(2)));
console.log((0, exports.lztFindFirst)((n) => n > 10, t2()));
console.log((0, exports.take)(lztFilter$(isEven, t1(2)), 10));
console.log((0, exports.take)(lztFilter$(isEven, t2()), 10));
console.log((0, exports.take)(lztInOrder$(t1(2)), 10));
console.log((0, exports.take)(lztInOrder$(t2()), 10));
console.log((0, exports.take)(lztBFS$(t1(2)), 10));
console.log((0, exports.take)(lztBFS$(t2()), 10));
