# na

> **kesh** data notation format, suitable for streaming, or simply the conveyance of values

## Preliminary definition

#### Value types

- boolean
- string
- number
- object
- array
- tuple
- void

#### Extension types

- tag

### Described using [kesh object notation](https://github.com/kesh-lang/kon)

```lua
-- primitive values
booleans:
    true:  true
    false: false
strings:                        -- utf-8
    simple:  'abc'              -- raw string
    complex: "this is a
        \"multiline\" string!"  -- supports multiline and escaping
numbers:                        -- IEEE 754 (64-bit double precision)
    decimal:     42
    suffix:      42ms           -- suffix is ignored by the parser
    separators:  1_000_000
    float:       3.141592654
    fractional:  -0.01
    exponent:    1e-2
    hex:         0xDECAFBAD
    octal:       0o755
    binary:      0b101010
    infinity:    +Infinity
    no-number:   -NaN
void: ()                        -- absence of value is represented by an empty tuple

-- composite values
object:  { foo: 42, bar: true }
array:   [1, 2, 3]
tuple:   (42, true)

-- multiline and nested (commas are only required inline)
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

-- tagged values (parser must support the tag, output may vary by environment)
set:    #[1, 2, 2, 3]
map:    #{ ('one', 1), ([1, 2, 3], true) }
date:   #instant '1985-04-12T23:20:50.52Z'
uuid:   #uuid 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
class:  #Foo { foo: 42, bar: true }
call:   #bar(42, true)          -- using a tuple to pass multiple values (enables rpc)
null:   #null                   -- if you must
```

(Note: This [kon](https://github.com/kesh-lang/kon) document is itself an object, it is not an example of a stream.)
