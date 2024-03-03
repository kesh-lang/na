# na

> data notation for the conveyance of values

## Definition

Inspired by [ren](https://pointillistic.com/ren/) and [edn](https://github.com/edn-format/edn/), **na** is a simple yet resilient data notation format.

Its value types are intended to represent a minimal set of common data types.

### Rationale

Notation matters.

The syntax should be simple, ergonomic, flexible, reliable and secure.

It should be a solid foundation for a wide range of use cases.

### Data types

- [`#truth`](#truth) – Boolean truth values
- [`#number`](#number) – arbitrary precision numbers
- [`#text`](#text) – a sequence of Unicode scalar values
- [`#block`](#block) – a sequence of linear/associative values

### Names

**na** meets [UAX31-R1-2](https://unicode.org/reports/tr31/#R1-2) by using a _profile_ of [UAX31-R1-1](https://unicode.org/reports/tr31/#R1-1), adding the optional start character `_` (low line) and the optional medial character `-` (hyphen-minus). In the syntax of [UAX31-D1](https://unicode.org/reports/tr31/#D1):

    <Identifier> := <Start> <Continue>* (<Medial> <Continue>+)*

    <Start> := XID_Start + U+005F
    <Continue> := XID_Continue
    <Medial> := U+002D

That is, a name must conform with [UAX31-R1-1](https://unicode.org/reports/tr31/#R1-1) and:
- may start with, contain and end with `_` (low line)
- may contain but cannot start or end with `-` (hyphen-minus)

Names are case insensitive, meeting [UAX31-R4](https://unicode.org/reports/tr31/#R4) with normalization form KC and [UAX31-R5](https://unicode.org/reports/tr31/#R5) with full case folding. Implementations should ignore default ignorable code points in comparison.

When compiling to a target language that does not support `kebab-case`, names may be transliterated to a compatible [case style](https://en.wikipedia.org/wiki/Naming_convention_(programming)#Multiple-word_identifiers) that maintains the separation of words within a name.

## Syntax

### Comments

```lua
-- this is a comment
```

### Primitive values

#### Truth

Boolean [truth values](https://en.wikipedia.org/wiki/Truth_value), represented with Unicode symbols `⊤` and `⊥`.

For the convenience of end users, implementations should allow the words `true` and `false` as aliases.

#### Number

Arbitrary precision signed numbers.

##### Base 10

```euphoria
42         -- integer
6.28       -- decimal fraction
-1/12      -- rational fraction (ratio)
```

```euphoria
6.022\23   -- scientific/exponential notation
1_771_561  -- digit grouping
007        -- leading zeros
48fps      -- suffix (Unicode General Category L)
99%        -- percentage (ratio to 100)
```

##### Other bases

Bases with radix from 2 to 36 is supported, using 0-9 + A-Z/a-z as numerals.

```euphoria
2\101010   -- binary
8\755      -- octal
16\decaf   -- hexadecimal
```

#### Text

A sequence of zero or more [Unicode scalar values](https://www.unicode.org/glossary/#unicode_scalar_value) in [UTF-8](https://utf8everywhere.org/) encoding.

##### Inline

Single-quoted text is verbatim.

```lua
'"verbatim" text'
```

Double-quoted text supports escape sequences.

```lua
"\"escaped\" text"
```

The following escape sequences are supported:

- `\"` – quotation mark `U+0022`
- `\\` – reverse solidus `U+005C`
- `\t` - horizontal tab `U+0009`
- `\n` - newline `U+000A`
- `\␤` - line continuation
- `\HHHHHH` – Unicode code point (6 hexadecimal numerals)

##### Multiline

Multiline texts follow the same rules as Julia's [triple-quoted string literals](https://docs.julialang.org/en/v1/manual/strings/#Triple-Quoted-String-Literals).

```py
'''
this is a "verbatim" text
that's multiline
'''
```

```py
"""
this is an "escaped" text
that's multiline \01F632
"""
```

### Composite values

#### Block

A versatile data structure able to represent both linear and associative [collections](https://en.wikipedia.org/wiki/Collection_(abstract_data_type)).

Blocks are enclosed by square brackets `[]`. Inline items may be separated by comma.

Keys are optional and can be either [non-negative integer numbers](#number) or [names](#names). Duplicates are not allowed.

Linear values are implicitly given 0-indexed integer keys.

```lua
[]                      -- empty
[ 1, 2, 3 ]             -- implicit integer keys (list/array/sequence/stack/queue)
[ 7: true, 42: true ]   -- explicit integer keys (sparse array)
[ foo: 42, bar: true ]  -- explicit names (record/object/map/structure/dictionary/hash)
```

Similar to [Lua tables](https://www.lua.org/pil/2.5.html), [JavaScript objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) and [Dart records](https://dart.dev/language/records#record-fields), a block may contain both linear and associative values.

```lua
[ 1, 2, 3, length: 3 ]  -- a mix of implicitly indexed and explicitly named values
```

More specific data structures may be enforced with [types](extended.md#standard-types).

##### Nested

```lua
linear: [
    [1, 2, 3]               -- inline items separated by comma for readability
    [4, 5, 6]               -- multiline items separated by newline
    [7, 8, 9]
]
associative: [
    foo: [                  -- multiline block
        bar: [ baz: true ]  -- inline block
    ]
]
```

##### Flexible syntax

Brackets are only required for inline blocks. Indentation is significant if multiline.

Commas are optional and have no semantics. Recommended only between inline values for readability.

Multiline values may be prefixed with the [bullet glyph](https://en.wikipedia.org/wiki/Bullet_(typography)) `•` for readability.

```lua
person:
    name: 'Joey'
    age: 27
    friends:
        • 'Chandler'
        • 'Monica'
        • 'Phoebe'
        • 'Rachel'
        • 'Ross'
```

## Encoding

Either UTF-8 or a compatible binary format, for example [CBOR](https://en.wikipedia.org/wiki/CBOR) or a derivative of [Nota](https://www.crockford.com/nota.html).

## Features

- Lightweight
- Human-friendly
- Line-oriented (newline is significant)
- Indentation-based (indentation is significant if multiline)
- [Extensible](extended.md)

---

**na** is the [kesh](https://www.ursulakleguin.com/kesh-music) word for _river_.
