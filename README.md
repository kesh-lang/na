# na

> **kesh** data notation format – suitable for streaming, or simply the conveyance of values

**na** is the kesh word for _river_.

## Preliminary definition

Inspired by Rich Hickey's [edn](https://github.com/edn-format/edn/), **na** is a simple yet extensible data notation for the conveyance of values. It serves as a strict subset for the [sode](https://github.com/kesh-lang/sode) file format and the [kesh](https://github.com/kesh-lang/kesh) programming language.

**na**'s value types are intended to represent a minimal set of data structures common to most programming languages. A parser should attempt to map the value types to programming language types with similar semantics. These should ideally be considered immutable value types, to the extent possible.

### Core value types

1. **boolean**
2. **number**
3. **string**
4. **collection** – a collection of either ordered values or key/value pairs, either immutable or mutable

### Identifiers

**na** meets [UAX31-R1](https://unicode.org/reports/tr31/#R1) of Unicode 13 by adopting a _profile_ adding the optional start character `_` (low line) and the optional medial character `-` (hyphen-minus). In the syntax of UAX31:

    <Identifier> := <Start> <Continue>* (<Medial> <Continue>+)*

    <Start> := XID_Start + U+005F
    <Continue> := <Start> + XID_Continue
    <Medial> := U+002D

In other words, identifiers may contain but not start or end with `-`. The character `_` is permitted anywhere in an identifier.

### Extensions

Like edn's [tagged elements](https://github.com/edn-format/edn/#tagged-elements), **na** supports extensibility through tagging of values. A tag indicates the semantic interpretation of the following value. Parsers should allow clients to register handlers for specific tags, transforming received values into appropriate data types.

If a parser encounters a tag for which no handler is registered, it may reference a variable/constant symbol of the same name. Alternatively, it should ignore the tag and use its verbatim value, possibly converting it to a more appropriate data type. Resilience is important, parsers must be able to read any valid **na** data without causing errors.

Unlike edn's tagged elements, a tag that is not followed by a value must not cause an error. A handler that is registered for the tag may provide a default value, otherwise a void value should be used.


## Description

Written in [sode](https://github.com/kesh-lang/sode). (This is not an example of a **na** stream.)

```lua
-- this is a line comment

-- primitive values:
booleans:
    yep:  true
    nope: false
numbers:                          -- arbitrary precision by default
    decimal:     42
    suffix:      10KB
    separators:  1_000_000
    float:       3.14
    ratio:       1/3
    exponent:    1e-2
    hex:         0xDECAFBAD
    octal:       0o755
    binary:      0b101010
    radix:       12r36
    infinity:    Infinity
    no-number:   NaN
strings:                          -- UTF-8 by default
    plain: 'abc'                  -- raw string
    fancy: "this string is
            \"multiline\"!"       -- supports multiline and escaping

-- absence of value:
nothing: ()                       -- null/void is represented by an empty immutable collection

-- immutable collections (round brackets):
array:   (1, 2, 3)                -- zero-indexed ordered collection
record:  (foo: 42, bar: true)     -- keyed collection

-- mutable collections (square/curly brackets, semantically equivalent):
array:   [1, 2, 3]                -- type of brackets should match host language's syntax
record:  { foo: 42, bar: true }   -- keys, not curly brackets, make it a record

-- multiline and nested collections:
array:                            -- brackets and commas are optional when multiline
    (1, 'one')                    -- with no outer brackets, items must be indented
    (2, 'two')                    -- inline collections require brackets and commas
    (3, 'three', (3.14, 'pi'))
record:
    foo:                          -- nested records
        bar:
            baz: true
    foo: (bar: (baz: true))       -- inline nested records
    foo.bar.baz: true             -- inline paths are expanded
    'string': true                -- string as key
    42: true                      -- number as key

-- extended value types:
set:    #(1, 2, 2, 3)             -- unique values
map:    #(true: 42, (): true)     -- keys may be of any type

-- tagged values:
typed:  #boolean                  -- typed value that is void
float:  #float64 3.14             -- typed or type cast value (IEEE 754 double-precision float)
date:   #instant '1985-04-12T23:20:50.52Z'
uuid:   #uuid 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
base64: #base64 'aGVsbG8sIHdvcmxkIQ=='
apply:  boolean(1)                -- apply tag handler directly (value must be a collection)
func:   greet(name: 'joe')        -- apply tag handler to named arguments (a record)
ref:    foo                       -- a tag handler may also reference a constant/variable symbol's value
```
