# na ( )

<p>&nbsp;</p>
<p align="center" width="100%"><img height="381px" alt="A Talismanic Map of the Na Valley and the springs of the River and its tributaries" src="https://i.imgur.com/izJ9Gyd.png"></p>
<p>&nbsp;</p>

> **kesh** data notation format – suitable for the conveyance of values

**na** is the [kesh](https://www.ursulakleguin.com/always-coming-home-book) word for _river_.

## Definition

Inspired by Rich Hickey's [edn](https://github.com/edn-format/edn/), **na** is a simple yet resilient data notation for the conveyance of values.

It serves as a strict subset for the [sode data format](https://github.com/kesh-lang/sode) and the [kesh programming language](https://github.com/kesh-lang/kesh).

**na**'s value types are intended to represent a minimal set of data types common to most programming languages. A parser should attempt to map the values to data types in the target language having similar semantics.

### Value types

#### Primitive types

- **boolean**
- **number**
- **string**

#### Composite types

- **tuple** – a finite sequence of ordered values (usually heterogeneous), which may be labeled with keys
- **collection** – a collection of elements, either ordered values (usually homogeneous) or key/value pairs

Valid keys for collections are identifiers, strings and whole numbers. Valid keys for tuples are identifiers only.

#### Unit type

An empty tuple represents `null`/`void`/`none`/`undefined`/`nothing`.

### Identifiers

**na** meets [UAX31-R1](https://unicode.org/reports/tr31/#R1) of Unicode 13 by adopting a _profile_ adding the optional start character `_` (low line) and the optional medial character `-` (hyphen-minus). In the syntax of UAX31:

    <Identifier> := <Start> <Continue>* (<Medial> <Continue>+)*

    <Start> := XID_Start + U+005F
    <Continue> := <Start> + XID_Continue
    <Medial> := U+002D

That is:
- `_` is permitted anywhere in an identifier
- An identifier may contain but not start or end with `-`

Further:
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

A simple sequence of values.

```lua
()                      -- a 0-tuple is the unit type
(42)                    -- a 1-tuple is equivalent to the value it contains
('joe', 27)             -- multiple values indexed by order
(name: 'joe', age: 27)  -- multiple values indexed by order and labeled with keys
```

#### Collections

A flexible data structure able to represent both linear and associative [collections](https://en.wikipedia.org/wiki/Collection_(abstract_data_type)).

```lua
[]                          -- an empty collection
[1, 2, 3]                   -- multiple values indexed by order (array/list/sequence/stack/queue)
[foo: 42, bar: true]        -- multiple values mapped by key (object/record/struct/map/dict/hash)
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
    line-separators:   ("\n", ',')    -- newline is significant
    significant-space: true           -- space is significant
    indentation-based: (false, true)  -- indentation is significant only if no brackets
    statically-typed:  true           -- see extensions.md
    extensible:        true           -- see extensions.md
]
```
