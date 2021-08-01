# na ( )

> **kesh** data notation format – suitable for the conveyance of values

**na** is the kesh word for _river_.

## Preliminary definition

Inspired by Rich Hickey's [edn](https://github.com/edn-format/edn/), **na** is a simple yet resilient data notation for the conveyance of values. It serves as a strict subset for the [sode](https://github.com/kesh-lang/sode) file format and the [kesh](https://github.com/kesh-lang/kesh) programming language.

**na**'s value types are intended to represent a minimal set of data types common to most programming languages. A parser should attempt to map the values to data types in the target language having similar semantics.

### Value types

#### Primitive types

- **boolean**
- **number**
- **string**

#### Composite types

- **tuple** – a sequence of elements, either ordered values (usually heterogeneous) or key/value pairs
- **collection** – a collection of elements, either ordered values (usually homogeneous) or key/value pairs

Valid keys are identifiers, strings and whole numbers.

### Identifiers

**na** meets [UAX31-R1](https://unicode.org/reports/tr31/#R1) of Unicode 13 by adopting a _profile_ adding the optional start character `_` (low line) and the optional medial character `-` (hyphen-minus). In the syntax of UAX31:

    <Identifier> := <Start> <Continue>* (<Medial> <Continue>+)*

    <Start> := XID_Start + U+005F
    <Continue> := <Start> + XID_Continue
    <Medial> := U+002D

- `_` is permitted anywhere in an identifier
- An identifier may contain but not start or end with `-`
- When used as hyphenation characters, `_` and `-` are interchangeable
- Identifiers are case-insensitive

For example, `foo-bar` is equivalent to `FOO_BAR`.

A parser should represent identifiers as verbatim as possible. If the target language does not support the `-` character in identifiers, it may be replaced with `_`.

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
    float:      3.14
    fraction:   1/3
    separators: 1_000_000
    suffix:     1000ms
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
one-thing: (42)                   -- a 1-tuple is equivalent to the value it contains
ordered: ('joe', 27)              -- multiple values indexed by order
keyed: (name: 'joe', age: 27)     -- multiple values mapped by key

-- collections:
empty:  []                        -- an empty collection
array:  [ 1, 2, 3 ]               -- multiple values indexed by order
record: [ foo: 42, bar: true ]    -- multiple values mapped by key

-- multiline and nested collections:
nested-arrays: [
    ['one']                       -- items may be separated by newline (trailing commas are optional)
    ['two', 2]                    -- inline items are separated by commas
    ['three', 3, ['pi', 3.14]]    -- nested inline arrays
]
nested-records:                   -- if brackets are omitted, indentation becomes significant
    foo:                          -- nested multiline records
        bar:
            baz: true
    foo: [ bar: [ baz: true ] ]   -- nested inline records
    foo.bar.baz: true             -- path shorthand
    'a string': true              -- string as key
    42: true                      -- whole number as key
```
