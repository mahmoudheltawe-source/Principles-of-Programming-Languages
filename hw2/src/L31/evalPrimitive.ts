import { find, forEach, reduce } from "ramda";
import { PrimOp } from "./L31-ast";
import { isCompoundSExp, isEmptySExp, isSymbolSExp, makeCompoundSExp, makeEmptySExp, CompoundSExp, EmptySExp, Value, SExpValue, Closure, SymbolSExp } from "./L31-value";
import { List, allT, cons, first, isNonEmptyList, rest } from '../shared/list';
import { isBoolean, isNumber, isString } from "../shared/type-predicates";
import { Result, makeOk, makeFailure } from "../shared/result";
import { format } from "../shared/format";
import { argv } from "process";

export const applyPrimitive = (proc: PrimOp, args: Value[]): Result<Value> =>
    proc.op === "dict?" ? makeOk(isDictPrim(args[0])) :
        proc.op === "dict" ? dictPrime(args) :
            proc.op === "get" ? getPrim(args) :
                proc.op === "+" ? (allT(isNumber, args) ? makeOk(reduce((x, y) => x + y, 0, args)) :
                    makeFailure(`+ expects numbers only: ${format(args)}`)) :
                    proc.op === "-" ? minusPrim(args) :
                        proc.op === "*" ? (allT(isNumber, args) ? makeOk(reduce((x, y) => x * y, 1, args)) :
                            makeFailure(`* expects numbers only: ${format(args)}`)) :
                            proc.op === "/" ? divPrim(args) :
                                proc.op === ">" ? makeOk(args[0] > args[1]) :
                                    proc.op === "<" ? makeOk(args[0] < args[1]) :
                                        proc.op === "=" ? makeOk(args[0] === args[1]) :
                                            proc.op === "not" ? makeOk(!args[0]) :
                                                proc.op === "and" ? isBoolean(args[0]) && isBoolean(args[1]) ? makeOk(args[0] && args[1]) :
                                                    makeFailure(`Arguments to "and" not booleans: ${format(args)}`) :
                                                    proc.op === "or" ? isBoolean(args[0]) && isBoolean(args[1]) ? makeOk(args[0] || args[1]) :
                                                        makeFailure(`Arguments to "or" not booleans: ${format(args)}`) :
                                                        proc.op === "eq?" ? makeOk(eqPrim(args)) :
                                                            proc.op === "string=?" ? makeOk(args[0] === args[1]) :
                                                                proc.op === "cons" ? makeOk(consPrim(args[0], args[1])) :
                                                                    proc.op === "car" ? carPrim(args[0]) :
                                                                        proc.op === "cdr" ? cdrPrim(args[0]) :
                                                                            proc.op === "list" ? makeOk(listPrim(args)) :
                                                                                proc.op === "pair?" ? makeOk(isPairPrim(args[0])) :
                                                                                    proc.op === "number?" ? makeOk(typeof (args[0]) === 'number') :
                                                                                        proc.op === "boolean?" ? makeOk(typeof (args[0]) === 'boolean') :
                                                                                            proc.op === "symbol?" ? makeOk(isSymbolSExp(args[0])) :
                                                                                                proc.op === "string?" ? makeOk(isString(args[0])) :
                                                                                                    makeFailure(`Bad primitive op: ${format(proc.op)}`);


const minusPrim = (args: Value[]): Result<number> => {
    // TODO complete
    const x = args[0], y = args[1];
    if (isNumber(x) && isNumber(y)) {
        return makeOk(x - y);
    }
    else {
        return makeFailure(`Type error: - expects numbers ${format(args)}`);
    }
};

const divPrim = (args: Value[]): Result<number> => {
    // TODO complete
    const x = args[0], y = args[1];
    if (isNumber(x) && isNumber(y)) {
        return makeOk(x / y);
    }
    else {
        return makeFailure(`Type error: / expects numbers ${format(args)}`);
    }
};


