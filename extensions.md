# Extensions

## Labels

**na**'s core value types may be extended with labels, similar to [edn's tagged elements](https://github.com/edn-format/edn/#tagged-elements).

A label communicates the semantic interpretation of the following value.

Labels can either be _types_ or _functions_. Types have a leading `#`, functions do not.

Parsers may allow clients to register handler functions for specific labels, transforming **na** values into data types of the target language. Handlers should be pure functions without side effects.

### Security is [paramount](https://github.com/OWASP/Top10/blob/567a84c2a88ad691a65a0de38f98408d48d8b9b5/2017/en/0xa8-insecure-deserialization.md)

A parser's built-in handlers must be pure functions with no side effects. Further, parsers must by default _not_ allow clients to register labels. To enable client defined labels, a parser must be explicitly instructed to run in unsafe mode, which should raise a warning.

### Resilience is important

If a parser encounters a label for which no handler is registered, it may ignore the label and use the value verbatim instead.

Parsers must be able to read any valid **na** data without causing errors. Errors may, however, be raised if the parser is run in strict mode.

<!-- Unlike edn's tagged elements, a label that is not followed by a value must _not_ cause an error. A handler that is registered for the label may provide a default value. If the handler does not return a default value, or no handler is registered for the label, the label should be parsed as the unit type `()`. -->

### Examples

These examples are written in [sode](https://github.com/kesh-lang/sode).

#### Types

```lua
#person: [                  -- type definition
    name: #string           -- type annotation
    friends?: #[person]     -- typed indexed collection (optional field)
]

joe: #person [name: 'Joe']  -- type assertion of a keyed collection

boolean: #bool 1            -- casting a number to a boolean
```

#### Functions

```lua
date:   instant '1985-04-12T23:20:50.52Z'  -- casting a string to an RFC 3339/ISO 8601 timestamp
area:   square(7m, 6m)                     -- applying a function to a tuple of values
```

## Derived formats

**na** itself may be used as a proper subset of other data formats. [sode](https://github.com/kesh-lang/sode) is one such format.
