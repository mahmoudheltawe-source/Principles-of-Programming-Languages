# Principles of Programming Languages - Homework Repository

A collection of four homework assignments completed for the **Principles of Programming Languages (PPL)** course at Ben-Gurion University.

## Team Members

- Mahmoud Haj Yahya
- Zaki Masarwa

## Course Project Overview

The assignments explore how programming languages are represented, interpreted, extended, and type-checked. A central part of the course is the implementation of interpreters and static-analysis components in TypeScript for L3 and L5, Scheme-like teaching languages.

The repository progresses from functional-programming foundations to interpreter extensions, type checking, continuation-passing style, laziness, and logic programming.

## Homework Summary

### [Homework 1](./hw1)

Introduces programming paradigms, functional programming in TypeScript, Ramda, recursive data processing, the `Result<T>` monad, and basic L3/Scheme list procedures.

Key implementations include vowel counting, palindrome detection, preorder tree traversal, monadic error handling, and list rotation.

### [Homework 2](./hw2)

Extends the L3 interpreter with dictionary support in three forms:

- Primitive operators
- A dedicated special form
- User-defined L3 procedures

It also includes an L32-to-L3 syntactic transformation and an L2-AST-to-JavaScript translator.

### [Homework 3](./hw3)

Extends the L5 static type checker with:

- Typed definitions
- Whole-program checking
- Pair types
- Polymorphic pair primitives
- Quote and quote-shorthand typing

The implementation works with type environments, type expressions, unification, and type inference.

### [Homework 4](./hw4)

Covers advanced language concepts in several languages:

- Promises and generators in TypeScript
- CPS and lazy lists in Racket
- Cauchy sequences and Newton-Raphson approximation
- Unification and logic programming in Prolog

## Repository Structure

```text
.
├── README.md
├── hw1
│   ├── README.md
│   ├── src
│   └── assignment and solution PDFs
├── hw2
│   ├── README.md
│   ├── src
│   └── assignment and solution PDFs
├── hw3
│   ├── README.md
│   ├── src
│   ├── hw3.test.ts
│   └── assignment and solution PDFs
└── hw4
    ├── README.md
    ├── ex4.ts
    ├── ex4.rkt
    ├── ex4.pl
    └── assignment and solution PDFs
```

## Technologies and Languages

- TypeScript
- Scheme-like languages: L3 and L5
- Racket
- Prolog
- Node.js and npm
- Jest
- Ramda
- `s-expression`

## General Setup

These folders contain the submitted source files and answers, but they do not include every file from the official course templates. In particular, some homework folders do not contain `package.json`, `tsconfig.json`, or the official automated tests.

To run a TypeScript homework correctly:

1. Download or restore the matching official course starter project.
2. Copy the submitted source files into that starter project.
3. Keep the original course `package.json` and `tsconfig.json` unchanged.
4. Run:

```bash
npm install
npx tsc --noEmit
npm test
```

For homework-specific commands and requirements, open the `README.md` file inside the relevant homework folder.

## Educational Purpose

This repository is intended to document coursework and demonstrate practical understanding of functional programming, interpreters, type systems, CPS, lazy evaluation, and logic programming.
