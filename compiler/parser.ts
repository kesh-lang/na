import { Lexer } from './lexer'
import { Node, Block, Truth, Numeric, Text, Name, Definition, Comment } from './ast'
import { StartToken, type Token } from './token'

type TokenTypes = {
	[index: string]: {
		process?: (token: Token, parser: Parser) => Node
		/** Whether the parser should ignore the token. */
		ignore?: boolean
	}
}

export class Parser {
	public lexer = new Lexer()

	/** The current token in the stream. */
	private current: Token

	/** The next token in the stream. */
	private next: Token

	constructor() {
		this.current = new StartToken()
		this.next = new StartToken()
	}

	/**
	 * Parse a source text.
	 */
	public parse(source: string) {
		if (source) this.lexer.load(source)
		this.next = this.lexer.next()
		return this.block(new StartToken())
	}

	/**
	 * Advance to the next token in the stream.
	 */
	private advance() {
		this.current = this.next
		this.next = this.lexer.next()
		return this.current
	}

	/** Parse a block token. */
	private block(token: Token, level = 0) {
		const items: Node[] = []

		while (this.advance().end === false) {
			if (this.current.type === 'close') break
			if (this.current.type === 'open') {
				items.push(this.block(this.current, level + 1))
			} else {
				if (this.current.type === 'newline') continue
				items.push(this.item(this.current))
			}
		}

		return new Block(token, items)
	}

	/** Parse a value token. */
	private item(token: Token): Node {
		const type = this.types[token.type]
		if (type?.ignore && this.advance().end === false) return this.item(this.current)
		if (type?.process) return type.process(token, this)
		throw Error(`Unsupported token type ${token.type}`)
	}

	/**
	 * Map of token types and their functions for conversion into AST nodes.
	 *
	 * Set a token type's `ignore` property to `true` to ignore it.
	 */
	public types: TokenTypes = {
		comment: { process: (token) => new Comment(token) },
		true: { process: (token) => new Truth(token) },
		false: { process: (token) => new Truth(token) },
		text: { process: (token) => new Text(token) },
		number: {
			process(token: Token, parser: Parser) {
				if (parser.next.type === 'colon') return new Definition(token, parser.advance())
				return new Numeric(token)
			},
		},
		name: {
			process: (token: Token, parser: Parser) => {
				if (token.match === 'true') return new Truth(token, true)
				if (token.match === 'false') return new Truth(token, false)
				if (parser.next.type === 'colon') return new Definition(token, parser.advance())
				return new Name(token)
			},
		},
	}
}
