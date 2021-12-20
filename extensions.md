# Extensions

## Types and functions

**na**'s core value types may be extended with types and functions, similar to [edn's tagged elements](https://github.com/edn-format/edn/#tagged-elements).

Types and functions are [named](https://github.com/kesh-lang/na#names), types having a leading `#`.

When applied to a value, a type or a function _must_ appear before the value, on the same line, separated only by whitespace.

Parsers _may_ allow clients to register handlers for custom types and functions, transforming **na** values into data types of the target language. Handlers _should_ be pure functions without side effects.

### Security is [paramount](https://github.com/OWASP/Top10/blob/567a84c2a88ad691a65a0de38f98408d48d8b9b5/2017/en/0xa8-insecure-deserialization.md)

A parser's built-in handlers _must_ be pure functions with no side effects. Further, parsers _must_ by default disallow clients to register handlers. To enable client defined handlers, a parser _must_ be explicitly instructed to run in unsafe mode, which _should_ raise a warning.

### Resilience is important

If a parser encounters a type or function for which no handler is registered, it _may_ ignore it and use the value verbatim instead.

Parsers _must_ be able to read any valid **na** data without causing errors. Errors _may_, however, be raised if the parser is run in strict mode.

<!-- Unlike edn's tagged elements, a type or function that is not followed by a value must _not_ cause an error. A handler that is registered for the name may provide a default value. If the handler does not return a default value, or no handler is registered for the name, it should be parsed as the unit type `()`. -->

### Examples

These examples are written in [sode](https://github.com/kesh-lang/sode).

#### Types

```lua
#person: [                  -- type definition
    name: #text             -- type annotation
    friends?: #person[]     -- typed indexed collection (optional field)
]

joe: #person [name: 'Joe']  -- type assertion of a keyed collection

answer: #number '42'        -- casting a text to a number
```

#### Functions

```lua
date:   instant '1985-04-12T23:20:50.52Z'  -- casting a string to an RFC 3339/ISO 8601 timestamp
area:   square(7m, 6m)                     -- applying a function to a tuple of values
```

## Derived formats

**na** itself may be used as a proper subset of other data formats. [sode](https://github.com/kesh-lang/sode) is one such format.
