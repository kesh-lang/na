# Extensions

## Tagged values

**na**'s core value types may be extended similarly to [edn's tagged elements](https://github.com/edn-format/edn/#tagged-elements). A tag indicates the semantic interpretation of the following value. Tags can be either _types_, indicated by a leading `#`, or _functions_.

Parsers should allow clients to register handlers for specific tags, transforming received **na** values into data types of the target language. A parser must be stateless, any handlers should be pure functions as far as the parsed data is concerned.

If a parser encounters a tag for which no handler is registered, it may ignore the tag and use its verbatim value instead, possibly converting it to a more appropriate data type. Resilience is important. Parsers must be able to read any valid **na** data without causing errors.

Unlike edn's tagged elements, a tag that is not followed by a value must not cause an error. A handler that is registered for the tag may provide a default value, otherwise a void value should be used.

### Examples

```lua
-- types:
#person:                             -- type definition
    name: #string                    -- typed element
    friends?: [#person]              -- typed array (optional)
joe: #person [name: 'Joe']           -- typed record

-- functions:
area:   square(length: 7, width: 6)  -- function call (handler applied to arguments)
point:  Point(4, 5)                  -- constructor function producing a value
date:   instant '1985-04-12T23:20:50.52Z'  -- function applied to a single argument (RFC 3339 timestamp)
double: float64 1/3                  -- casting a value (to IEEE 754 double-precision float)
```

## Derived formats

**na** itself may be used as a subset of other formats. For example, curly brackets (`{ }`) could add support for additional data types.
