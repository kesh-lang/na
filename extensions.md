# Extensions

## Modifiers

**na**'s core value types may be extended with modifiers, similar to [edn's tagged elements](https://github.com/edn-format/edn/#tagged-elements). A modifier indicates the semantic interpretation of the following value. Modifiers can either be _types_, with a leading `#`, or _functions_, without a leading `#`.

Parsers may allow clients to register handler functions for specific modifiers, transforming **na** values into data types of the target language. Handlers should be pure functions without side effects.

**Security is [paramount](https://github.com/OWASP/Top10/blob/567a84c2a88ad691a65a0de38f98408d48d8b9b5/2017/en/0xa8-insecure-deserialization.md).** A parser's built-in handlers must be pure functions with no side effects. Further, parsers must by default _not_ allow clients to register modifiers. To enable client defined modifiers, a parser must be explicitly instructed to run in unsafe mode.

If a parser encounters a modifier for which no handler is registered, it may ignore the modifier and use the value verbatim instead.

Unlike edn's tagged elements, a modifier that is not followed by a value must _not_ cause an error. A handler that is registered for the modifier may provide a default value. If the handler does not return a default value, or no handler is registered for the modifier, the modifier should be parsed as the unit type `()`.

**Resilience is important.** Parsers must be able to read any valid **na** data without causing errors. Errors may however be raised if the parser is run in strict mode.

### Examples

These examples are written in [sode](https://github.com/kesh-lang/sode).

#### Types

```lua
#person: [                     -- type definition (user defined)
    name: #string              -- type annotation
    friends?: #array(#person)  -- typed array (optional element)
]

joe: #person [name: 'Joe']     -- type assertion/casting
```

```lua
boolean: #bool 1               -- casting a number to a boolean
string: #string 42             -- casting a number to a string
array: #array(1, 2, 3)         -- explicit creation of an array
```

#### Functions

```lua
date:   instant '1985-04-12T23:20:50.52Z'  -- casting a string to an RFC 3339/ISO 8601 timestamp
area:   square(length: 7, width: 6)        -- applying a function to a tuple of values
```

## Derived formats

**na** itself may be used as a proper subset of other formats. [sode](https://github.com/kesh-lang/sode) is one such format.
