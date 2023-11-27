# na

<!--
<p>&nbsp;</p>
<p align="center" width="100%"><img height="381px" alt="A Kesh map of the watershed of Sinshan Creek" src="https://i.imgur.com/JsIGehK.png"></p>
<p>&nbsp;</p>
-->

> **kesh** data notation format for the conveyance of values

**na** is the kesh word for _river_.

## Definition

Inspired by [ren](https://pointillistic.com/ren/) and [edn](https://github.com/edn-format/edn/), **na** is a simple yet resilient data notation for the conveyance of values.

It serves as a subset for the [sode data format](https://github.com/kesh-lang/sode) and the [kesh programming language](https://github.com/kesh-lang/kesh).

**na**'s value types are intended to represent a minimal set of data types common to most programming languages. A parser should attempt to map the values to data types with similar semantics in the target language.

### Rationale

Notation matters.

The data format should be simple, easy to use, reliable and secure. It should be a solid foundation for a wide range of use cases.

### Data types

- `#none` – the concept of `nothing`/`void`/`null`/`undefined`
- [`#truth`](#truth) – Boolean truth values
- [`#number`](#number) – arbitrary precision numbers
- [`#text`](#text) – a string of UTF-8 characters
- [`#multi`](#multi) – a collection of linear/associative values

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
-- this is a line comment
```

### Primitive values

#### Truth

Boolean [truth values](https://en.wikipedia.org/wiki/Truth_value).

```lua
#true
#false
```

#### Number

Arbitrary precision.

```lua
42          -- integer
3.14        -- decimal
1/3         -- ratio
```

```lua
-1          -- negative
1_000_000   -- separators
27°C        -- suffix
```

```lua
1e-2        -- exponential notation
0xdecafbad  -- hexadecimal
0o755       -- octal
0b101010    -- binary
```

#### Text

UTF-8.

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

- `\"` double quote
- `\\` backslash
- `\(…)` unicode code point integer (decimal, hexadecimal, octal or binary)

##### Block

Text blocks follow the same rules as Julia's [triple-quoted string literals](https://docs.julialang.org/en/v1/manual/strings/#Triple-Quoted-String-Literals).

```py
'''
this is a "verbatim"
text block
'''
```

```py
"""
this is \(0x61)\(0x6e) "escaped"
text block
"""
```

### Composite values

#### Multi

A versatile data structure able to represent both linear and associative [collections](https://en.wikipedia.org/wiki/Collection_(abstract_data_type)).

Multis are enclosed by square brackets `[]`.

Keys can be [non-negative integer numbers](#number), [text](#text) and [names](#names).

It is similar to Lua tables and JavaScript objects in that it can contain both linear and associative values.

```lua
[]                        -- empty
[ 42 ]                    -- unary
[ 1, 2, 3 ]               -- indexed by order (array/list/sequence/stack/queue)
[ foo: 42, bar: #true ]   -- keyed by name (object/record/struct/map/dict/hash)
[ 1: #false, 42: #true ]  -- integer numbers as keys (sparse array)
[ 1, 2, 3, length: 3 ]    -- a mix of ordered and named values (array-like JS object)
```

##### Block and nesting

```lua
[
    linear: [                    -- block items are separated by newline
        [1, 2, 3]                -- inline items are separated by comma
        [4, 5, 6]
        [7, 8, 9]
    ]
    associative: [
        foo: [                   -- block
            bar: [ baz: #true ]  -- inline
        ]
        foo.bar.qux: #true       -- path shorthand
    ]
]
```

##### Without brackets

When brackets are omitted in a nested block, indentation becomes significant.

```lua
[
    tensor:
        [1, 2, 3]
        [4, 5, 6]
        [7, 8, 9]
    person:
        name: 'Joe'
        age: 27
]
```

See also [sode](https://github.com/kesh-lang/sode).

## Features

- Lightweight
- Human-readable
- Line-oriented (newline is significant)
- Indentation-based (indentation is significant if brackets are omitted in a nested block)
- [Extensible](extensions.md)

<!--
<sub>Illustration is [CC BY-NC-ND](https://creativecommons.org/licenses/by-nc-nd/4.0/) Ursula K. Le Guin Literary Trust. From [Ursula Le Guin](https://www.ursulakleguin.com/)'s novel about the Kesh, [Always Coming Home](https://www.ursulakleguin.com/always-coming-home-book).</sub>
-->
