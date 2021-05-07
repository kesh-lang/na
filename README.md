# na

> **kesh** data notation format – suitable for streaming, or simply the conveyance of values

**na** is the kesh word for _river_.

## Preliminary definition

Inspired by Rich Hickey's [edn](https://github.com/edn-format/edn/), **na** is a simple yet extensible data notation for the conveyance of values. It serves as a strict subset for the [sode](https://github.com/kesh-lang/sode) file format and the [kesh](https://github.com/kesh-lang/kesh) programming language.

**na**'s value types are intended to represent a minimal set of data structures common to most programming languages. A parser should attempt to map the value types to programming language types with similar semantics. These should ideally be considered immutable value types, to the extent possible.

### Core value types

1. **boolean**
2. **number** – IEEE 754 64-bit double-precision floating-point
3. **string** – UTF-8
4. **collection** – a collection of either ordered values or key/value pairs, either immutable or mutable

### Extensions

Like edn's [tagged elements](https://github.com/edn-format/edn/#tagged-elements), **na** supports extensibility through tagging of values. A tag indicates the semantic interpretation of the following value. Parsers should allow clients to register handlers for specific tags, transforming received values into appropriate data types.

If a parser encounters a tag for which no handler is registered, it may ignore the tag and use its verbatim value, possibly converting it to a more appropriate data type. Resilience is important, parsers should be able to read any and all **na** data without causing errors.

Unlike edn's tagged elements, a tag that is not followed by a value does not cause an error. A handler that is registered for the tag can provide a default value, otherwise a void value should be used.

### Identifiers

**na** meets [UAX31-R1](https://unicode.org/reports/tr31/#R1) of Unicode 13 by adopting a _profile_ adding the optional start character `_` (low line) and the optional medial character `-` (hyphen-minus). In the syntax of UAX31:

    <Identifier> := <Start> <Continue>* (<Medial> <Continue>+)*

    <Start> := XID_Start + U+005F
    <Continue> := <Start> + XID_Continue
    <Medial> := U+002D

In other words, identifiers may contain but not start or end with `-`. The character `_` is permitted anywhere in an identifier.


## Description

Written in [sode](https://github.com/kesh-lang/sode). (This is not an example of a **na** stream.)

```lua
-- this is a line comment

-- primitive values:
booleans:
    yep:  true
    nope: false
numbers:                          -- IEEE 754 64-bit double-precision floating-point format
    decimal:     42
    suffix:      10KB
    separators:  1_000_000
    float:       3.14
    fractional:  0.01
    exponent:    1e-2
    hex:         0xDECAFBAD
    octal:       0o755
    binary:      0b101010
    radix:       12r36
    infinity:    Infinity
    no-number:   NaN
strings:                          -- UTF-8
    plain: 'abc'                  -- raw string
    fancy: "this string is
            \"multiline\"!"       -- supports multiline and escaping

-- absence of value:
nothing: ()                       -- null/void is represented by an empty immutable collection

-- immutable collections (round brackets):
array:   (1, 2, 3)                -- zero-indexed ordered collection
record:  (foo: 42, bar: true)     -- keyed collection

-- mutable collections (square/curly brackets):
array:   [1, 2, 3]
record:  { foo: 42, bar: true }

-- multiline and nested collections:
array:
    (1, 'one')                    -- inline collections require brackets
    (2, 'two')
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
bignum: #1124000727777607680000   -- signed arbitrary-precision number
set:    #(1, 2, 2, 3)             -- unique values
map:    #(true: 42, (): true)     -- keys can be any value

-- tagged values:
date:   #instant '1985-04-12T23:20:50.52Z'
uuid:   #uuid 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
base64: #base64 'aGVsbG8sIHdvcmxkIQ=='
func:   #greet(name: 'joe')       -- apply a handler function to arguments (a collection of values)

-- typed values:
bool:   #boolean                  -- a typed boolean value that is void
number: #number 42                -- explicitly typed (or type cast) value
uint8:  #uint8 255                -- custom type (requires a handler)
null:   #null                     -- if you must (requires a handler)
```
