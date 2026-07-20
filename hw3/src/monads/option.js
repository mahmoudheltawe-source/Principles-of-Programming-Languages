"use strict";
// ========================================================
// Option monad (aka Maybe)
// Michael Elhadad - April 2023
Object.defineProperty(exports, "__esModule", { value: true });
exports.foldOption = exports.getOrElseOption = exports.pipeOption = exports.chainOption = exports.mapOption = exports.wrapOption = exports.bindOption = exports.some = exports.isSome = exports.none = exports.isNone = void 0;
const assert_1 = require("assert");
const ramda_1 = require("ramda");
const isNone = (x) => x.tag === "none";
exports.isNone = isNone;
const none = () => ({ tag: "none" });
exports.none = none;
const isSome = (x) => x.tag === "some";
exports.isSome = isSome;
const some = (x) => ({ value: x, tag: "some" });
exports.some = some;
// Override application operator for Option values
// transform is a "diagonal operator" - from T1 => Option<T2>
// bind adapts diagonal operators to work on Option<T1> values.
const bindOption = (input, transform) => ((0, exports.isSome)(input) ? transform(input.value) : input);
exports.bindOption = bindOption;
// ==================================
// Lift from values to monadic values
// wrapOption: lift a value
const wrapOption = (x) => x === undefined ? (0, exports.none)() : (0, exports.some)(x);
exports.wrapOption = wrapOption;
// mapOption: flat [T1=>T2] to lifted [Option<T1>=>Option<T2>]
const mapOption = (f) => (y) => (0, exports.bindOption)(y, (x) => (0, exports.wrapOption)(f(x)));
exports.mapOption = mapOption;
// chainOption: diagonal [T1=>Option<T2>] to lifted [Option<T1>=>Option<T2>]
// When composing a mixture of diagonal and flat functions - use map and chain as params to pipe
// When composing only diagonal functions - use pipeOption
const chainOption = (f) => (y) => (0, exports.bindOption)(y, f);
exports.chainOption = chainOption;
(0, ramda_1.pipe)(exports.wrapOption, (0, exports.mapOption)((x) => x * x), (0, exports.chainOption)((x) => x === 0 ? (0, exports.none)() : (0, exports.some)(1 / x)), (0, exports.mapOption)((x) => x * x))(5);
// ---------------------------
// We can now implement a type safe pipeOption
const pipeOption = (...composables) => 
// return a function
(firstData) => {
    let data = firstData;
    // Override application operator for Option
    // inline the bind logic - enable shortcut return on None
    for (const composable of composables) {
        data = composable(data);
        if ((0, exports.isNone)(data))
            return data;
        else
            data = data.value;
    }
    return (0, exports.wrapOption)(data);
};
exports.pipeOption = pipeOption;
// Methods to unlift from the Option
// -------------------------------
// getOrElseOption
// Example:
// getOrElse(some(1), undefined) -> 1
// getOrElse(none(), undefined) -> undefined
const getOrElseOption = (o, whenNone) => (0, exports.isNone)(o) ? whenNone : o.value;
exports.getOrElseOption = getOrElseOption;
// foldOption(o:Option<T1>, ()=>T2, (val:T1)=>T3)
// Example:
// foldOption(none(), () => undefined, (val: number) => val) -> undefined
// foldOption(some(1), () => undefined, (val: number) => val) -> 1
const foldOption = (o, handleNone, handleSome) => ((0, exports.isSome)(o) ? handleSome(o.value) : handleNone());
exports.foldOption = foldOption;
// ===========================================
// Examples
// Unlift
const o1 = (0, exports.none)();
const o2 = (0, exports.some)(1);
(0, assert_1.deepStrictEqual)((0, exports.getOrElseOption)(o1, undefined), undefined);
(0, assert_1.deepStrictEqual)((0, exports.getOrElseOption)(o2, undefined), 1);
(0, assert_1.deepStrictEqual)((0, exports.foldOption)(o1, () => undefined, (val) => val), undefined);
(0, assert_1.deepStrictEqual)((0, exports.foldOption)(o2, () => undefined, (val) => val), 1);
// Compose and apply
(0, assert_1.deepStrictEqual)((0, exports.pipeOption)(() => o1, (x) => (0, exports.some)(x * 2), (x) => (0, exports.some)(1 / x))(), (0, exports.none)());
(0, assert_1.deepStrictEqual)((0, exports.pipeOption)(() => o2, (x) => (0, exports.some)(x * 2), (x) => (0, exports.some)(1 / x))(), (0, exports.some)(0.5));
(0, assert_1.deepStrictEqual)((0, exports.bindOption)(o1, (x) => (0, exports.some)(x)), (0, exports.none)());
(0, assert_1.deepStrictEqual)((0, exports.bindOption)(o2, (x) => (0, exports.some)(x)), o2);
// map
(0, assert_1.deepStrictEqual)((0, exports.mapOption)((x) => x * 2)(o1), (0, exports.none)());
(0, assert_1.deepStrictEqual)((0, exports.mapOption)((x) => x * 2)(o2), (0, exports.some)(2));
