class ParseResult {
	ok() {
		return this instanceof ParseOk
	}

	map(f) {
		return this instanceof ParseOk
				? new ParseOk(f(this.value), this.tail)
				: this
	}
}

class ParseOk extends ParseResult {
	constructor(value, tail) {
		super()

		this.value = value
		this.tail = tail
	}
}

class ParseError extends ParseResult {
	constructor(error) {
		super()

		this.error = error
	}
}

function yep() {
	return src => new ParseOk(null, src)
}

function matches(predicate) {
	return src => {
		let [current, ...tail] = src

		return predicate(current)
				? new ParseOk(current, tail)
				: new ParseError()
	}
}

function optional(alternative, combinator) {
	return src => {
		let result = combinator(src)

		return result && result.ok()
				? result
				: new ParseOk(alternative, src)
	}
}

function apply(f, combinator) {
	return src => combinator(src).map(f)
}

function and() {
	return src => {
		var values = []
		var tail = src

		for (let combinator of arguments) {
			let result = combinator(tail)

			if (!result || !result.ok()) return new ParseError()
			values.push(result.value)
			tail = result.tail
		}

		return new ParseOk(values, tail)
	}
}

function or() {
	return src => {
		for (let combinator of arguments) {
			let result = combinator(src)
			if (result && result.ok()) return result
		}

		return new ParseError()
	}
}

function many0(combinator) {
	return src => {
		var values = []
		var tail = src

		for (;;) {
			let result = combinator(tail)

			if (!result || !result.ok()) break
			values.push(result.value)
			tail = result.tail
		}

		return new ParseOk(values, tail)
	}
}

function whole(combinator) {
	return src => {
		let result = combinator(src)

		return result.tail.length == 0
				? result
				: new ParseError()
	}
}

let any = matches(_ => true)
let is = wanted => matches(item => item == wanted)
let isnt = avoided => matches(item => item != avoided)
let are = wanted => hug(and(...[...wanted].map(is)))
let hug = combinator => apply(chars => chars.join(''), combinator)
let left = (combinator, meh) => apply(pair => pair[0], and(combinator, meh))
let right = (meh, combinator) => apply(pair => pair[1], and(meh, combinator))

let many1 = combinator => apply(
	pair => [pair[0], ...pair[1]],
	and(combinator, many0(combinator)),
)

let inside1 = (delimiter, combinator) => apply(
	values => values[1],
	and(delimiter, combinator, delimiter),
)

let inside2 = (l, r, combinator) => apply(
	values => values[1],
	and(l, combinator, r),
)

let separated = (separator, combinator) => apply(
	pair => [pair[0], ...pair[1]],
	and(combinator, many0(right(separator, combinator))),
)

let among = (separator, combinator) => inside1(
	separator,
	separated(separator, combinator),
)

let blank = matches(c => " \t\r\n".includes(c))
let token = combinator => inside1(many0(blank), combinator)

let quoted = c => hug(inside1(
	is(c),

	many0(or(
		isnt(c),
		right(is('\\'), any),
	))
))

let operator = or(
	are('++'),
	are('--'),
	are('=='),
	are('!='),
	are('<='),
	are('>='),
	is('<'),
	is('>'),
	is('!'),
	is('.'),
	is('+'),
	is('-'),
	is('*'),
	is('/'),
	is('%'),
	is('.'),
)

let string = apply(item => new Quoted(item), or(quoted('"'), quoted("'")))
let bool = apply(item => new Bool(item), or(are('true'), are('false')))
let atom = hug(many1(matches(c => /[a-zA-Z0-9]/.test(c || ''))))

let number = apply(
	item => new Integer(item),
	hug(many1(matches(c => /[0-9]/.test(c || '')))),
)

let bind = (f, prefix) => apply(
	values => {
		let name = values[1]
		let rhs = values[3]

		return f(name, rhs)
	},

	and(
		token(are(prefix)),
		token(atom),
		token(is('=')),
		token(expr()),
	),
)

let letBinding = bind((item, rhs) => new Let(item, rhs), 'let')
let varBinding = bind((item, rhs) => new Var(item, rhs), 'var')

let forLoop = apply(
	values => {
		let init = values[1][0]
		let condition = values[1][2]
		let increment = values[1][4]
		let body = values[2]

		return new For(init, condition, increment, body)
	},

	and(
		token(are('for')),

		inside2(
			token(is('(')),
			token(is(')')),

			and(
				token(expr()),
				token(is(';')),
				token(expr()),
				token(is(';')),
				token(expr()),
			),
		),

		token(stmt()),
	),
)

let whileLoop = apply(
	values => {
		let condition = values[1]
		let body = values[2]

		return new While(condition, body)
	},

	and(
		token(are('while')),

		inside2(
			token(is('(')),
			token(is(')')),

			token(expr()),
		),

		token(stmt()),
	),
)

let ifBlock = apply(
	values => {
		let condition = values[1]
		let yes = values[2]
		let no = values[3]

		return new If(condition, yes, no)
	},

	and(
		token(are('if')),

		inside2(
			token(is('(')),
			token(is(')')),

			token(expr()),
		),

		token(stmt()),
		optional(null, right(token(are('else')), token(stmt()))),
	),
)

let primitive = or(
	number,
	bool,
	string,
	atom,
)

let base = or(
	inside2(is('('), is(')'), expr()),
	primitive,
)

let call = apply(
	values => {
		let func = values[0]
		let args = values[1]

		return new Call(func, args)
	},

	and(
		token(base),

		inside2(
			token(is('(')),
			token(is(')')),

			optional([], separated(token(is(',')), token(expr()))),
		),
	),
)

let unaryLvl = apply(
	values => new Unary(values[1], values[0]),
	and(
		token(base),
		token(or(are('++'), are('--'))),
	),
)

let simple = or(
	call,
	unaryLvl,
	base,
)

let memberLvl = apply(
	values => new Binary(values[1], values[0], values[2]),

	and(
		token(simple),
		token(is('.')),
		token(simple),
	),
)

let value = or(
	memberLvl,
	simple,
)

let timesOverLvl = apply(
	values => new Binary(values[1], values[0], values[2]),

	and(
		token(simple),

		or(
			is('*'),
			is('/'),
		),

		token(simple),
	),
)

let factor = or(
	timesOverLvl,
	value,
)

let addSubLvl = apply(
	values => new Binary(values[1], values[0], values[2]),

	and(
		token(factor),

		or(
			is('+'),
			is('-'),
		),

		token(factor),
	),
)

let term = or(
	addSubLvl,
	factor,
)

let comparationLvl = apply(
	values => new Binary(values[1], values[0], values[2]),

	and(
		token(term),

		or(
			is('>'),
			is('<'),
			are('>='),
			are('<='),
			are('=='),
			are('!='),
		),

		token(term),
	),
)

let colonned = apply(
	item => new Colonned(item),
	left(token(expr()), token(is(';')))
)

let braced = apply(
	item => new Braced(item),

	inside2(
		is('{'),
		is('}'),

		many0(token(stmt())),
	),
)

function expr() {
	return src => or(
		letBinding,
		varBinding,
		comparationLvl,
		term,
	)(src)
}

function stmt() {
	return src => or(
		ifBlock,
		whileLoop,
		forLoop,
		braced,
		colonned,
	)(src)
}

let lex = whole(many0(token(stmt())))
