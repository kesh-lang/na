import {
	UnknownCharacterSyntaxError,
	InvalidRadixCompilerError,
	DigitGroupingCompilerError,
	MissingClosingMarkerCompilerError,
	UnexpectedTokenSyntaxError,
	UnsupportedCharacterSyntaxError,
	InvalidNumberCompilerError,
} from './error'
import { EndToken, OperatorToken, Token } from './token'
export type { Token } from './token'

/**
 * Significant whitespace characters:
 * - tab (indentation)
 * - newline (end of line)
 * - space
 */
export const regexWhitespace = /[\u0009\u000A\u0020]/u

/**
 * Reserved syntax characters.
 *
 * The 32 non-control non-whitespace non-alphanumeric ASCII characters:
 *
 * ```plain
 * _ - , ; : ! ? . ' " ( ) [ ] { } @ * / \ & # % ` ^ + < = > | ~ $
 * ```
 */
export const regexSyntax = /[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]/u

/**
 * Unsupported characters:
 * - control characters
 * - private-use characters
 * - surrogate characters
 * - noncharacters (including BOM/ZWNBSP which is deprecated)
 * - line separator (redundant, possibly confusing)
 * - paragraph separator (not applicable, possibly confusing)
 *
 * Source formatters should remove these (note: not from text literals), or they will cause errors.
 */
export const regexUnsupported =
	/[\p{Control}\p{Private_Use}\p{Surrogate}\p{Noncharacter_Code_Point}\u2028\u2029]/u

/**
 * A word character is any character that is:
 * - not a significant whitespace character ({@link regexWhitespace})
 * - not a reserved syntax character ({@link regexSyntax})
 * - not an unsupported character ({@link regexUnsupported})
 *
 * This includes:
 * - other whitespace characters (notably no-break space)
 * - many format characters (notably soft-hyphen, left-to-right mark and right-to-left mark)
 * - all unassigned characters
 *
 * This makes the specification immutable, all words are forever future-proof and backwards-compatible.
 */
export const regexWord =
	/[^\u0009\u000A\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\p{Control}\p{Private_Use}\p{Surrogate}\p{Noncharacter_Code_Point}\u2028\u2029]/u

export class Lexer {
	/** Source text. */
	private source = ''

	/**
	 * Current position within the source.
	 *
	 * This is always the `end` position of the most recently emitted token.
	 */
	private position = 0

	/** Current indentation depth within the source. */
	private depth = 0

	/** Current character being processed within the source. */
	private character = ''

	/** Output tokens (a FIFO queue). */
	private out: Token[] = []

	/** Operators (and their etymology). */
	public operators: { [index: string]: string } = {
		'[': 'open', // from proto-germanic opanōn (to open)
		']': 'close', // from latin claudere (to lock, to terminate)
		':': 'colon', // from greek kôlon (a clause, a part of something)
		',': 'comma', // from greek kómma (a short clause)
		'.': 'dot', // from proto-germanic *dott (a wisp, a small bunch of something)
		'#': 'hash', // from proto-germanic hakkōną (to hack, to chop)
		'•': 'bullet', // from latin bulla (bubble)
		'+': 'plus', // from latin plus (more)
		'-': 'minus', // from latin minus (less)
		'%': 'percent', // from neo-latin per centum (by the hundred)
	}

	constructor(source?: string) {
		if (source) this.load(source)
	}

	/** Loads a source, resetting the lexer. */
	load(source: string) {
		this.source = source
		this.position = 0
		this.depth = 0
		this.out.length = 0
		return this
	}

	/** Returns the character at the specified position in the source. */
	private get(position: number): string {
		return this.source.charAt(position)
	}

	/** Peeks the next character within the source. */
	private get ahead() {
		return this.get(this.position + 1)
	}

	/** Adds a token to the `out` queue, advancing `this.position` to `token.position.end`. */
	private emit(token: Token) {
		this.out.push(token)
		this.position = token.position.end
	}

