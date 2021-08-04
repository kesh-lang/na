# na ( )

> **kesh** data notation format – suitable for the conveyance of values

**na** is the kesh word for _river_.

## Definition

Inspired by Rich Hickey's [edn](https://github.com/edn-format/edn/), **na** is a simple yet resilient data notation for the conveyance of values. It serves as a strict subset for the [sode](https://github.com/kesh-lang/sode) file format and the [kesh](https://github.com/kesh-lang/kesh) programming language.

**na**'s value types are intended to represent a minimal set of data types common to most programming languages. A parser should attempt to map the values to data types in the target language having similar semantics.

### Value types

#### Primitive types

- **boolean**
- **number**
- **string**

#### Composite types

- **tuple** – a sequence of ordered values (usually heterogeneous), optionally labeled with keys
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
- `_` and `-` are interchangeable when used as hyphenation characters
- Identifiers are case-insensitive

For example, `foo-bar` is equivalent to `FOO_BAR`.

A parser should represent identifiers as verbatim as possible. If the target language does not support the `-` character in identifiers, it may be replaced with `_`.

## Syntax

### Comments

```lua
-- this is a line comment
```

### Primitive values

#### Booleans

```lua
true
false
```

#### Numbers

Arbitrary precision by default.

```lua
42          -- integer
3.14        -- float
1/3         -- fraction
-1          -- negative
1_000_000   -- separators
1000ms      -- suffix
1e-2        -- exponent
0xdecafbad  -- hex
0o755       -- octal
0b101010    -- binary
12r36       -- radix
infinity    -- infinity
nan         -- not a number
```

#### Strings

UTF-8 by default.

##### Inline

```lua
'abc'              -- verbatim string
"escaped\nstring"  -- supports escape sequences
```

##### Multiline

```lua
'''
this is a
multiline string
'''                -- multiline verbatim string

"""
this\nis\na
multiline string
"""                -- multiline string supporting escape sequences
```

### Composite values

#### Tuples

```lua
()                      -- a 0-tuple is the unit type (null/void/undefined)
(42)                    -- a 1-tuple is equivalent to the value it contains
('joe', 27)             -- multiple values indexed by order
(name: 'joe', age: 27)  -- multiple values indexed by order and labeled with keys
```

#### Collections

```lua
[]                          -- an empty collection
[1, 2, 3]                   -- multiple values indexed by order (array/list)
[foo: 42, bar: true]        -- multiple values mapped by key (object/record/dictionary)
['string': true, 42: true]  -- strings and whole numbers are valid keys
```

##### Multiline and nesting

```lua
[
    nested-arrays: [
        ['one']                     -- multiline items are separated by newline
        ['two', 2]                  -- inline items are separated by comma
        ['three', 3, ['pi', 3.14]]  -- nested inline arrays
    ]
    nested-objects: [
        foo: [bar: [baz: true]]     -- inline objects
        foo.bar.qux: true           -- path shorthand
    ]
]
```

##### Minimal syntax

When brackets are omitted within a collection, indentation becomes significant.

```lua
[
    foo:
        bar:
            baz: true
]
```

## Features

```lua
[
    human-readable:    true
    line-oriented:     true
    indentation-based: (false, true)  -- optional for collections
    statically-typed:  true           -- see extensions.md
    extensible:        true           -- see extensions.md
    separators:        ("\n", ',')    -- newline is significant
]
```
