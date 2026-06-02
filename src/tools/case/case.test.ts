import { describe, it, expect } from 'vitest'
import { tokenize, convertCase } from './case'

describe('tokenize', () => {
  it('camelCase', () => {
    expect(tokenize('helloWorld')).toEqual(['hello', 'World'])
  })
  it('snake_case', () => {
    expect(tokenize('hello_world_foo')).toEqual(['hello', 'world', 'foo'])
  })
  it('kebab-case', () => {
    expect(tokenize('hello-world')).toEqual(['hello', 'world'])
  })
  it('PascalCase + 약어', () => {
    expect(tokenize('XMLParser')).toEqual(['XML', 'Parser'])
    expect(tokenize('parseHTMLDoc')).toEqual(['parse', 'HTML', 'Doc'])
  })
  it('공백·점·슬래시', () => {
    expect(tokenize('hello world.foo/bar')).toEqual(['hello', 'world', 'foo', 'bar'])
  })
})

describe('convertCase', () => {
  it('모든 케이스', () => {
    const src = 'hello world foo'
    expect(convertCase(src, 'camelCase')).toBe('helloWorldFoo')
    expect(convertCase(src, 'PascalCase')).toBe('HelloWorldFoo')
    expect(convertCase(src, 'snake_case')).toBe('hello_world_foo')
    expect(convertCase(src, 'SCREAMING_SNAKE_CASE')).toBe('HELLO_WORLD_FOO')
    expect(convertCase(src, 'kebab-case')).toBe('hello-world-foo')
    expect(convertCase(src, 'Train-Case')).toBe('Hello-World-Foo')
    expect(convertCase(src, 'dot.case')).toBe('hello.world.foo')
    expect(convertCase(src, 'lower case')).toBe('hello world foo')
    expect(convertCase(src, 'UPPER CASE')).toBe('HELLO WORLD FOO')
    expect(convertCase(src, 'Sentence case')).toBe('Hello world foo')
  })

  it('cross-style 변환', () => {
    expect(convertCase('XMLParser', 'snake_case')).toBe('xml_parser')
    expect(convertCase('user-name-field', 'camelCase')).toBe('userNameField')
    expect(convertCase('USER_ID', 'kebab-case')).toBe('user-id')
  })

  it('빈 입력', () => {
    expect(convertCase('', 'camelCase')).toBe('')
  })
})