	/**
	 * Advances and returns the next token in the source .
	 *
	 * Throws a `SyntaxError` on unsupported characters and invalid tokens.
	 */
	public next() {
		// Return any pending queued token (multiple tokens may be queued at once)
		if (this.out.length > 0) return this.out.shift() as Token

		// Advance, skipping any space characters
		while (this.position < this.source.length) {
			this.character = this.get(this.position)

			if (this.character === '\u0020') {
				// Disallow space at the start of the source
				if (this.position === 0) throw new UnexpectedTokenSyntaxError(this.character, this.position)
				this.position++
			} else {
				break
			}
		}

		// If the end of the source is reached, emit the end-token
		if (this.position >= this.source.length) {
			this.emit(new EndToken(this.source.length))
		}
		// Newline
		else if (this.character === '\u000A') {
			this.newline(this.position)
		}
		// Comment
		else if (this.character === '-' && this.ahead === '-') {
			this.comment(this.position)
		}
		// Text
		else if (this.character === "'" || this.character === '"') {
			if (this.character === this.ahead && this.character === this.get(this.position + 2)) {
				this.multilineText(this.position, this.character)
			} else {
				this.inlineText(this.position, this.character)
			}
		}
		// Number
		else if (isNumeral(this.character)) {
			this.number(this.position)
		}
		// Operator
		else if (regexSyntax.test(this.character)) {
			this.operator(this.position)
		}
		// Tab (not as indentation)
		else if (this.character === '\u0009') {
			throw new UnexpectedTokenSyntaxError(this.character, this.position)
		}
		// Unsupported character
		else if (regexUnsupported.test(this.character)) {
			throw new UnsupportedCharacterSyntaxError(this.character, this.position)
		}
		// Word (any other character is a valid word)
		else {
			this.word(this.position)
		}

		// Return the first queued token (multiple tokens may be queued at once)
		return this.out.shift() as Token
	}

	/** Processes a newline and any change in indentation. */
	private newline(start: number) {
		let depth = 0 // indentation depth of the following line
		let dent = 0 // change in indentation depth (-n | 0 | +n)

		// Disallow space directly after newline
		if (this.ahead === '\u0020') throw new UnexpectedTokenSyntaxError(this.character, this.position)

		// Keep track of indentation while skipping any tab characters
		if (this.ahead === '\u0009') {
			const end = this.match(start + 2, (char) => char === '\u0009')
			depth = end - start - 1
			dent = depth >= this.depth ? depth - this.depth : -(this.depth - depth)

			// Disallow space directly after indentation
			if (this.get(end) === '\u0020')
				throw new UnexpectedTokenSyntaxError(this.character, this.position)
		}
		// Detect outdent when newline is not followed by an indent
		else if (this.depth) {
			dent = -this.depth
		}

		this.emit(new Token('newline', '\u000A', start, start + 1, { depth, dent }))

		if (dent > 0) {
			for (let i = 0; i < dent; i++)
				this.emit(new Token('indent', '\u0009', start + depth + i, start + depth + i + 1))
		} else if (dent < 0) {
			for (let i = 0; i < -dent; i++)
				this.emit(new Token('outdent', '\u0009', start, start + depth + 1))
		}

		this.depth = depth
	}

	/** Processes a number literal. */
	private number(start: number) {
		const meta: Record<string, unknown> = {}

		// Numbers always start with integer numerals
		let end = this.matchInteger(start)
		let character = this.get(end)

		// Decimal
		if (character === '.') {
			meta.type = 'decimal'

			if (!isNumeral(this.get(end + 1)))
				throw new InvalidNumberCompilerError(this.get(end + 1), end + 1)

			end = this.matchInteger(end + 1)
			meta.number = trimInteger(this.source.slice(start, end))

			character = this.get(end)

			// Scientific notation
			if (character === '\\') {
				meta.type = 'scientific'

				const from = end + 1
				const sign = this.get(from)
				if (sign === '+' || sign === '-') end++
				if (!isNumeral(this.get(end + 1)))
					throw new InvalidNumberCompilerError(this.get(end + 1), end + 1)
				end = this.matchInteger(from)

				meta.exponent = trimInteger(this.source.slice(from, end))
			}
		}
		// Ratio
		else if (character === '/') {
			if (!isNumeral(this.get(end + 1)))
				throw new InvalidNumberCompilerError(this.get(end + 1), end + 1)
			meta.type = 'ratio'
			meta.numerator = this.source.slice(start, end)

			const from = end + 1
			end = this.matchInteger(from)

			meta.denominator = trimInteger(this.source.slice(from, end))
		}
		// Radix
		else if (character === '\\') {
			meta.type = 'base'
			meta.radix = this.source.slice(start, end)

			const radix = parseInt(meta.radix as string, 10)
			if (radix < 2 || radix > 36) throw new InvalidRadixCompilerError(radix, start)

			if (!isRadix(radix)(this.get(end + 1)))
				throw new InvalidNumberCompilerError(this.get(end + 1), end + 1)

			const from = end + 1
			end = this.match(from, isRadix(radix))

			meta.number = this.source.slice(from, end)
		}
		// Integer
		else {
			meta.type = 'integer'
			meta.number = trimInteger(this.source.slice(start, end))
		}

		// Suffix
		if (meta.type !== 'base') {
			const from = end
			end = this.match(end, isSuffix)
			if (end > from) meta.suffix = this.source.slice(from, end)
		}

		// Disallow trailing word characters
		character = this.get(end)
		if (regexWord.test(character)) throw new InvalidNumberCompilerError(character, end)

		this.emit(new Token('number', this.source.slice(start, end), start, end, meta))
	}

