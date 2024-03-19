import { Lexer } from './lexer'
import { StartToken, type Token } from './token'
import {
	Node,
	Block,
	Truth,
	Numeric,
	Text,
	Name,
	Definition,
	Comment,
	Indent,
	Outdent,
	Separator,
	Type,
	Operator,
} from './ast'
import { MissingTokenSyntaxError, UnexpectedTokenSyntaxError } from './error'

type TokenTypes = { [index: string]: ((token: Token) => Node) | null }

export class Parser {
	public lexer = new Lexer()

	private behind: Token = new StartToken()
	private current: Token = new StartToken()
	private ahead: Token = new StartToken()

	private depth = 0

	/**
	 * Parses a source text.
	 */
	public parse(source: string) {
		if (source) this.lexer.load(source.trim())
		this.ahead = this.lexer.next()
		return this.block(new StartToken())
	}

	/**
	 * Advances to the next token in the stream.
	 *
	 * Looks ahead one token and remembers the previous token.
	 */
	private advance() {
		this.behind = this.current
		this.current = this.ahead
		this.ahead = this.lexer.next()
		return this.current
	}

	/** Parses a block token. */
	private block(token: Token, level = 0, inline = false, explicit = false) {
		const items: Node[] = []

		// let explicit = false
		let item = this.advance()
		while (!item.end) {
			if (item.type === 'close') {
				if (!inline && !explicit)
					throw new UnexpectedTokenSyntaxError(token.match, item.position.start)
				break
			}

			if (item.type === 'open') {
				const multiline = this.ahead.type === 'newline'
				items.push(this.block(item, level + 1, true))
			}
			// Newline
			else if (item.type === 'newline') {
				const depth = item.meta?.depth as number
				const dent = item.meta?.dent as number

				// Indent
				if (dent > 0) {
					if (dent > 1) throw Error('Excessive indentation (too much of a good thing)')

					this.depth = depth

					// Process indented items
					const explicit = this.behind.type === 'open'
					items.push(this.block(item, level + 1, false, explicit))
				}
				// Outdent
				else if (dent < 0) {
					this.depth = depth

					// Outdent multiple levels
					if (dent < -1) {
						// @ts-ignore
						item.meta.dent++
						continue
					}

					break // close block
				}
				// No dent (just a newline separating multiline items)
				else {
					items.push(this.item(item))
				}
			}
			// Comma
			else if (item.type === 'comma') {
				if (inline) {
					items.push(this.item(item))
				}
				// In multiline block
				else if (
					!(
						this.ahead.end ||
						(this.ahead.type === 'newline' && (this.ahead.meta?.depth as number) <= this.depth)
					)
				) {
					throw Error('Comma is only allowed at the end of a line in multiline blocks')
				}
			}
			// Other tokens
			else if (!item.end) {
				items.push(this.item(item))
			} else {
				if (level > this.depth) throw new MissingTokenSyntaxError('[', item.position.start)
				break
			}

			item = this.advance()
		}

		return new Block(token, items)
	}

	/** Processes a value token into an AST node. */
	private item(token: Token): Node {
		const process = this.types[token.type]
		if (process === undefined) throw Error(`Unsupported token type ${token.type}`)
		if (process === null && this.advance().end === false) return this.item(this.current)
		if (typeof process === 'function') return process(token)
		throw Error(`Invalid processor function for token type ${token.type}`)
	}

	/**
	 * Maps token types to functions for conversion into AST nodes.
	 *
	 * Set a token type to `null` to ignore tokens of its type.
	 */
	public types: TokenTypes = {
		newline: (token) => new Separator(token),
		comma: (token) => new Separator(token),
		indent: (token) => new Indent(token),
		outdent: (token) => new Outdent(token),
		comment: (token) => new Comment(token),
		truth: (token) => new Truth(token),
		text: (token) => new Text(token),
		plus: (token) => this.processSign(token),
		minus: (token) => this.processSign(token),
		number: (token) => this.processNumber(token),
		name: (token) => this.processName(token),
		hash: (token) => this.processHash(token),
		bullet: (token) => this.processBullet(token),
		percent: (token) => new Operator(token),
	}

	/** Processes a sign token (+ or -). */
	private processSign(token: Token) {
		if (this.ahead.type !== 'number') throw Error(`Expected number after ${token.match} sign`)
		const number = this.advance()
		return new Numeric(number, `${token.match}${number.match}`)
	}

	/** Processes a number token. */
	private processNumber(token: Token) {
		if (this.ahead.type === 'colon') return new Definition(token, this.advance())
		return new Numeric(token)
	}

	/** Processes a name token. */
	private processName(token: Token) {
		if (token.match === 'true') return new Truth(token, true)
		if (token.match === 'false') return new Truth(token, false)
		if (this.ahead.type === 'colon') return new Definition(token, this.advance())
		return new Name(token)
	}

	/** Processes a hash token. */
	private processHash(token: Token) {
		if (this.ahead.type !== 'name') throw Error('Invalid type name')
		return new Type(this.advance(), token)
	}

	/** Processes a bullet token. */
	private processBullet(token: Token) {
		if (!(this.behind.type === 'newline' || this.behind.type === '(top)'))
			throw Error('Bullet point can only be at the start of a multiline item')
		if (this.ahead.type === 'newline' || this.ahead.end)
			throw Error('A bullet list item can not be empty')
		return this.item(this.advance())
	}
}
