# PPL Homework 4 - Promises, CPS, Laziness, and Logic Programming

## Team Members

- Mahmoud Haj Yahya
- Zaki Masarwa

## Overview

This homework combines several advanced programming-language concepts across TypeScript, Racket, and Prolog. It includes an implementation similar to `Promise.all`, infinite Fibonacci generators, continuation-passing style, lazy-list representations of real numbers, Newton-Raphson square roots, unification, and logic-programming queries.

## Main Topics

- JavaScript promises and asynchronous computation
- TypeScript generators
- Continuation-passing style (CPS)
- Success and failure continuations
- Lazy lists and infinite sequences
- Cauchy-sequence representation of real numbers
- Newton-Raphson approximation
- Unification
- Logic programming with Prolog

## Files and Implementations

### `ex4.ts`

Contains:

- `all` - waits for all input promises and preserves result order
- `Fib1` - Fibonacci generator based on the recurrence relation
- `Fib2` - Fibonacci generator based on Binet's formula

### `ex4.rkt`

Contains Racket implementations for:

- CPS append: `append$`
- Tree-structure comparison: `equal-trees$`
- Lazy-list utilities
- Real-number arithmetic over Cauchy sequences
- Newton-Raphson sequence generation: `sqrt-with`
- Diagonalization: `diag`
- Lazy square root: `rsqrt`

### `ex4.pl`

Contains a Prolog book database and predicates for:

- Maximum Church numeral in a list: `max_list/2`
- Authors who wrote in a genre: `author_of_genre/2`
- Longest book by an author: `longest_book/2`

### `ex4.pdf`

Contains the theoretical answers, proofs, unification steps, and proof-tree work.

### `Assignment 4.pdf`

Original assignment instructions.

## Requirements

- Node.js and npm
- TypeScript and Jest
- Racket/DrRacket
- SWI-Prolog

The official Homework 4 starter project is required for the provided `package.json`, `tsconfig.json`, and automated test files.

## How to Run

### TypeScript Questions

1. Copy `ex4.ts` into the official Homework 4 starter project.
2. Install the provided dependencies:

```bash
npm install
```

3. Type-check the project:

```bash
npx tsc --noEmit
```

4. Run the official tests:

```bash
npm test
```

### Racket Questions

Open `ex4.rkt` in DrRacket and click **Run**, or load it from a terminal:

```bash
racket ex4.rkt
```

The official Racket tests can be opened in DrRacket and executed with the green **Run** button. Example expressions after loading the file:

```scheme
(append$ '(1 2) '(3 4) (lambda (x) x))
(take (rsqrt (as-real 4.0)) 6)
```

### Prolog Questions

Start SWI-Prolog with the submitted file:

```bash
swipl -s ex4.pl
```

Example queries:

```prolog
?- max_list([s(zero), zero, s(s(zero))], Max).
?- author_of_genre(fantasy, Author).
?- longest_book(tolkien, Book).
```

Exit SWI-Prolog with:

```prolog
?- halt.
```
