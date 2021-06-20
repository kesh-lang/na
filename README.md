# na

> **kesh** data notation format – suitable for the conveyance of values

**na** is the kesh word for _river_.

## Preliminary definition

Inspired by Rich Hickey's [edn](https://github.com/edn-format/edn/), **na** is a simple yet extensible data notation for the conveyance of values. It serves as a strict subset for the [sode](https://github.com/kesh-lang/sode) file format and the [kesh](https://github.com/kesh-lang/kesh) programming language.

**na**'s value types are intended to represent a minimal set of data types common to most programming languages. A parser should attempt to map the value types to data types in the target language having similar semantics.

### Value types

#### Primitive values

- **boolean**
- **number**
- **string**

#### Composite values

- **tuple** – a list of either ordered values (usually heterogeneous) or key/value pairs
- **collection** – a collection of either ordered values (usually homogeneous) or key/value pairs

Valid keys are identifiers, strings and numbers.

### Identifiers

**na** meets [UAX31-R1](https://unicode.org/reports/tr31/#R1) of Unicode 13 by adopting a _profile_ adding the optional start character `_` (low line) and the optional medial character `-` (hyphen-minus). In the syntax of UAX31:

    <Identifier> := <Start> <Continue>* (<Medial> <Continue>+)*

    <Start> := XID_Start + U+005F
    <Continue> := <Start> + XID_Continue
    <Medial> := U+002D

In other words, the character `_` is permitted anywhere in an identifier. An identifier may contain but not start or end with `-`. As medial characters, `_` and `-` are interchangeable, and identifiers are case-insensitive: `foo-bar` is equivalent to `FOO_BAR`.

A parser should attempt to represent identifiers as verbatim as possible. If the target language does not support the `-` character in identifiers, it may be replaced with `_`.

## Examples

Written in [sode](https://github.com/kesh-lang/sode). (This is not an example of a **na** stream.)

```lua
-- this is a line comment

-- primitive values:
booleans:
    yep:  true
    nope: false
numbers:                          -- arbitrary precision by default
    integer:    42
    suffix:     1000 ms
    separators: 1_000_000
    float:      3.14
    ratio:      1/3
    exponent:   1e-2
    hex:        0xDECAFBAD
    octal:      0o755
    binary:     0b101010
    radix:      12r36
    infinity:   Infinity
    no-number:  NaN
strings:                          -- utf-8 by default
    plain: 'abc'                  -- raw string
    fancy: "this string is
            \"multiline\"!"       -- supports multiline and escaping

-- tuples:
nothing: ()                       -- an empty tuple represents null/void/undefined
something: (42)                   -- a 1-tuple is equivalent to the value it contains
ordered: ('joe', 27)              -- ordered values
keyed: (name: 'joe', age: 27)     -- key/value pairs

-- collections:
array:  [ 1, 2, 3 ]               -- ordered values
record: [ foo: 42, bar: true ]    -- key/value pairs

-- square and curly brackets are equivalent:
s-array:  [ 1, 2, 3 ]             -- resembles javascript/swift/rust array, python list
c-array:  { 1, 2, 3 }             -- resembles java/c/go array
s-record: [ foo: 42, bar: true ]  -- resembles swift dictionary, elixir keyword list
c-record: { foo: 42, bar: true }  -- resembles javascript object, python dict, go map

-- multiline and nested collections:
nested-arrays:                    -- without brackets, indentation and newline are significant
    ['one']                       -- commas are optional if newline is used to separate items
    ['two', 2]                    -- inline collections do require brackets and commas
    ['three', 3, ['pi', 3.14]]    -- nested inline arrays
nested-records:                   
    foo:                          -- nested multiline records
        bar:
            baz: true
    foo: { bar: { baz: true } }   -- nested inline records
    foo.bar.baz: true             -- path shorthand
    'a string': true              -- string as key
    42: true                      -- integer as key
```
