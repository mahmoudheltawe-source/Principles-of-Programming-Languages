"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
// Monad.ts
// https://www.youtube.com/watch?v=C2w45qRc3aU
// Absolute Best Intro to Monads for Software Engineers
// 00:00 Intro
// 00:29 Basic Code
// 01:45 Issue #1
// 02:38 Issue #2
// 04:11 Putting It All Together
// 05:15 Properties of Monads
// 06:05 The Option Monad
// 09:14 Monads Hide Work Behind The Scenes
// 11:21 Common Monads
// 12:10 The List Monad
// 13:56 Recap
//
// Inspired by:
// Bartosz Mikewski - Category Theory 3.2: Kleisli category https://www.youtube.com/watch?v=i9CU4CuHADQ
// This is a more mathematical description of the same material.
//
// Scott Waschlin - The Power of Composition - https://www.youtube.com/watch?v=vDe-4o8Uwl8
// - Functions are "things"
// = Composition everywhere
// = Types are not classes (they are sets)
//
// Pipe example
// x |> f1 |> f2 |> f3
// In Typescript:
// bind(bind(bind(x, f1), f2), f3)
// Or using Ramda:
// pipe(f1, f2, f3)(x)
// Algebraic Type Systems:
// - Composable type systems - compose types with OR and AND
// - AND: tuple
// - OR: union (discriminated union) usually product types
// Can compose types
//
// Obstacles to composition
// - Multiple parameters
//   Example: replace(oldValue, newValue, inputStr) -> string
// - Solution: currying / partial functions
// replace(old)(new)(inputStr)
// - One input - multiple possible outputs
// - Different types of inputs - multiple possible outputs
// - Multiple inputs - One output
// - Multiple inputs - Multiple outputs
// Solutions:
// wrap unions and products of values into algebraic types
// override composition operator for each type of types
// ===========================
// Motivating example: logging
// Consider simple full functions [number => number]
const square = (x) => x * x;
const inc = (x) => x + 1;
// It is easy to compose them anyway we want
inc(square(2));
(0, ramda_1.pipe)(square, inc)(2);
// First attempt:
const square1 = (x) => ({
    result: x * x,
    logs: [`Squared ${x} to get ${x * x}`],
});
// the input param is a wrapper which "remembers" what has already been performed.
// the operation concatenates a new line to the logs field
const inc1 = (x) => ({
    result: x.result + 1,
    logs: [...x.logs, `Added 1 to ${x.result} to get ${x.result + 1}`],
});
// { result: 5, logs: [ 'Squared 2 to get 4', 'Added 1 to 4 to get 5' ] }
console.log(inc1(square1(2)));
// Problems: these functions are not composable!
// inc1(5) --> bad type
// square1(square1(2)) --> bad type
// square1(inc1(2)) --> bad type
// In general - we observe that "uniform" function types [N => N]
// became "non-uniform" [N => NwL] and [NwL => NwL]
// To resolve this - let us:
// 1. disentangle the construction and maintenance of the logs list from the computation.
// 2. align all operations to the same type
// Let's first create a "constructor" for the new type (we will call this a wrapper)
// The wrapper moves the initial parameter into the "NumberWithLogs" domain
const wrapNumberWithLogs = (x) => ({
    result: x,
    logs: [],
});
// Align all the functions to the same shape [NwL => NwL]
// We then combine NumberWithLogs values
const square2 = (x) => ({
    result: x.result * x.result,
    logs: [...x.logs, `Squared ${x.result} to get ${x.result * x.result}`],
});
// This mechanism is now composable when we use the wrapper where needed
console.log(square2(square2(wrapNumberWithLogs(2))));
console.log(inc1(wrapNumberWithLogs(5)));
(0, ramda_1.pipe)(wrapNumberWithLogs, inc1, square2)(5);
// Graphically - we think of two planes:
// - the "plain type" (numbers in our example)
// - the "embellished type" (NumberWithLogs in our example)
// The last pipe can be described as this route:
// NumberWithLogs       NwL[5] -inc1-> NwL[6] --square2--> NwL[36]
//                      /
//                   wrap
//                   /
// Number          5
// In this diagram:
// - wrap is a "diagonal" operator (from normal type to embellished type)
// - inc1 and square2 are "lifted" operators (instead of N=>N - they are NwL=>NwL)
// =================================================
// Remove the duplicated code:
// We see in all functions of type [NwL => NwL] the same code will appear:
// logs: [...x.logs, `...abc`]
// This repetition is a bad smell of something wrong - we want to abstract it away.
// Also we want to fix the violation of "separation of concern":
// The new functions (inc1, square2) must "know about log concatenation" - we want
// the function to only know about how to compute (increment, square).
// Just an intermediary step towards a solution:
// Separate log concatenation logic from core of function
const square3 = (x) => {
    // Code that is specific to 'square'
    const result = {
        result: x.result * x.result,
        logs: [`Squared ${x.result} to get ${x.result * x.result}`],
    };
    // Code is always the same for all [NwL => NwL] functions
    return {
        result: result.result,
        logs: [...x.logs, ...result.logs],
    };
};
// Let us "abstract away" the repeated code in a separate function.
// We will write the application of functions in the "NumberWithlogs domain" as:
// runWithLogs(wrapWithLogs(5), inc)
// Instead of inc(5) in the "number domain".
// In our intermediary version, we used inc1(wrapWithLogs(5))
// Now, runWithLogs will deal with log concatenation and the function
// will only do the part that is specific to the transformation it computes.
// Infer the type of runWithLogs:
const runWithLogs = (x, transform) => {
    // transform is the "parametric" transformation
    // different for each function
    const newNumberWithLogs = transform(x.result);
    // The constant part is kept here
    return {
        result: newNumberWithLogs.result,
        logs: [...x.logs, ...newNumberWithLogs.logs],
    };
};
// Now the signature of the "transform" functions is simplified:
// - Take a simple number as parameter
// - Return a NumberWithLogs with a single log message
//
// These functions all have the following structure:
// - From "Normal type" (number) to "Embellished Type" (NumberWithLogs)
// - They do not "know" about how to "compute" the embellished type (concatenate logs)
// These transformers are "diagonal" operators,
const square4 = (x) => ({
    result: x * x,
    logs: [`Squared ${x} to get ${x * x}`],
});
const inc4 = (x) => ({
    result: x + 1,
    logs: [`Added 1 to ${x} to get ${x + 1}`],
});
// Usage: we can now combine the calls in any combination
//        we only need to start with a "wrapped" value in the embellished type
const a = wrapNumberWithLogs(5);
const b = runWithLogs(a, inc4);
const c = runWithLogs(b, square4);
const d = runWithLogs(c, square4);
console.log(d);
/*
{
  result: 1296,
  logs: [
    'Added 1 to 5 to get 6',
    'Squared 6 to get 36',
    'Squared 36 to get 1296'
  ]
}
*/
// If we want to use pipe - a new version of pipe is needed - that knows about the logic
// of this type with its running protocol.
// pipeWithLogs combines a sequence of diagonal operators
// and "overrides" the composition operator by using runWithLogs
const isEmpty = (l) => l.length === 0;
// @Precondition: l is non-empty
const first = (l) => l[0];
const rest = (l) => l.slice(1);
const pipeWithLogs = (...funcs) => isEmpty(funcs)
    ? wrapNumberWithLogs
    : (x) => runWithLogs(first(funcs)(x), pipeWithLogs(...rest(funcs)));
