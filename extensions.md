# na(x)

**na(x)** is **na** extended with types and functions.

**na**'s [data types](README.md#data-types) may be extended with types and functions, inspired by [edn's tagged elements](https://github.com/edn-format/edn/#tagged-elements). While serving different purposes, they are technically the same, only with different semantics and namespace.

Types may be defined by both users and parsers, while functions can only be defined by parsers.

Both types and functions must be defined with a valid [name](https://github.com/kesh-lang/na#names). Types must be prefixed with a `#` sigil.

When applied to a value, a type or function _must_ appear before the value, on the same line, optionally separated by space.

Parsers _may_ allow clients to register handlers for custom types and functions, for example to transform **na** values into data types of the target language. Client-defined handlers _should_ be pure functions without side effects.

## Security is [paramount](https://github.com/OWASP/Top10/blob/567a84c2a88ad691a65a0de38f98408d48d8b9b5/2017/en/0xa8-insecure-deserialization.md)

A parser's built-in handlers _must_ be pure functions with no side effects. Further, parsers _must_ by default disallow clients to register handlers. To enable client-defined handlers, a parser _must_ be explicitly instructed to run in unsafe mode, which _should_ raise a warning.

## Resilience is important

If a parser encounters a type or function for which no handler is registered, it _may_ ignore it and use the value verbatim instead.

Parsers _must_ be able to read any syntactically valid **na** data without causing errors. Errors _may_, however, be raised if the parser is run in strict mode.

## Examples

The following examples are written in [sode](https://github.com/kesh-lang/sode).

### Type

User-defined type:

```lua
#person: [               -- type definition
    name: #text          -- type annotation
    friends?: #person[]  -- typed indexed collection (optional)
]

joe: #person [           -- type assertion/casting of a keyed collection
    name: 'Joe'
]
```

Parser-defined types:

```lua
#instant '1985-04-12T23:20:50.52Z'            -- casting of a string to an RFC 3339 timestamp
#uuid 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'  -- casting of a string to RFC 4122 UUID binary data
#base64 'RG8geW91IHNwZWFrIEJhc2U2ND8='        -- assertion of a string as RFC 4648 Base64 encoded data
```

### Function

```lua
area: square[7m, 6m]  -- applying a function to a collection of values
```

## Derived formats

**na(x)** may itself be used as a proper subset of other data formats. [sode](https://github.com/kesh-lang/sode) is one such format.
