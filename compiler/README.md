# Compiler

A handwritten and very rudimentary compiler for na.

Its intention is not to serve as an example of how na _should_ be parsed, but to explore what it's like to parse na by hand and to uncover any pain points doing so. It was developed using the [test suite](../test/), to discover any mistakes or ambiguities in the specification.

This was my first compiler. The lexer works reasonably well, but the parser needs more work. Notably, it doesn't handle nested multiline blocks or percentage numbers. Ideally, I'd start over again with Pratt parsing.

If you think you can do better, please do!

## Use

Import the `compile` function from `./compiler`.

For example, in an `index.ts` file in the root of this repository:

```ts
import { compile } from './compiler'

const source = `
name: 'Joe'
age: 27
`

console.log(compile(source)) // '[name: 'Joe', age: 27]'
```

It's also possible to access the `Parser` and `Lexer` classes directly.

```ts
import { Parser, Lexer } from './compiler'

const ast = new Parser().parse('[1, 2, 3]')
console.log(ast)
```

## Files

- [ast.ts](./ast.ts) — Classes for nodes in the Abstract Syntax Tree
- [error.ts](./error.ts) — Error classes
- [index.ts](./index.ts) — Entry point, the compiler's module interface
- [lexer.ts](./lexer.ts) — A very rudimentary lexer/tokenizer
- [parser.ts](./parser.ts) — A no less rudimentary parser
- [token.ts](./token.ts) — Classes for tokens emitted by the lexer
