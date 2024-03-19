import { Token } from './token'

// Any valid syntax node, including comments and complex nodes like definitions
export class Node {
	type: string
	token: Token
	constructor(token: Token, type?: string) {
		this.type = type ?? token.type
		this.token = token
	}
}

export class Separator extends Node {}
export class Operator extends Node {}
export class Indent extends Node {}
export class Outdent extends Node {}

// A value node is one that produces a value by itself, excluding comments and definitions
export class Value<T = unknown> extends Node {
	value: T
	constructor(token: Token, value: T, type?: string) {
		super(token, type)
		this.value = value
	}
}

// A block's value is undefined until evaluated
export class Block extends Value {
	nodes: Node[]
	constructor(token: Token, nodes: Node[] = []) {
		super(token, undefined, 'block')
		this.nodes = nodes
	}
}

export class Truth extends Value<boolean> {
	constructor(token: Token, value?: boolean) {
		super(token, value ?? token.match === '⊤' ? true : false, 'truth')
	}
}

export class Numeric extends Value<string> {
		constructor(token: Token, value?: string) {
			super(token, value ?? token.match)
		}
	}

export class Text extends Value<string> {
		constructor(token: Token) {
			super(token, token.match)
		}
	}

export class Name extends Value<string> {
	constructor(token: Token) {
		super(token, token.match)
	}
}

export class Type extends Value<string> {
	operator: Token
	constructor(token: Token, operator: Token) {
		super(token, token.match, 'type')
		this.operator = operator
	}
}

export class Definition extends Value<string> {
	operator: Token
	constructor(token: Token, operator: Token) {
		super(token, token.match, 'definition')
		this.operator = operator
	}
}

export class Comment extends Node {
	value: string
	constructor(token: Token) {
		super(token)
		this.value = token.match.slice(2).trim()
	}
}

// A node that's to be ignored by the parser
export class Ignored extends Node {}