const eqPrim = (args: Value[]): boolean => {
    const x = args[0], y = args[1];
    if (isSymbolSExp(x) && isSymbolSExp(y)) {
        return x.val === y.val;
    }
    else if (isEmptySExp(x) && isEmptySExp(y)) {
        return true;
    }
    else if (isNumber(x) && isNumber(y)) {
        return x === y;
    }
    else if (isString(x) && isString(y)) {
        return x === y;
    }
    else if (isBoolean(x) && isBoolean(y)) {
        return x === y;
    }
    else {
        return false;
    }
};
const carPrim = (v: Value): Result<Value> =>
    isCompoundSExp(v) ? makeOk(v.val1) :
        makeFailure(`Car: param is not compound ${format(v)}`);

const cdrPrim = (v: Value): Result<Value> =>
    isCompoundSExp(v) ? makeOk(v.val2) :
        makeFailure(`Cdr: param is not compound ${format(v)}`);

const consPrim = (v1: Value, v2: Value): CompoundSExp =>
    makeCompoundSExp(v1, v2);

export const listPrim = (vals: List<Value>): EmptySExp | CompoundSExp =>
    isNonEmptyList<Value>(vals) ? makeCompoundSExp(first(vals), listPrim(rest(vals))) :
        makeEmptySExp();

const isPairPrim = (v: Value): boolean =>
    isCompoundSExp(v);

//Ditionary primitives////////////////////////////////////////

const getPrim = (args: Value[]): Result<Value> =>(
    args.length !== 2 ? makeFailure(`get expects exactly 2 arguments (dict, parmeter key), got ${args.length}`):
    !isDictPrim(args[0]) ? makeFailure(`First argument to get must be a dictionary, got ${format(args[0])}`):
    lookupKey(args[0], args[1])
);
const lookupKey = (dict: Value, key: Value): Result<Value> => (
    isEmptySExp(dict) ? makeFailure(`Key not found 117: ${format(key)}`) :
    isCompoundSExp(dict) ?
        isCompoundSExp(dict.val1) ?
            eqPrim([dict.val1.val1, key]) ?
                makeOk(dict.val1.val2) :
                lookupKey(dict.val2, key)
            :
            makeFailure(`Invalid dictionary structure`)
        :
        makeFailure(`Invalid dictionary structure`)
);
const isDictPrim = (v: Value): boolean => (
    isEmptySExp(v) ?
        true :
        !isCompoundSExp(v) ?
            false :
            !isCompoundSExp(v.val1) ?
                false :
                isDictPrim(v.val2)

)
const dictPrime = (args: Value[]): Result<Value> => (
    args.length !== 1 ?
    makeFailure(`dict expects exactly 1 argument, got ${args.length}`) :
    isDictPrim(args[0]) ?
    isValidKeyValuePair(args[0]) ?
    makeOk(args[0]) :
    makeFailure(`Invalid dictionary structure double keys found`) 
    :
    makeFailure(`Argument to dict must be a list of pairs`)
);


const isEmptyDict = (v: Value): boolean => (
    isEmptySExp(v)
);

// Helper to check if two values are equal keys
const isSameKey = (k1: Value, k2: Value): boolean =>
    eqPrim([k1, k2]);

// Checks if a key already exists in a list of key-value pairs
const keyExists = (key: Value, dict: Value): boolean => {
    if (isEmptySExp(dict)) return false;
    if (!isCompoundSExp(dict) || !isCompoundSExp(dict.val1)) return false;

    const pair = dict.val1;
    if (isSameKey(pair.val1, key)) return true;

    return keyExists(key, dict.val2);
};

const isValidKeyValuePair = (dict: Value): boolean => helper(dict,[]);

export const helper = (cur: Value, seen: Value[]): boolean =>(
    isEmptySExp(cur) ? true: 
    isCompoundSExp(cur) && isCompoundSExp(cur.val1) ? helper2(cur.val1 as CompoundSExp,(cur.val1 as CompoundSExp).val1,seen,cur):
    false
);
export const helper2 = (pair: CompoundSExp, key: SExpValue, seen: Value[], cur:Value) : boolean =>
    seen.some(k => isSameKey(k, key))? false : helper((cur as CompoundSExp).val2 as Value, [...seen, key]);




