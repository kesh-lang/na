# na

> **kesh** data notation format – suitable for streaming, or simply the conveyance of values

**na** is the kesh word for _river_.

## Preliminary definition

Inspired by Rich Hickey's [edn](https://github.com/edn-format/edn/), **na** is an extensible data notation for the conveyance of values.

**na** is used as a strict subset for [kesh object notation](https://github.com/kesh-lang/kon) and the [kesh](https://github.com/kesh-lang/kesh) programming language. Unlike [kesh object notation](https://github.com/kesh-lang/kon), there is no enclosing element at the top level, making it suitable for streaming. Values are separated by newline, alternatively comma and spaces if inlined.

**na**'s value types are intended to represent the basic set of data structures common to most programming languages. A parser should attempt to map the value types to programming language types with similar semantics. These should be considered immutable value types, to the extent possible.

### Core value types

- **boolean**
- **number** – IEEE 754 64-bit double-precision floating-point
- **string** – UTF-8
- **object** – a collection of key/value pairs
- **array** – an ordered list of values, often homogeneous
- **tuple** – an ordered list of values, often heterogeneous and finite
- **void** – the absence of a value

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

Written in [kesh object notation](https://github.com/kesh-lang/kon). (This is not an example of a stream.)

```lua
-- this is a line comment

-- primitive values:
booleans:
    yep:  true
    nope: false
strings:                          -- UTF-8
    plain: 'abc'                  -- raw string, supports only the escaping of ' (\')
    fancy: "this is a
        \"multiline\" string!"    -- supports multiline and escaping
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
void: ()                          -- absence of value is represented by an empty tuple

-- composite values:
object:  { foo: 42, bar: true }
array:   [1, 2, 3]
tuple:   (42, true)

-- multiline and nested: (commas are only required inline)
objects: {
    foo:                          -- braces not required when nesting multiline objects
        bar:
            baz: 10
            'string key': true    -- key can either be an identifier or a string
    foo.bar.the-answer: 42        -- paths are expanded when read
}
arrays: [
    'one'
    'two'
    ['three', 'four']
]
tuples: (
    (1, 'one')
    (2, ('two', 42))
    (3, (
        (3, 'three')
        (3.14, 'pi')
    ))
)

-- extended value types:
set:    #[1, 2, 2, 3]
map:    #{ ('one', 1), ([1, 2, 3], true) }
bignum: #1124000727777607680000   -- signed arbitrary-precision number
s-expr: #(a, (b, c))              -- s-expression with application-defined semantics

-- tagged values:
date:   #instant '1985-04-12T23:20:50.52Z'
uuid:   #uuid 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
base64: #base64 'aGVsbG8sIHdvcmxkIQ=='
class:  #Foo { foo: 42, bar: true }
call:   #bar(42, true)            -- applying a handler function to a tuple of values (arguments)

-- typed values:
bool:   #boolean                  -- typed value that is void
number: #number 42                -- explicitly typed (or type cast) value
uint8:  #uint8 255                -- custom type (requires a handler)
null:   #null                     -- if you must (requires a handler)
```
