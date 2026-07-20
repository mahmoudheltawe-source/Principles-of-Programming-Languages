"use strict";
// list.ts
// Michael Elhadad - Apr 2023
// Observe the similarity of the functions between two monads: Option and List
Object.defineProperty(exports, "__esModule", { value: true });
exports.foldList = exports.getOrElseList = exports.pipeList = exports.chainList = exports.mapList = exports.bindList = exports.wrapList = exports.rest = exports.first = exports.isNonEmpty = exports.isEmpty = void 0;
const assert_1 = require("assert");
// Type predicates
const isEmpty = (x) => x.length === 0;
exports.isEmpty = isEmpty;
const isNonEmpty = (x) => x.length > 0;
exports.isNonEmpty = isNonEmpty;
// Type accessors
const first = (x) => x[0];
exports.first = first;
const rest = (x) => x.slice(1);
exports.rest = rest;
const wrapList = (x) => [x];
exports.wrapList = wrapList;
// Known as flatMap
// Since List is a recursive type, bind is a recursive function
const bindList = (l, f) => ((0, exports.isEmpty)(l) ? l : [...f((0, exports.first)(l)), ...(0, exports.bindList)((0, exports.rest)(l), f)]);
exports.bindList = bindList;
// Known as map
const mapList = (f) => (l) => (0, exports.bindList)(l, (x) => (0, exports.wrapList)(f(x)));
exports.mapList = mapList;
// chainList: diagonal [T1=>List<T2>] to lifted [List<T1>=>List<T2>]
// When composing a mixture of diagonal and flat functions - use map and chain as params to pipe
// When composing only diagonal functions - use pipeList
const chainList = (f) => (y) => (0, exports.bindList)(y, f);
exports.chainList = chainList;
// Expand all results into a tree of results - each composable returns a list of results
// Flatten all results.
const pipeList = (...composables) => 
// return a function
(firstData) => {
    let data = (0, exports.wrapList)(firstData);
    // Override application operator for list
    for (const composable of composables) {
        data = (0, exports.bindList)(data, composable);
    }
    return data;
};
exports.pipeList = pipeList;
// Methods to unlift from the List
// -------------------------------
// getOrElseList
// Example:
// getOrElse([1], undefined) -> 1
// getOrElse([], undefined) -> undefined
const getOrElseList = (l, whenEmpty) => (0, exports.isEmpty)(l) ? whenEmpty : (0, exports.first)(l);
exports.getOrElseList = getOrElseList;
// Aka reduce
// Like bindList (flatMap), foldList is recursive to fold the recursive type.
// foldList(l:List<T1>, ()=>T2, (firstVal:T1, restFolded: T2)=>T2)
// Example:
// foldList([], () => 0, (firstVal: number, restFolded: number) => firstVal + restFolded) -> 0
// foldList([1,2], () => 0, (firstVal: number, restFolded: number) => firstVal + restFolded) -> 3
const foldList = (l, handleEmpty, handleNonEmpty) => (0, exports.isEmpty)(l)
    ? handleEmpty()
    : handleNonEmpty((0, exports.first)(l), (0, exports.foldList)((0, exports.rest)(l), handleEmpty, handleNonEmpty));
exports.foldList = foldList;
// =================================================
// Examples
// Unlift
const l1 = [];
// Literal type inference from [1] to NonEmptyList<number> fails
// it widens to List<number>
const l2 = [1];
const l3 = [1, 2];
// But it works in context
(0, assert_1.deepStrictEqual)((0, exports.first)([1]), 1);
(0, assert_1.deepStrictEqual)((0, exports.first)([1, 2]), 1);
(0, assert_1.deepStrictEqual)((0, exports.rest)([1]), []);
(0, assert_1.deepStrictEqual)((0, exports.rest)([1, 2]), [2]);
// When variables are declared with type - all ok
(0, assert_1.deepStrictEqual)((0, exports.first)(l2), 1);
(0, assert_1.deepStrictEqual)((0, exports.first)(l3), 1);
(0, assert_1.deepStrictEqual)((0, exports.rest)(l2), []);
(0, assert_1.deepStrictEqual)((0, exports.rest)(l3), [2]);
(0, assert_1.deepStrictEqual)((0, exports.foldList)(l1, () => 0, (val, acc) => val + acc), 0);
(0, assert_1.deepStrictEqual)((0, exports.foldList)(l2, () => 0, (val, acc) => val + acc), 1);
(0, assert_1.deepStrictEqual)((0, exports.foldList)(l3, () => 0, (val, acc) => val + acc), 3);
// Compose and apply
(0, assert_1.deepStrictEqual)((0, exports.pipeList)(() => [], (x) => (0, exports.wrapList)(x * 2), (x) => (0, exports.wrapList)(1 / x))(), []);
(0, assert_1.deepStrictEqual)((0, exports.pipeList)(() => [1], (x) => [x * 2], (x) => [1 / x])(), [0.5]);
(0, assert_1.deepStrictEqual)((0, exports.pipeList)(() => [1, 2], // [1, 2]
(x) => [x - 1, x], // [0, 1, 1, 2]
(x) => (x === 0 ? [] : [1 / x]) // [1, 1, 1/2]
)(), [1, 1, 0.5]);
(0, assert_1.deepStrictEqual)((0, exports.pipeList)(() => [1, 2], // [1,               2]
(x) => [x * 2, x * 4], // [2,      4,       4,       8]
(x) => [1 / x, x * x] // [1/2, 4, 1/4, 16, 1/4, 16, 1/8, 64]
)(), [0.5, 4, 0.25, 16, 0.25, 16, 0.125, 64]);
(0, assert_1.deepStrictEqual)((0, exports.bindList)(l1, (x) => (0, exports.wrapList)(x)), []);
(0, assert_1.deepStrictEqual)((0, exports.bindList)(l2, (x) => (0, exports.wrapList)(x)), l2);
(0, assert_1.deepStrictEqual)((0, exports.bindList)(l3, (x) => (0, exports.wrapList)(x)), l3);
// map
(0, assert_1.deepStrictEqual)((0, exports.mapList)((x) => x * 2)(l1), l1);
(0, assert_1.deepStrictEqual)((0, exports.mapList)((x) => x * 2)(l2), [2]);
(0, assert_1.deepStrictEqual)((0, exports.mapList)((x) => x * 2)(l3), [2, 4]);
