# PPL Homework 3 - L5 Type Checker

## Team Members

- Mahmoud Haj Yahya
- Zaki Masarwa

## Overview

This homework extends the TypeScript implementation of the L5 Scheme-like language with additional static type-checking features. The implementation supports typed definitions, complete L5 programs, pair types, pair primitives, and quoted expressions.

## Main Topics

- Type expressions and type environments
- Most general unifiers and type equations
- Static type checking
- Type inference
- Typed `define` expressions
- Sequential checking of complete L5 programs
- Polymorphic pair types
- Quoted values and Scheme quote shorthand

## Implemented Components

### `src/L5/L5-typecheck.ts`

Extends the type checker with support for:

- Typed `define` expressions
- Full `(L5 <exp>+)` programs
- Updating the type environment after definitions
- Pair-related primitive operations
- Typing quoted expressions

### `src/L5/TExp.ts`

Extends the type-expression language with:

```scheme
(Pair T1 T2)
```

This includes parsing and unparsing pair type expressions.

### `src/L5/L5-ast.ts`

Extends the L5 parser and abstract syntax tree with pair primitives and quote support.

### Other `src/L5` Files

Contain the L5 evaluator, environments, values, substitutions, type equations, and type-inference infrastructure used by the checker.

### `hw3.test.ts`

Jest tests for definitions, complete programs, pair typing, polymorphic pairs, type errors, and quoted expressions.

### Supporting Directories

- `src/shared` - common parser and functional utility modules
- `src/monads` - monad examples and utilities
- `src/logic` - supporting logic-programming and unification material in Racket/TypeScript

### PDF Files

- `Part 1.pdf` - submitted theoretical answers
- `PPL_25B_ex3-release02.pdf` - original assignment instructions

## Requirements

- Node.js and npm
- TypeScript
- Jest
- Ramda
- `s-expression`
- Racket for the optional files under `src/logic`

The official Homework 3 starter project is required because this submission snapshot does not include `package.json` or `tsconfig.json`.

## How to Run

### TypeScript Type Checker

1. Place this homework's source files in the official Homework 3 starter project.
2. Open a terminal in the starter-project directory.
3. Install the course-provided dependencies:

```bash
npm install
```

4. Type-check the project:

```bash
npx tsc --noEmit
```

5. Run all Jest tests:

```bash
npm test
```

6. To run only the included Homework 3 test file:

```bash
npm test -- hw3.test.ts
```

### Optional Racket Logic Tests

With Racket installed, individual test files under `src/logic` can be run using:

```bash
raco test src/logic/unify-tests.rkt
raco test src/logic/lazy-tree-ADT-tests.rkt
raco test src/logic/substitution-adt-tests.rkt
```

Do not modify the dependency versions or compiler configuration supplied by the course template.
