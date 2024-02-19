# na

<!--
<p>&nbsp;</p>
<p align="center" width="100%"><img height="381px" alt="A Kesh map of the watershed of Sinshan Creek" src="https://i.imgur.com/JsIGehK.png"></p>
<p>&nbsp;</p>
-->

> **kesh** data notation format for the conveyance of values

## Definition

Inspired by [ren](https://pointillistic.com/ren/) and [edn](https://github.com/edn-format/edn/), **na** is a simple yet resilient data notation for the conveyance of values.

It serves as a subset for the [kesh programming language](https://github.com/kesh-lang/kesh).

**na**'s value types are intended to represent a minimal set of common data types.

### Rationale

Notation matters.

The format should be simple, ergonomic, flexible, reliable and secure.

It should be a solid foundation for a wide range of use cases.

### Data types

- [`#truth`](#truth) – Boolean truth values
- [`#number`](#number) – arbitrary precision numbers
- [`#text`](#text) – a sequence of UTF-8 code points
- [`#block`](#block) – a sequence of linear/associative values

### Names

**na** meets [UAX31-R1](https://unicode.org/reports/tr31/#R1) of Unicode 13 by adopting a _profile_ adding the optional start character `_` (low line) and the optional medial character `-` (hyphen-minus). In the syntax of UAX31:

    <Identifier> := <Start> <Continue>* (<Medial> <Continue>+)*

    <Start> := XID_Start + U+005F
    <Continue> := <Start> + XID_Continue
    <Medial> := U+002D

That is, a name must conform with UAX31-R1 and:
- may start with, contain and end with `_` (low line)
- may contain but cannot start or end with `-` (hyphen-minus)

If the target language does not support `kebab-case`, names may be transliterated to a compatible [case style](https://en.wikipedia.org/wiki/Naming_convention_(programming)#Multiple-word_identifiers) that maintains the separation of words within a name.

## Syntax

### Comments

```lua
-- this is a comment
```

### Primitive values

#### Truth

Boolean [truth values](https://en.wikipedia.org/wiki/Truth_value), represented with Unicode symbols `⊤` and `⊥`.

For convenience, the English words `true` and `false` may also be used.

#### Number

Arbitrary precision signed numbers.

##### Base 10

```euphoria
42         -- integer
3.14       -- decimal fraction
1/3        -- rational fraction (ratio)
```

```euphoria
1.616e-35  -- scientific e notation
1_771_561  -- digit grouping
256px      -- suffix (Unicode category L)
007        -- leading zeros
```

##### Other bases

Any radix from 1 to 36, using 0-9 + A-Z as numerals.

```euphoria
2\101010   -- binary
8\755      -- octal
16\decaf   -- hexadecimal
```

#### Text

[UTF-8](https://utf8everywhere.org/).

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

- `\"` – double-quote
- `\\` – backslash
- `\␠` – non-breaking space
- `\-` – non-breaking hyphen
- `\␤` – line continuation
- `\(…)` – Unicode code point


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
that's multiline \(1F632)
"""
```

### Composite values

#### Block

A versatile data structure able to represent both linear and associative [collections](https://en.wikipedia.org/wiki/Collection_(abstract_data_type)).

Blocks are enclosed by square brackets `[]`. Inline items are separated by comma, multiline items by newline.

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
    [1, 2, 3]               -- inline items are separated by comma
    [4, 5, 6]               -- multiline items are separated by newline
    [7, 8, 9],              -- trailing commas are ignored
]
associative: [
    foo: [                  -- multiline block
        bar: [ baz: true ]  -- inline block
    ]
    foo.bar.qux: true       -- path shorthand
]
```

##### Without brackets

Brackets are optional for multiline blocks. When omitted, indentation becomes significant.

```lua
tensor:
    [1, 2, 3]
    [4, 5, 6]
    [7, 8, 9]
person:
    name: 'Joe'
    age: 27
```

## Encoding

Either UTF-8 or a compatible binary format, for example [CBOR](https://en.wikipedia.org/wiki/CBOR) or a derivative of [Nota](https://www.crockford.com/nota.html).

## Streaming

A **na** stream is an open-ended block of linear and associative values.

## Features

- Lightweight
- Human-friendly
- Line-oriented (newline is significant)
- Indentation-based (indentation is significant if brackets are omitted)
- [Extensible](extended.md)

---

**na** is the [kesh](https://www.ursulakleguin.com/kesh-music) word for _river_.

<!--
<sub>Illustration is [CC BY-NC-ND](https://creativecommons.org/licenses/by-nc-nd/4.0/) Ursula K. Le Guin Literary Trust. From [Ursula Le Guin](https://www.ursulakleguin.com/)'s novel about the Kesh, [Always Coming Home](https://www.ursulakleguin.com/always-coming-home-book).</sub>
-->