	/** Processes an inline text literal. */
	private inlineText(start: number, marker: string) {
		const verbatim = marker === "'"
		const meta = { multiline: false, escaped: !verbatim }

		let char = this.ahead
		let end = start + 1
		while (end < this.source.length && char !== marker) {
			if (verbatim && char === '\u000A') throw new MissingClosingMarkerCompilerError(marker, start)
			if (!verbatim && char === '\\' && this.get(end + 1) === marker) end++ // skip escaped marker
			char = this.get(++end)
		}

		if (end === this.source.length) throw new MissingClosingMarkerCompilerError(marker, start)

		this.emit(new Token('text', this.source.slice(start, end + 1), start, end + 1, meta))
	}

	/** Processes a multiline text literal. */
	private multilineText(start: number, marker: string) {
		const meta = { multiline: true, escaped: marker === '"' }

		let end = start + 3
		while (end < this.source.length) {
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

		this.emit(new Token('text', this.source.slice(start, end), start, end, meta))
	}

	/** Processes an operator token. */
	private operator(start: number) {
		const token = this.operators[this.character]
		if (token === undefined) throw new UnknownCharacterSyntaxError(this.character, start)
		const meta = {
			bind: {
				left: !isBoundary(this.get(start - 1)),
				right: !isBoundary(this.get(start + 1)),
			},
		}
		this.emit(new OperatorToken(token, this.character, start, start + 1, meta))
	}

	/** Processes a name literal (possibly a truth literal). */
	private word(start: number) {
		const end = this.match(start + 1, (char) => regexWord.test(char))
		const match = this.source.slice(start, end)
		const type = match === '⊤' || match === '⊥' ? 'truth' : 'name'
		this.emit(new Token(type, match, start, end))
	}

	/** Processes a comment. */
	private comment(start: number) {
		const end = this.match(start + 2, (char) => char !== '\u000A')
		this.emit(new Token('comment', this.source.slice(start, end), start, end))
	}

	/**
	 * Advances as far as the predicate function returns true.
	 *
	 * Returns the position of the last matched character.
	 */
	private match(start: number, predicate: (char: string) => boolean) {
		let end = start
		while (end < this.source.length && predicate(this.get(end))) end++
		return end
	}

	/** Matches a sequence of integer numerals, returning its end position. */
	private matchInteger(start: number) {
		if (this.get(start) === '_') throw new DigitGroupingCompilerError(start)

		const end = this.match(start + 1, (char) => char === '_' || isNumeral(char))

		if (this.get(end - 1) === '_' && !isSuffix(this.get(end)))
			throw new DigitGroupingCompilerError(end - 1)

		return end
	}

	/** Implements the iterable protocol. */
	*[Symbol.iterator]() {
		let token: Token
		while ((token = this.next()) && !token.end) yield token
	}
}
/** Tests whether a character is a valid boundary for a token. */
function isBoundary(char: string) {
	return char === '' || !regexWord.test(char)
}

/** Tests whether a character is a valid base-10 numeral. */
function isNumeral(char: string) {
	return char >= '0' && char <= '9'
}

/** Tests whether a character is a valid suffix character. */
function isSuffix(char: string) {
	return !isNumeral(char) && regexWord.test(char)
}

/** Returns a function testing whether a character is valid base numeral for the radix. */
function isRadix(radix: number) {
	return (char: string) => !Number.isNaN(parseInt(char, radix))
}

/** Trims any trailing _ from a sequence of integer digits. */
function trimInteger(number: string) {
	if (number.at(-1) === '_') return number.slice(0, -1)
	return number
}
