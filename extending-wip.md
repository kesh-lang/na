### Tagged values

na's core value types may be extended similarly to [edn's tagged elements](https://github.com/edn-format/edn/#tagged-elements). … indicate the semantic interpretation of the following value.

Parsers should allow clients to register function handlers for specific tags, transforming received values into appropriate data types.

If a parser encounters a tag for which no handler is registered, it may ignore the tag and use its verbatim value, possibly converting it to a more appropriate data type. Resilience is important, parsers must be able to read any valid **na** data without causing errors.

Unlike edn's tagged elements, a tag that is not followed by a value must not cause an error. A handler that is registered for the tag may provide a default value, otherwise a void value should be used.

```
-- typed values:
date:   instant '1985-04-12T23:20:50.52Z'
uuid:   uuid 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
bool:   boolean                  -- typed field
double: float64 1/3              -- typed/cast value (IEEE 754 double-precision float)
point:  point(4, 5)              -- typed tuple (type handler applied to arguments)

-- functions:
hello:  greet(name: 'joe')        -- function handler applied to a record (named arguments)
symbol: foo                       -- function handler referencing a symbol's value
```
