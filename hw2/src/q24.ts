import parse, { Sexp } from 's-expression';
import * as fs from 'fs';
import {
    makePrimOp, makeBinding, isLetExp, makeLetExp, makeProcExp, isIfExp, isProcExp, isAppExp, makeIfExp, CExp, AppExp,
    Exp, makeProgram, Binding, Program, makeAppExp, makeVarRef, isProgram, isDefineExp, makeDefineExp, isCExp,
    CompoundExp,
    isVarRef, isLitExp, isAtomicExp,
    isNumExp,
    isBoolExp,
    unparseL32,
    parseL32,
    parseL32Exp,
    parseSExp
} from './L32/L32-ast';
import { DictMap, makeLitExp, DictExp, isDictExp } from './L32/L32-ast';
import { makeCompoundSExp, makeEmptySExp, SExpValue, CompoundSExp, makeSymbolSExp } from './L32/L32-value';
import { parseL3 } from "../src/L3/L3-ast";
import { either, isOk, Result } from './shared/result';
import { bind, is } from 'ramda';
import { isNumber, isString } from './shared/type-predicates';

const q23: string = fs.readFileSync(__dirname + '/../src/q23.l3', { encoding: 'utf-8' });

const q23L3: Result<Program> = parseL3(`(L3 ${q23})`);

/*
Purpose: rewrite all occurrences of DictExp in a program to AppExp.
Signature: Dict2App (exp)
Type: Program -> Program
*/
export const Dict2App = (exp: Program): Program =>
    //@TODO
    isProgram(exp) ? makeProgram(exp.exps.map(Rexp)) : exp;

// Function to merge two programs into one in a functional way
export const unionPrograms = (prog1: Program, prog2: Program): Program =>
    makeProgram([...prog1.exps, ...prog2.exps]);

// Purpose: Parse the L3 program and transform it to program before merge
export const q23L3Program = (st: Result<Program>): Program =>
    isOk(st) ? st.value : makeProgram([]);
/*
Purpose: Transform L32 program to L3
Signature: L32ToL3(prog)
Type: Program -> Program
*/
export const L32toL3 = (prog: Program): Program =>
    isProgram(prog) ? unionPrograms(q23L3Program(q23L3), Dict2App(prog)) : makeProgram([]);

export const Rexp=(exp: Exp): Exp => (

    isCExp(exp) ? createCExp(exp) :
        isDefineExp(exp) ? makeDefineExp(exp.var, createCExp(exp.val)) : exp
)

export const createCExp=(cexp: CExp): CExp => (
    isDictExp(cexp) ? ReMakeDictExp(cexp) :
        isAppExp(cexp) ? ReMakeAppExp(cexp) :
            isIfExp(cexp) ? makeIfExp(createCExp(cexp.test), createCExp(cexp.then), createCExp(cexp.alt)) :
                isLetExp(cexp) ? makeLetExp(cexp.bindings.map(b => makeBinding(b.var.var, createCExp(b.val))), cexp.body.map(createCExp)) :
                    isProcExp(cexp) ? makeProcExp(cexp.args, cexp.body.map(createCExp)) :
                        cexp

)

export const ReMakeAppExp = (cexp: AppExp): CExp => (
    isDictExp(cexp.rator) ?
        makeAppExp(makeVarRef("get"), [ReMakeDictExp(cexp.rator), ...cexp.rands.map(e => createCExp(e))]) :
        isIfExp(cexp.rator) ?
            makeAppExp(makeVarRef("get"), [createCExp(cexp.rator), ...cexp.rands.map(e => createCExp(e))]) :
            makeAppExp(createCExp(cexp.rator), cexp.rands.map(createCExp))
)

export const ReMakeDictExp = (cexp: DictExp): AppExp => (
    makeAppExp(makeVarRef("dict"), [makeLitExp(convertDict(cexp.map))])
)
export const convertDict = (map: DictMap[]): CompoundSExp => (
    map.length === 1 ?
        makeCompoundSExp(makeCompoundSExp(map[0].key, getVal(map[0].val)), makeEmptySExp()) :
        makeCompoundSExp(makeCompoundSExp(map[0].key, getVal(map[0].val)), convertDict(map.slice(1)))
);

export const getVal = (val: CExp): SExpValue =>
    isVarRef(val) ? makeSymbolSExp(val.var) :
    isNumExp(val) ? val.val :
    isBoolExp(val) ? val.val :
    isLitExp(val) ? val.val :
    either(parseSExp(parse(unparseL32(val))),(v) => v,(_) => makeSymbolSExp("unsupported"));


