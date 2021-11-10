# na ( )

<!--
<p>&nbsp;</p>
<p align="center" width="100%"><img height="381px" alt="A Kesh map of the watershed of Sinshan Creek" src="https://i.imgur.com/JsIGehK.png"></p>
<p>&nbsp;</p>
-->

> **kesh** data notation format – suitable for the conveyance of values

**na** is the kesh word for _river_.

## Definition

Inspired by Rich Hickey's [edn](https://github.com/edn-format/edn/), **na** is a simple yet resilient data notation for the conveyance of values.

It serves as a proper subset for the [sode data format](https://github.com/kesh-lang/sode) and the [kesh programming language](https://github.com/kesh-lang/kesh).

**na**'s value types are intended to represent a minimal set of data types common to most programming languages. A parser should attempt to map the values to data types in the target language having similar semantics.

### Value types

#### Primitive types

- **boolean**
- **number**
- **string**

#### Composite types

- **tuple** – a sequence of ordered values (usually heterogeneous), which may be named
- **collection** – a collection of elements, either ordered values (usually homogeneous) or key/value pairs

Valid keys for collections are names and whole numbers.

#### Unit type

An empty tuple represents `null`/`void`/`none`/`undefined`/`nothing`.

### Names

**na** meets [UAX31-R1](https://unicode.org/reports/tr31/#R1) of Unicode 13 by adopting a _profile_ adding the optional start character `_` (low line) and the optional medial character `-` (hyphen-minus). In the syntax of UAX31:

    <Identifier> := <Start> <Continue>* (<Medial> <Continue>+)*

    <Start> := XID_Start + U+005F
    <Continue> := <Start> + XID_Continue
    <Medial> := U+002D

That is:
- A name may start with, contain and end with `_` (low line)
- A name may contain but not start or end with `-` (hyphen-minus), it may only be used as a hyphen
- A name may not start with `$` (dollar sign)

<!--
Hyphenation:
- `_` and `-` are interchangeable when used to join words
- Names are case-insensitive

For example, `foo-bar` is equivalent to `foo_bar`.
-->

<!-- A parser should represent names as verbatim as possible. -->

If the target language does not support `kebab-case`, names may be transliterated to a compatible [case style](https://en.wikipedia.org/wiki/Naming_convention_(programming)#Multiple-word_identifiers) that maintains the separation of words.

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
27°C        -- suffix
1e-2        -- exponent
0xdecafbad  -- hex
0o755       -- octal
0b101010    -- binary
20r22       -- radix (from 2 to 36)
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
(name: 'joe', age: 27)  -- multiple values indexed by order, named
```

#### Collections

A flexible data structure able to represent either linear or associative [collections](https://en.wikipedia.org/wiki/Collection_(abstract_data_type)).

```lua
[]                          -- an empty collection
[1, 2, 3]                   -- multiple values indexed by order (array/list/sequence/stack/queue)
[foo: 42, bar: true]        -- multiple values keyed by name (object/record/struct/map/dict/hash)
[1: false, 42: true]        -- whole numbers are valid keys (sparse array)
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

##### Bracketless

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
    indentation-based: (false, true)  -- indentation is significant only if no brackets
    statically-typed:  true           -- see extensions.md
    extensible:        true           -- see extensions.md
]
```

<sub>Illustration is [CC BY-NC-ND](https://creativecommons.org/licenses/by-nc-nd/4.0/) Ursula K. Le Guin Literary Trust. From [Ursula Le Guin](https://www.ursulakleguin.com/)'s novel about the Kesh, [Always Coming Home](https://www.ursulakleguin.com/always-coming-home-book).</sub>
