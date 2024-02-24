import { describe, test, expect } from 'vitest'
import { Lexer } from '../compiler/lexer'

describe('tokens', () => {
  test('matching', () => {
    const source = `[
      ⊤, ⊥, +42, 6.28, 1/3, 'foo', "bar", #baz, a.b: true
    ] -- yay`

    const lexer = new Lexer(source)
    const tokens = [...lexer]

    let i = 0
    expect(tokens[i++]).toMatchObject({ type: 'open', match: '[' })
    expect(tokens[i++]).toMatchObject({ type: 'newline', match: '\n' })
    expect(tokens[i++]).toMatchObject({ type: 'true', match: '⊤' })
    expect(tokens[i++]).toMatchObject({ type: 'false', match: '⊥' })
    expect(tokens[i++]).toMatchObject({ type: 'number', match: '+42' })
    expect(tokens[i++]).toMatchObject({ type: 'number', match: '6.28' })
    expect(tokens[i++]).toMatchObject({ type: 'number', match: '1/3' })
    expect(tokens[i++]).toMatchObject({ type: 'text', match: "'foo'" })
    expect(tokens[i++]).toMatchObject({ type: 'text', match: '"bar"' })
    expect(tokens[i++]).toMatchObject({ type: 'name', match: '#baz' })
    expect(tokens[i++]).toMatchObject({ type: 'name', match: 'a' })
    expect(tokens[i++]).toMatchObject({ type: 'dot', match: '.' })
    expect(tokens[i++]).toMatchObject({ type: 'name', match: 'b' })
    expect(tokens[i++]).toMatchObject({ type: 'colon', match: ':' })
    expect(tokens[i++]).toMatchObject({ type: 'name', match: 'true' })
    expect(tokens[i++]).toMatchObject({ type: 'newline', match: '\n' })
    expect(tokens[i++]).toMatchObject({ type: 'close', match: ']' })
    expect(tokens[i++]).toMatchObject({ type: 'comment', match: '-- yay' })
  })

  test('invalid name', () => {
    const lexer = new Lexer()

    lexer.load('-invalid-name')
    expect(() => lexer.next()).toThrowError('Unexpected character - at 0')

    lexer.load('invalid-name-')
    expect(lexer.next()).toMatchObject({ type: 'name', match: 'invalid-name' })
    expect(() => lexer.next()).toThrowError('Unexpected character - at 12')
  })
})
