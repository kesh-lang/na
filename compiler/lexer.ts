import { EndToken, Token, StartToken } from './token'

export class Lexer {
	/** Source text. */
	private source = ''

	/** Length of the source text. */
	private length = 0

	/** Current position within the source. */
	private pos = 0

	/** Current indentation depth within the source. */
	private depth = 0

	/** The most recently returned token. */
	private current = new StartToken()

	operators: { [index: string]: string } = {
		'.': 'dot',
		':': 'colon',
		'[': 'open',
		']': 'close',
		'⊤': 'true',
		'⊥': 'false',
	}

	constructor(source?: string) {
		if (source) this.load(source)
	}

	/** Load a source text. */
	load(source: string) {
		this.source = source
		this.length = source.length
		this.pos = 0
		this.depth = 0
		this.current = new StartToken()
		return this
	}

	/** Get the character at the specified position in the source. */
	get(pos: number): string {
		return this.source.charAt(pos)
	}

	/**
	 * Peek the next token in the source.
	 *
	 * Returns {@link Token} if one is found.\
	 * Returns {@link EndToken} if the end of the source is reached.
	 *
	 * Throws Error if:
	 * - An unexpected character is encountered
	 * - An opening quotation mark is not matched by a closing quotation mark
	 *
	 * @todo Cache peeked value for reuse by {@link next} and {@link expect}?
	 */
	peek(): Token {
		// Skip whitespace
		this.whitespace()

		// Return end token if the end of the source is reached
		if (this.pos >= this.length) return new EndToken(this.length)

		const char = this.get(this.pos)

		// Newline
		if (char === '\n') return this.newline()

		// Text
		if (char === "'" || char === '"')
			return this.get(this.pos + 1) === char && this.get(this.pos + 2) === char
				? this.multilineText(char)
				: this.inlineText(char)

		// Comment or negative number
		if (char === '-') {
			const next = this.get(this.pos + 1)
			if (next === '-') return this.comment()
			if (isDigit(next)) return this.number(1)
		}

		// Positive number
		if (char === '+' && isDigit(this.get(this.pos + 1))) return this.number(1)

		// Type
		if (char === '#' && isNameStart(this.get(this.pos + 1))) return this.name(1)

		// Unsigned number
		if (isDigit(char)) return this.number()

		// Name
		if (isNameStart(char)) return this.name()

		// Operators
		const operator = this.operators[char]
		if (operator) return new Token(operator, char, this.pos, this.pos + 1)

		// Fallback to Error
		throw Error(`Unexpected character ${char} at ${this.pos}`)
	}

	/** Expect the next token to be of the specified type. */
	expect(type: string) {
		const token = this.peek()
		if (token.type !== type)
			throw Error(`Unexpected token ${token.type} at ${token.position.start}, expected ${type}`)
	}

	/**
	 * Advance to the next token in the source.
	 */
	next(): Token {
		this.current = this.peek()
		this.pos = this.current.position.end
		return this.current
	}

	/** Skip any whitespace characters (space, tab, comma, comment). */
	private whitespace() {
		while (this.pos < this.length) {
			const char = this.get(this.pos)
			if (char === ' ' || char === '\t' || char === ',') this.pos++
			// else if (char === '-' && this.get(this.pos + 1) === '-')
			// 	this.pos = this.pos + 2
			else break
		}
	}

	/** Process newline and any indentation change. */
	private newline() {
		const meta = { dent: 0, depth: 0 }

		// Keep track of indentation while skipping \t characters
		if (this.get(this.pos + 1) === '\t') {
			let end = this.pos + 2
			while (end < this.length && this.get(end) === '\t') end++

			// Calculate depth and dent (-, 0, +)
			meta.depth = end - this.pos - 1
			meta.dent = meta.depth >= this.depth ? meta.depth - this.depth : -(this.depth - meta.depth)
		}
		// Detect outdent when \n is not followed by an indent
		else if (this.depth) {
			meta.dent = -this.depth
		}

		this.depth = meta.depth

		return new Token('newline', '\n', this.pos, this.pos + 1, meta)
	}

	/** Process comment. */
	private comment() {
		const start = this.pos

		let end = this.pos + 2
		while (end < this.length && this.get(end) !== '\n') end++

		return new Token('comment', this.source.slice(start, end), start, end)
	}

	/** Process number literal. */
	private number(skip = 0) {
		const start = this.pos

		// @todo consume characters more precisely, validate and assign subtype
		let end = this.pos + skip + 1
		while (end < this.length && isNumeric(this.get(end))) end++

		if (this.get(end) === '%') end++

		return new Token('number', this.source.slice(start, end), start, end)
	}

	/** Process inline text literal. */
	private inlineText(marker: string) {
		const verbatim = marker === "'"
		const meta = { multiline: false, escaped: !verbatim }
		const start = this.pos

		let end = this.pos + 1
		let char = this.get(end)
		while (end < this.length && char !== marker) {
			if (verbatim && char === '\n') throw Error(`Unterminated text literal at ${start}`)
			if (!verbatim && char === '\\' && this.get(end + 1) === marker) end++ // skip escaped marker
			char = this.get(++end)
		}

		if (end === this.length) throw Error(`Unterminated text literal at ${start}`)

		return new Token('text', this.source.slice(start, end + 1), start, end + 1, meta)
	}

	/** Process multiline text literal. */
	private multilineText(marker: string) {
		const meta = { multiline: true, escaped: marker === '"' }
		const start = this.pos

		let end = this.pos + 1
		while (end < this.length) {
			if (
				this.get(end) === marker &&
				this.get(end + 1) === marker &&
				this.get(end + 2) === marker
			) {
				end = end + 3
				break
			}

			end++
		}

		return new Token('text', this.source.slice(start, end), start, end, meta)
	}

	/** Process name literal. */
	private name(skip = 0): Token {
		const start = this.pos

		let end = this.pos + skip + 1
		while (end < this.length && isNameMedial(this.get(end))) end++

		// Backtrack to remove any trailing '-' characters matched by isNameMedial
		while (this.get(end - 1) === '-') end--

		return new Token('name', this.source.slice(start, end), start, end)
	}

	/** Implements the iterable protocol. */
	*[Symbol.iterator]() {
		while (this.next().end === false) yield this.current
	}
}

function isDigit(char: string) {
	return char >= '0' && char <= '9'
}

function isNumeric(char: string) {
	return (
		(char >= '0' && char <= '9') || // digit
		char === '.' || // decimal point
		char === '/' || // ratio
		char === '_' || // separator
		char === '+' || // positive sign
		char === '-' || // negative sign
		(char >= 'a' && char <= 'z') || // radix 10-36, e notation, suffix
		(char >= 'A' && char <= 'Z') || // radix 10-36, e notation, suffix
		char === '\\' // base
	)
}

function isNameStart(char: string) {
	return char === '_' || /\p{XID_Start}/u.test(char)
}

function isNameMedial(char: string) {
	return char === '-' || isNameContinue(char)
}

function isNameContinue(char: string) {
	return /\p{XID_Continue}/u.test(char)
}
