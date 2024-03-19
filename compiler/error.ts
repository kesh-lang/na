// @todo better. Look at what Elm does.

export class UnknownCharacterSyntaxError extends SyntaxError {
	constructor(char: string, position: number) {
		const message = format('Unknown character {char} ({position})', { char, position })
		super(message)
	}
}

export class UnsupportedCharacterSyntaxError extends SyntaxError {
	constructor(char: string, position: number) {
		const message = format('Unsupported character {char} ({position})', { char, position })
		super(message)
	}
}

export class MissingTokenSyntaxError extends SyntaxError {
	constructor(expected: string, position: number) {
		const message = format('Missing {expected} ({position})', { expected, position })
		super(message)
	}
}

export class UnexpectedTokenSyntaxError extends SyntaxError {
	constructor(char: string, position: number) {
		const message = format('Unexpected {char} ({position})', { char, position })
		super(message)
	}
}

export class ExpectedTokenSyntaxError extends SyntaxError {
	constructor(expected: string, received: string, position: number) {
		const message = format('Expected {expected}, got {received} ({position})', {
			expected,
			received,
			position,
		})
		super(message)
	}
}

export class CompilerError extends Error {
	constructor(message: string, variables: FormatArguments) {
		super(format(message, variables))
	}
}

export class MissingClosingMarkerCompilerError extends CompilerError {
	constructor(marker: string, position: number) {
		super('Text is missing a closing {marker} ({position})', { marker, position })
	}
}

export class DigitGroupingCompilerError extends CompilerError {
	constructor(position: number) {
		super('Digit grouping can only be between numerals or before a suffix ({position})', {
			position,
		})
	}
}

export class InvalidNumberCompilerError extends CompilerError {
	constructor(char: string, position: number) {
		super('Invalid number, unexpected {char} ({position})', { char, position })
	}
}

export class InvalidRadixCompilerError extends CompilerError {
	constructor(radix: number, position: number) {
		super('Invalid radix {radix} ({position})', { radix, position })
	}
}

type FormatArguments = Record<string, string | number | bigint | boolean>

/** Formats a string using named arguments. */
function format(text: string, args: FormatArguments) {
	let out = text

	for (const key in args) {
		const arg = args[key]
		const value =
			arg === '\u0020'
				? 'space'
				: arg === '\u0009'
				  ? 'tab'
				  : arg === '\u000A'
					  ? 'end of line'
					  : arg.toString()
		out = out.replace(new RegExp(`\\{${key}\\}`, 'gi'), value)
	}

	return out
}
