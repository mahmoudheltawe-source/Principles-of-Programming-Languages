import { Exp, Program, isProgram, isBoolExp, isNumExp, isVarRef, isPrimOp, isProcExp, isIfExp, isAppExp, isDefineExp, PrimOp, CExp } from './L3/L3-ast';
import { cons } from './shared/list';
import { Result, makeFailure,makeOk, bind, mapResult, safe2} from './shared/result';

/*
Purpose: Transform L2 AST to JavaScript program string
Signature: l2ToJS(l2AST)
Type: [EXP | Program] => Result<string>
*/

export const l2ToJS = (exp: Exp | Program): Result<string>  => 
    isProgram(exp) ? bind(mapResult(l2ToJS,exp.exps), exps => makeOk(exps.join(";\n"))) :
    isBoolExp(exp) ? makeOk(exp.val ? 'true' : 'false'):
    isNumExp(exp) ? makeOk(exp.val.toString()) :
    isVarRef(exp) ? makeOk(exp.var) :
    isDefineExp(exp) ? bind(l2ToJS(exp.val), val => makeOk(`const ${exp.var.var} = ${val}`)) :
    isIfExp(exp) ? safe((test: string, thenE: string, alt: string) => makeOk(`(${test} ? ${thenE} : ${alt})`))(l2ToJS(exp.test), l2ToJS(exp.then), l2ToJS(exp.alt)) : 
    isPrimOp(exp) ? handlePrimOp(exp) :
    isProcExp(exp) ? bind(l2ToJS(exp.body[exp.body.length -1]), body => makeOk(`((${exp.args.map(p => p.var).join(',')}) => ${body})`)) :
    isAppExp(exp) ? (isPrimOp(exp.rator)? primOpApp2JS(exp.rator, exp.rands)
    : safe2((rator: string, rands: string[]) =>
        makeOk(`${rator}(${rands.join(',')})`))(l2ToJS(exp.rator), mapResult(l2ToJS, exp.rands))) :
    makeFailure("Never")


export const handlePrimOp = (exp: PrimOp):Result<string> => 
    exp.op === 'number?' ? makeOk(`((x) => typeof(x) === 'number')`) :
    exp.op === 'boolean?' ? makeOk(`((x) => typeof(x) === 'boolean')`) :
    makeOk(convertPrimOpJS(exp.op))

export const convertPrimOpJS = (op: string): string =>
    op === "=" || op === "eq?" ? "===" :
    op === "and" ? "&&" :
    op === "or" ? "||" :
    op === "not" ? "!" :
    op;

const primOpApp2JS = (rator: PrimOp, rands: CExp[]): Result<string> =>
    rator.op === "not" ? bind(l2ToJS(rands[0]), rand => makeOk(`(!${rand})`))
    : rator.op === 'number?' ? bind(l2ToJS(rands[0]), rand => makeOk(`((x) => typeof(x) === 'number')(${rand})`))
    : rator.op === 'boolean?' ? bind(l2ToJS(rands[0]), rand => makeOk(`((x) => typeof(x) === 'boolean')(${rand})`))
    : bind(mapResult(l2ToJS, rands), randsEval => makeOk(`(${randsEval.join(` ${convertPrimOpJS(rator.op)} `)})`));

    

export const safe = <T1, T2, T3, T4>(f: (x: T1, y: T2, z: T3) => Result<T4>): (xr: Result<T1>, yr: Result<T2>, zr: Result<T3>) => Result<T4> =>
    (xr: Result<T1>, yr: Result<T2>, zr: Result<T3>) =>
        bind(xr, (x: T1) => bind(yr, (y: T2) => bind(zr, (z: T3) => f(x, y, z))));
