# PPL Homework 1 - Functional Programming and L3 Basics

## Team Members

- Mahmoud Haj Yahya
- Zaki Masarwa

## Overview

This homework introduces the main programming paradigms used in the Principles of Programming Languages course and applies functional-programming techniques in TypeScript. It also introduces the `Result<T>` monad and basic programming in L3, a Scheme-like language used throughout the course.

## Main Topics

- Imperative, procedural, and functional programming paradigms
- TypeScript type expressions and generic types
- Functional programming with Ramda
- Recursive processing of strings, arrays, and trees
- Error handling with the `Result<T>` monad
- Basic list procedures in L3/Scheme

## Implemented Components

### `src/part2/part2.ts`

Contains functional TypeScript solutions for:

- `countVowels` - counts vowels in a string
- `isPalindrome` - checks whether a string is a palindrome while ignoring punctuation, spaces, and capitalization
- `treeToSentence` - traverses a `WordTree` in preorder and creates a sentence

### `src/part3/find.ts`

Contains Result-monad-based error handling:

- `findResult`
- `returnSquaredIfFoundEven_v2`
- `returnSquaredIfFoundEven_v3`

### `src/part4/part4.l3`

Contains L3/Scheme procedures for list manipulation:

- `last-item`
- `remove-last-item`
- `rotate-nth`

### PDF Files

- `Part 1.pdf` - answers to the theoretical questions
- `ppl252_assignment_1.pdf` - original assignment instructions

## Requirements

- Node.js and npm
- TypeScript
- Jest
- Ramda
- DrRacket or another compatible Racket/Scheme environment

The official course starter project is also required because this submission snapshot does not include `package.json`, `tsconfig.json`, the Jest tests, or `src/lib/result.ts`.

## How to Run

### TypeScript Parts

1. Copy this homework's `src` files into the official Homework 1 starter project.
2. Open a terminal in the starter-project directory.
3. Install the provided dependencies:

```bash
npm install
```

4. Type-check the project:

```bash
npx tsc --noEmit
```

5. Run the official Jest tests:

```bash
npm test
```

Do not replace or modify the course-provided `package.json` or `tsconfig.json`.

### L3/Scheme Part

Open `src/part4/part4.l3` in DrRacket and click **Run**. Example calls:

```scheme
(last-item '(1 2 3))
(remove-last-item '(1 2 3))
(rotate-nth '(1 2 3) 1)
```

Expected results:

```scheme
3
'(1 2)
'(3 1 2)
```