const e = pipeWithLogs(inc4, square4, square4)(5);
console.log(e);
// Type predicate
const isSome = (x) => x.tag === "some";
const some = (x) => ({ value: x, tag: "some" });
const none = () => ({ tag: "none" });
const isNone = (x) => x.tag === "none";
const wrap = (x) => x === undefined ? none() : some(x);
// Override application operator for Option
const bind = (input, transform) => (isSome(input) ? transform(input.value) : input);
// Override composition operator for Option - composition uses bind
const pipeOption2 = (f1, f2) => (x) => bind(f1(x), f2);
const pipeOption3 = (f1, f2, f3) => (x) => bind(bind(f1(x), f2), f3);
// We can now define a function like compose which enforces proper "compsability" of its parameters
// myPipe is the usual function composition operator (as it is defined in Ramda)
// If the parameter composables (variadic number of arguments) does not match the composition constraint
// we type it as a chain with INVALID_COMPOSABLE in the position that does not fit - this will make type checking fail
// and provide detailed feedback to the programmer - which function is not ok in the chain.
// If the types match the constraint - we compute the type of the resulting function as input type of the first function in
// the chain and return type of the last function in the chain.
function myPipe(...composables) {
    // myPipe returns a function
    return (firstData) => {
        // Implement the pipe composition in a non-functional manner
        // Note that it is ok to use 'any' here because we know the types match
        // from the parameter type checking.
        // We could use instead a recursive functional implementation.
        let data = firstData;
        for (const composable of composables) {
            data = composable(data);
        }
        return data;
    };
}
// pipeOption must return wrap for the case of 0 arguments
const pipeOption = (...composables) => 
// return a function
(firstData) => {
    let data = firstData;
    // Override application operator for Option
    // inline the bind logic - enable shortcut return on None
    for (const composable of composables) {
        data = composable(data);
        if (isNone(data))
            return data;
        else
            data = data.value;
    }
    return wrap(data);
};
// pipeOption() without parameters is like wrap()
// This is the reason wrap() is often called the "unit" element of the monad
// it is the "neutral element" for monad composition.
// This is similar to what happened in the discussion of reduce((acc,item)=>acc+item, 0, [1,2,3])
const f = pipeOption();
console.log(`wrap 1 `, f(1));
const g = pipeOption((_) => some("a"));
const h = pipeOption((_) => some("a"), (_) => some(1), (_) => some(1));
console.log(`h(1) -> `, h(1));
const getCurrentUser1 = () => ({
    name: "Michael",
    pet: { nickName: "doggy" },
});
const getPet1 = (user) => user.pet;
const getNickName1 = (pet) => pet.nickName;
// These functions are difficult to compose because they return
// a union of two incompatible values (true value or undefined).
// We need to add "guards" before passing the return value to another function.
// Lots of if statements...
// We would like to write:
// getNickName1(getPet1(getCurrentUser1()))
// or pipe(getCurrentUser1, getPet1, getNickName1)()
// but instead we need to write:
const getPetNickName1 = () => {
    const user = getCurrentUser1();
    if (user === undefined)
        return undefined;
    const userPet = getPet1(user);
    if (userPet === undefined)
        return undefined;
    const userPetNickName = getNickName1(userPet);
    if (userPetNickName === undefined)
        return undefined;
    return userPetNickName;
};
console.log(getPetNickName1());
// ==============================
// With Option
const getCurrentUser2 = () => some({ name: "Michael", pet: { nickName: "doggy" } });
// No mention of "undefined" - no if
const getPetNickName2 = () => {
    const user = getCurrentUser2();
    const userPet = bind(user, (user) => wrap(user.pet));
    const userPetNickName = bind(userPet, (pet) => wrap(pet.nickName));
    return userPetNickName;
};
console.log(getPetNickName2());
// With "functional composition" with embedded calls to bind
const getPetNickName3 = () => bind(getCurrentUser2(), (user) => bind(wrap(user.pet), (pet) => wrap(pet.nickName)));
console.log(getPetNickName3());
// ==============================
// With "pipe functional composition"
// Operators that can be composed in a bind chain
// must have type T1 => Option<T2>
// They are "diagonal" from "normal types" to "option types".
// The resulting composition is also "diagonal".
const getPet2 = (user) => wrap(user.pet);
const getNickName2 = (pet) => wrap(pet.nickName);
// Can be composed as:
const getPetNickName4 = pipeOption(getCurrentUser2, getPet2, getNickName2);
console.log(getPetNickName4(undefined));
// => { value: 'doggy', tag: 'some' }
// ============================================================
// Summary of monad interface
//
// bind: apply transform f: [T1 => M[T2]] to monadic value M[t1]
// bind: M[T1] => (T1 => M[T2]) => M[T2]
// wrap: T => M[T]
// map: lift horizontal transform from values to monadic values: f: T1 => T2, map(f): M[T1] => M[T2]
// map: (T1 => T2) => (M[T1] => M[T2])
// chain: lift diagonal transform to lifted
// chain: (T1 => M[T2]) => (M[T1] => M[T2])
// fold: (M[T1], handleA: () => T2, handleB: (item, acc) => T2) => T2
// pipeM: (T1 => M[T2], T2 => M[T3], ..., Tn-1 => M[Tn]): [T1 => M[Tn]] - compose a sequence of diagonal operators into a diagonal operator.
