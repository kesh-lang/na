# na

> **kesh** data notation format – suitable for streaming, or simply the conveyance of values

**na** is the kesh word for _river_.

## Preliminary definition

Inspired by Rich Hickey's [edn](https://github.com/edn-format/edn/), **na** is an extensible data notation for the conveyance of values.

**na** is used as a strict subset for [kesh object notation](https://github.com/kesh-lang/kon) and the [kesh](https://github.com/kesh-lang/kesh) programming language. Unlike [kesh object notation](https://github.com/kesh-lang/kon), there is no enclosing element at the top level, making it suitable for streaming. Values are separated by newline, alternatively comma and spaces if inlined.

**na**'s value types are intended to represent the basic set of data structures common to most programming languages. A parser should attempt to map the value types to programming language types with similar semantics. These should be considered immutable value types, to the extent possible.

### Value types

- **boolean**
- **number** – IEEE 754 64-bit double-precision floating-point
- **string** – UTF-8
- **object** – a collection of key/value pairs
- **array** – an ordered list of values, often homogeneous
- **tuple** – a finite ordered list of values, often heterogeneous
- **void** – the absence of a value

### Identifiers

**na** meets [UAX31-R1](https://unicode.org/reports/tr31/#R1) of Unicode 13 by adopting a _profile_ adding the optional medial character `-` (hyphen-minus) and optional start characters `_` (low line) and `$` (dollar sign).

    <Identifier> := <Start> <Continue>* (<Medial> <Continue>+)*
    
    <Start> := XID_Start + U+005F and U+0024
    <Continue> := <Start> + XID_Continue
    <Medial> := U+002D

In other words, the characters `_` and `$` are permitted anywhere in an identifier. Identifiers may contain but not start or end with `-`.


### Extensions

Like edn's [tagged elements](https://github.com/edn-format/edn/#tagged-elements), **na** supports extensibility through tagging of values. A tag indicates the semantic interpretation of the following value. Parsers should allow clients to register handlers for specific tags, transforming received values into appropriate data types. If a parser encounters a tag for which no handler is registered, it may ignore the tag and use its verbatim value, possibly converting it to a more appropriate data type. Resilience is important, parsers should be able to read any and all **na** data without causing errors.

Unlike edn's tagged elements, a tag that is not followed by a value does not cause an error. A handler that is registered for the tag can provide a value, otherwise a void value should be used.

## Description

Written in [kesh object notation](https://github.com/kesh-lang/kon). (This is not an example of a stream.)

```lua
-- this is a comment

-- primitive values:
booleans:
    yep:  true
    nope: false
strings:                          -- UTF-8
    plain: 'abc'                  -- raw string
    fancy: "this is a
        \"multiline\" string!"    -- supports multiline and escaping
numbers:                          -- IEEE 754 64-bit double-precision floating-point format
    decimal:     42
    separators:  1_000_000
    float:       3.141592654
    fractional:  0.01
    exponent:    1e-2
    hex:         0xDECAFBAD
    octal:       0o755
    binary:      0b101010
    infinity:    Infinity
    no-number:   NaN
void: ()                          -- absence of value is represented by an empty tuple

-- composite values:
object:  { foo: 42, bar: true }
array:   [1, 2, 3]
tuple:   (42, true)

-- multiline and nested: (commas are only required inline)
objects: {
    foo:                          -- braces not required when nesting objects
        bar:
            baz: 42
            'string key': true    -- key can either be a name or a string
    object-path:
        foo.bar.'string key': 42  -- expands to nested objects
}
arrays: [
    'one'
    'two'
    ['three', 'four']
]
tuples: (
    (1, 'one')
    (2, ('two', true))
    (3, (
        (3, 'three')
        (3.141592654, 'pi')
    ))
)

-- tagged literals:
set:    #[1, 2, 2, 3]
map:    #{ ('one', 1), ([1, 2, 3], true) }
bignum: #1124000727777607680000   -- signed arbitrary-precision number
regexp: #'(?i)[^abc]'             -- leading mode modifier for flags
s-exp:  #(cons 1 2)               -- s-expression (their intepretation and semantics are not defined)

-- tagged values:
date:   #instant '1985-04-12T23:20:50.52Z'
uuid:   #uuid 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
base64: #base64 'aGVsbG8sIHdvcmxkIQ=='
class:  #Foo { foo: 42, bar: true }
call:   #bar(42, true)            -- using a tuple to pass multiple values to handler function
null:   #null                     -- if you must
```

-- static typing:
number: #number 42                -- explicitly typed value (standard value types)
float:  #float 42                 -- custom type (not standard)
bool:   #boolean ()               -- a void boolean value
