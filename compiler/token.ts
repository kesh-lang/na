export class Token {
	type: string
	match: string
	position: { start: number; end: number }
	meta?: TokenMeta

	/** Whether it's the end token (end of the source text). */
	end = false

	constructor(type: string, match: string, start: number, end?: number, meta?: TokenMeta) {
		this.type = type
		this.match = match
		this.position = {
			start,
			end: end ?? start + match.length,
		}
		this.meta = meta ?? {}
	}
}

export class OperatorToken extends Token {
	declare meta: {
		bind: {
			left: boolean
			right: boolean
		}
	}
}

export class StartToken extends Token {
	constructor() {
		super('(top)', '', -1, -1)
	}
}

export class EndToken extends Token {
	end = true
	constructor(pos = 0) {
		super('(end)', '', pos, pos)
	}
}

export type TokenMeta = Record<string, unknown>
