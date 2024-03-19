import { Glob } from 'bun'
import { describe, test, expect } from 'vitest'
import { compile } from '../compiler'

const dir = `${import.meta.dir}/data`

async function process(path: string, parts: string[]) {
	const name = parts.shift()
	if (name?.endsWith('.na')) {
		const file = Bun.file(`${dir}/${path}`)
		const contents = await file.text()
		const newline = contents.indexOf('\n')
		const expected = contents.slice(0, newline).replaceAll('\\n', '\n')
		const actual = compile(contents.slice(newline + 1))
		test(name.slice(0, -3), () => expect(actual).toBe(expected))
	} else if (name) {
		describe(name, () => process(path, parts))
	}
}

const glob = new Glob('**/*.na')

for await (const path of glob.scan('./test/data')) {
	process(path, path.split('/'))
}
