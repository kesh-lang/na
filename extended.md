# na x

**na x** is **na** extended with support for types and functions.

**na**'s [data types](README.md#data-types) may be extended with types and functions, inspired by [edn's tagged elements](https://github.com/edn-format/edn/#tagged-elements).

Types may be defined by both users and parsers, while functions can only be defined by parsers.

Types and functions must be defined with a valid [name](https://github.com/kesh-lang/na#names). Types must be prefixed with a `#` sigil.

When applied to a value, a type or function _must_ appear before the value, on the same line, separated by space.

Parsers _may_ allow clients to register handlers for custom types and functions, for example to transform **na** values into data types of the target language. Client-defined handlers _should_ be pure functions without side effects.

### Security is [paramount](https://github.com/OWASP/Top10/blob/567a84c2a88ad691a65a0de38f98408d48d8b9b5/2017/en/0xa8-insecure-deserialization.md)

A parser's built-in handlers _must_ be pure functions with no side effects. Further, parsers _must_ by default disallow clients to register handlers. To enable client-defined handlers, a parser _must_ be explicitly instructed to run in unsafe mode, which _should_ raise a warning.

### Resilience is important

If a parser encounters a type or function for which no handler is registered, it _may_ ignore it and use the value verbatim instead.

Parsers _must_ be able to read any syntactically valid **na** data without causing errors. Errors _may_, however, be raised if the parser is run in strict mode.

## Standard types

```lua
#any: #none | #some
#some: #truth | #number | #text | #block
#number: #decimal | #integer | #natural | #ratio
#list: [ #natural: #any ]  -- key signature
#record: [ #name: #any ]   -- key signature
```

Where:

- `#none` denotes the concept of `nothing`/`null`/`nil`/`void`/`undefined`
- `#name` denotes a [valid name](README.md#names)
- [`#number`](README.md#number) has the following subtypes:
    - `#decimal` denotes a decimal _approximation_ of a [real number](https://en.wikipedia.org/wiki/Real_number) (ℝ)
        - `#integer` denotes an [integer number](https://en.wikipedia.org/wiki/Integer) (ℤ)
            - `#natural` denotes a [natural number](https://en.wikipedia.org/wiki/Natural_number) (ℕ), a non-negative integer
    - `#ratio` denotes a [rational number](https://en.wikipedia.org/wiki/Rational_number) (ℚ), the ratio of two positive integers

In standard **na x**, `#name` may only be used as the key of a key signature, and keys may only be of the type `#natural` or `#name`.

## Examples

The following examples are written in [sode](https://github.com/kesh-lang/sode).

### User-defined types

```lua
#person: [                     -- type definition
    name: #text                -- type annotation
    friends: #persons | #none  -- optional item
]

#persons: [#natural: #person]  -- list type (key signature)

joe: #person [                 -- typed record
    name: 'Joe'
]
```

### Parser-defined functions

```lua
area: square[7m, 6m]                          -- applying a function to a block of values
timestamp: instant '1985-04-12T23:20:50.52Z'  -- "casting" a string to an RFC 3339 timestamp
id: uuid 'f81d4fae7dec11d0a76500a0c91e6bf6'   -- "casting" a string to an RFC 4122 UUID
```

## Derived formats

**na x** may itself be used as a subset of other data formats.
