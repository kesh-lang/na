# na

> **kesh** data notation format – suitable for streaming, or simply the conveyance of values

**na** is the kesh word for _river_.

## Preliminary definition

Inspired by Rich Hickey's [edn](https://github.com/edn-format/edn/), **na** is an extensible data notation for the conveyance of values.

**na** is used as a subset for [kesh object notation](https://github.com/kesh-lang/kon) and the [kesh](https://github.com/kesh-lang/kesh) programming language. Unlike [kesh object notation](https://github.com/kesh-lang/kon), there is no enclosing element at the top level, making it suitable for streaming.

The value types are intended to represent the basic set of data structures common to most programming languages. A parser should attempt to map the values types to programming language types with similar semantics. These should be considered immutable value types, to the extent possible.

### Value types

- boolean
- number
- string
- object (a collection of name/value pairs)
- array (an ordered collection of values)
- tuple (a finite ordered list of values)
- void (the absence of a value)

### Extensions

Like edn's [tagged elements](https://github.com/edn-format/edn/#tagged-elements), **na** supports extensibility through tagging of values. A tag indicates the semantic interpretation of the following value. Parsers should allow clients to register handlers for specific tags, that expand the received value. If a parser encounters a tag for which no handler is registered, it may ignore the tag and use the value as it is. If possible, it may attach the tag to the value as metadata. Parsers should be able to read any and all **na** data without causing errors.

Unlike edn's tagged elements, a tag that is not followed by a value does not cause an error.

## Description

Written in [kesh object notation](https://github.com/kesh-lang/kon). (This is not an example of a stream.)

```lua
-- this is a comment

-- primitive values:
booleans:
    true:  true
    false: false
strings:                        -- utf-8
    simple:  'abc'              -- raw string
    complex: "this is a
        \"multiline\" string!"  -- supports multiline and escaping
numbers:                        -- IEEE 754 (64-bit double precision)
    decimal:     42
    separators:  1_000_000
    float:       3.141592654
    fractional:  0.01
    exponent:    1e-2
    hex:         0xDECAFBAD
    octal:       0o755
    binary:      0b101010
    infinity:    +Infinity
    no-number:   -NaN
void: ()                        -- absence of value is represented by an empty tuple

-- composite values:
object:  { foo: 42, bar: true }
array:   [1, 2, 3]
tuple:   (42, true)

-- multiline and nested: (commas are only required inline)
objects: {
    foo:                        -- braces not required when nesting objects
        bar:
            baz: 42
            'string key': true  -- key can either be a name or a string
    path-shortcut:
        foo.bar.'string key': 42
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

-- extended value types: (if supported by the parser)
set:    #[1, 2, 2, 3]
map:    #{ ('one', 1), ([1, 2, 3], true) }
bignum: #1124000727777607680000 -- arbitrary-precision number
regexp: #"(?i)[^abc]"           -- leading mode modifier for flags

-- extended values: (parser must support the tag, output may vary by environment)
date:   #instant '1985-04-12T23:20:50.52Z'
uuid:   #uuid 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
class:  #Foo { foo: 42, bar: true }
call:   #bar(42, true)          -- using a tuple to pass multiple values (enables rpc)
null:   #null                   -- if you must
```
