import { Parser } from './parser'
import { Block, Truth, Definition, type Node, Comment, Ignored, Value, Separator } from './ast'

export { Parser } from './parser'
export { Lexer, type Token } from './lexer'

export type RenderFunction = (node: Node) => string | undefined

const parser = new Parser()

/**
 * Compiles a na source text, passing the parse tree through a render function.
 *
 * Compiles to normalized na by default.
 *
 * @see also {@link compile.toJSON}
 */
export function compile(source: string, render: RenderFunction = toNormalized) {
	const block = parser.parse(source)
	return render(block)
}

/** Compiles a na source text to JSON. */
compile.toJSON = (source: string) => compile(source, toJSON)

/**
 * Renders a parse tree node and any child nodes as normalized na.
 *
 * Not pretty, buggy (wrong indexes). @todo better
 */
export function toNormalized(node: Node): string | undefined {
	if (node instanceof Block)
		return `[${node.nodes
			.map((child: Node, index: number, nodes: Node[]) => {
				if (child instanceof Ignored) return undefined
				if (child instanceof Separator) return undefined
				if (child instanceof Definition) {
					const next = nodes[index + 1]
					nodes[index + 1] = new Ignored(next.token)
					return `${child.value}: ${toNormalized(next)}`
				}
				return toNormalized(child)
			})
			.filter(Boolean) // truthy
			.join(', ')}]`
	if (node instanceof Truth) return node.value ? '⊤' : '⊥'
	if (node instanceof Value) return node.value
	if (node instanceof Comment) return undefined
	return node.token.match
}

/**
 * Renders a parse tree node and any child nodes as JSON.
 *
 * Not pretty, buggy (wrong indexes). @todo better
 */
export function toJSON(node: Node): string | undefined {
	if (node instanceof Block)
		return `{${node.nodes
			.map((child: Node, index: number, nodes: Node[]) => {
				if (child instanceof Ignored) return undefined
				if (child instanceof Separator) return undefined
				if (child instanceof Definition) {
					const next = nodes[index + 1]
					nodes[index + 1] = new Ignored(next.token)
					return `"${child.value}": ${toJSON(next)}`
				}
				return `"${index}": ${toJSON(child)}`
			})
			.filter(Boolean) // truthy
			.join(', ')}}`
	if (node instanceof Truth) return node.value ? 'true' : 'false'
	if (node instanceof Value) return node.value
	if (node instanceof Comment) return undefined
	return node.token.match
}
