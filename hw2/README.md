# PPL Homework 2 - Extending the L3 Interpreter

## Team Members

- Mahmoud Haj Yahya
- Zaki Masarwa

## Overview

This homework extends the TypeScript implementation of the L3 Scheme-like interpreter. The main feature is dictionary support, implemented in several different ways to compare primitive operators, special forms, and user-defined procedures. The homework also includes syntactic transformation and translation from an L2 abstract syntax tree to JavaScript.

## Main Topics

- Language expressiveness and language variations
- Abstract syntax trees and parsers
- Applicative-order evaluation
- Substitution and environment models
- Extending an interpreter with new data types
- Primitive operators versus special forms
- Syntactic transformation between languages
- Translating an L2 AST into JavaScript
- Environment diagrams

## Implemented Components

### `src/L3`

Base L3 parser, abstract syntax tree, evaluator, values, primitives, and substitution support.

### `src/L31`

Dictionary implementation using primitive operators:

- `dict`
- `get`
- `dict?`

### `src/L32`

Dictionary implementation as a dedicated `dict` special form and dictionary value.

### `src/q23.l3`

Dictionary and error-handling operations implemented as ordinary L3 procedures, including:

- `dict`
- `get`
- `dict?`
- `make-error`
- `is-error?`
- `bind`

### `src/q24.ts`

Transforms L32 dictionary expressions into equivalent L3 applications and combines the transformed program with the L3 dictionary library.

### `src/q3.ts`

Implements `l2ToJS`, which translates an L2 abstract syntax tree into equivalent JavaScript source code.

### `src/shared`

Shared parser, list, result, formatting, box, optional, and type-predicate utilities.

### PDF Files

- `theoretical question.pdf` - submitted theoretical answers
- `Assignment 2.pdf` - original assignment instructions

## Requirements

- Node.js and npm
- TypeScript
- Jest
- Ramda
- `s-expression`

The official Homework 2 starter project is required because this submission snapshot does not include `package.json`, `tsconfig.json`, or the official `test` directory.

## How to Run

1. Copy the submitted `src` directory into the official Homework 2 starter project.
2. Open a terminal in the starter-project directory.
3. Install the exact dependencies provided by the course:

```bash
npm install
```

4. Type-check the implementation:

```bash
npx tsc --noEmit
```

5. Run all official tests:

```bash
npm test
```

The course test suite normally includes tests for the following parts:

```text
q21 - dictionaries as primitive operators
q22 - dictionaries as a special form
q23 - dictionaries as L3 procedures
q24 - L32-to-L3 syntactic transformation
q3  - L2-to-JavaScript translation
```

To run a specific Jest test file, use the test filename supplied in the official template, for example:

```bash
npm test -- q21.tests.ts
```

Do not add libraries or modify the course-provided `package.json` and `tsconfig.json`.
