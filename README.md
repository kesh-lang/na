# na

<!--
<p>&nbsp;</p>
<p align="center" width="100%"><img height="381px" alt="A Kesh map of the watershed of Sinshan Creek" src="https://i.imgur.com/JsIGehK.png"></p>
<p>&nbsp;</p>
-->

> **kesh** data notation format for the conveyance of values

## Definition

Inspired by [ren](https://pointillistic.com/ren/) and [edn](https://github.com/edn-format/edn/), **na** is a simple yet resilient data notation for the conveyance of values.

It serves as a subset for the [sode data format](https://github.com/kesh-lang/sode) and the [kesh programming language](https://github.com/kesh-lang/kesh).

**na**'s value types are intended to represent a minimal set of data types common to most programming languages. A parser should attempt to map the values to data types with similar semantics in the target language.

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
- may contain, but cannot start or end with, `-` (hyphen-minus)
- cannot start with `$` (dollar sign), it being reserved for internal use

If the target language does not support `kebab-case`, names may be transliterated to a compatible [case style](https://en.wikipedia.org/wiki/Naming_convention_(programming)#Multiple-word_identifiers) that maintains the separation of words within a name.

## Syntax

### Comments

```lua
-- this is a comment
```

### Primitive values

#### Truth

Boolean [truth values](https://en.wikipedia.org/wiki/Truth_value).

```lua
true
false
```

#### Number

Arbitrary precision signed numbers.

##### Base 10

```haskell
42          -- integer
3.14        -- decimal fraction
1/3         -- rational fraction (ratio)
```

```haskell
7e+27       -- exponential
42MB        -- suffix (Unicode category L)
1_771_561   -- digit grouping
```

##### Other bases

```haskell
0b101010    -- base-2 (binary) integer
0o755       -- base-8 (octal) integer
0xdecafbad  -- base-16 (hexadecimal) integer
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
- `\␤` – line continuation
- `\␠` – non-breaking space
- `\-` – non-breaking hyphen
- `\\` – backslash
- `\(…)` – Unicode code point integer (base-10, base-16, base-8 or base-2)


##### Multiline

Multiline texts follow the same rules as Julia's [triple-quoted string literals](https://docs.julialang.org/en/v1/manual/strings/#Triple-Quoted-String-Literals).

```py
'''
this is a "verbatim"
text that's multiline
'''
```

```py
"""
this is \(97)\(110) "escaped" \
text that's multiline
"""
```

### Composite values

#### Block

A versatile data structure able to represent both linear and associative [collections](https://en.wikipedia.org/wiki/Collection_(abstract_data_type)).

Blocks are enclosed by square brackets `[]`. Inline items are separated by comma, multiline items by newline.

Keys are optional and can be either [non-negative integer numbers](#number) or [names](#names).

Linear values are implicitly given 0-indexed integer keys.

```lua
[]                      -- empty
[ 42 ]                  -- unary
[ 1, 2, 3 ]             -- implicit integer keys (array/list/sequence/stack/queue)
[ 1: true, 42: true ]   -- explicit integer keys (sparse array)
[ foo: 42, bar: true ]  -- explicit names (object/record/map/structure/dictionary/hash)
```

Similar to [Lua tables](https://www.lua.org/pil/2.5.html), [JavaScript objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) and [Dart records](https://dart.dev/language/records#record-fields), a block may contain both linear and associative values.

```lua
[ 1, 2, 3, length: 3 ]  -- a mix of implicitly indexed and explicitly named values
[ 1, 2, 3, 0: 42 ]      -- explicit keys are evaluated before implicit keys
```

More specific data structures may be enforced with [types](extended.md#standard-types).

##### Nested

```lua
linear: [
    [1, 2, 3]               -- inline items are separated by comma
    [4, 5, 6]               -- multiline items are separated by newline
    [7, 8, 9]
]
associative: [
    foo: [                  -- multiline block
        bar: [ baz: true ]  -- inline block
    ]
    foo.bar.qux: true       -- path shorthand
]
```

##### Without brackets

Brackets are optional. When omitted, indentation becomes significant.

```lua
tensor:
    [1, 2, 3]
    [4, 5, 6]
    [7, 8, 9]
person:
    name: 'Joe'
    age: 27
```

See also [sode](https://github.com/kesh-lang/sode), a tree structured file format based on **na**.

## Streaming

A **na** stream is an open-ended block of linear and associative values. It may be transmitted as UTF-8 text or in a suitable binary format compatible with **na**, such as [CBOR](https://ubjson.org/).

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
