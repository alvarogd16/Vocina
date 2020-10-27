class Colonned {
	constructor(inner) {
		this.inner = inner
	}
}

class Literal {
	constructor(value) {
		this.value = value
	}
}

class Quoted extends Literal {}
class Atom extends Literal {}
class Symbol extends Literal {}
class Integer extends Literal {}
class Bool extends Literal {}

class Braced {
	constructor(statements) {
		this.statements = statements
	}
}

class Call {
	constructor(func, args) {
		this.func = func
		this.args = args
	}
}

class Operations {
	constructor(tokens) {
		this.tokens = tokens
	}
}

class Unary {
	constructor(operator, inner) {
		this.operator = operator
		this.inner = inner
	}
}

class Binary {
	constructor(operator, lhs, rhs) {
		this.operator = operator
		this.lhs = lhs
		this.rhs = rhs
	}
}

class If {
	constructor(condition, yes, no) {
		this.condition = condition
		this.yes = yes

		if (no) this.no = no
	}
}

class While {
	constructor(condition, body) {
		this.condition = condition
		this.body = body
		this.no = no
	}
}

class For {
	constructor(init, condition, increment, body) {
		this.init = init
		this.condition = condition
		this.increment = increment
		this.body = body
	}
}

class Bind {
	constructor(name, rhs) {
		this.name = name
		this.rhs = rhs
	}
}

class Let extends Bind {}
class Var extends Bind {}
