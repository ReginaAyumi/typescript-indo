// deno-lint-ignore-file
import {
	AssignmentExpr,
	BinaryExpr,
	CallExpr,
	Identifier,
	ObjectLiteral,
	StringLiteral,
	GreaterThanExpr,
	LessThanExpr,
	EqualsExpr,
	NotEqualsExpr,
	AndExpr,
	OrExpr,
	PlusEqualsExpr,
	MinusEqualsExpr,
	GreaterThanOrEqualsExpr,
	LessThanOrEqualsExpr,
} from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import {
	FunctionValue,
	MK_NULL,
	NativeFnValue,
	NumberVal,
	ObjectVal,
	RuntimeVal,
	StringVal,
	NullVal,
	BooleanVal,
} from "../values.ts";

function eval_numeric_binary_expr(
	lhs: NumberVal,
	rhs: NumberVal,
	operator: string
): NumberVal {
	let result: number;
	if (operator == "+") {
		result = lhs.value + rhs.value;
	} else if (operator == "-") {
		result = lhs.value - rhs.value;
	} else if (operator == "*") {
		result = lhs.value * rhs.value;
	} else if (operator == "/") {
		// TODO: Division by zero checks
		result = lhs.value / rhs.value;
	} else {
		result = lhs.value % rhs.value;
	}

	return { value: result, type: "number" };
}

/**
 * Evaulates expressions following the binary operation type.
 */
export function eval_binary_expr(
	binop: BinaryExpr,
	env: Environment
): RuntimeVal {
	const lhs = evaluate(binop.left, env);
	const rhs = evaluate(binop.right, env);

	// Only currently support numeric operations
	if (lhs.type == "number" && rhs.type == "number") {
		return eval_numeric_binary_expr(
			lhs as NumberVal,
			rhs as NumberVal,
			binop.operator
		);
	}

	// One or both are NULL
	return MK_NULL();
}

export function eval_identifier(
	ident: Identifier,
	env: Environment
): RuntimeVal {
	const val = env.lookupVar(ident.symbol);
	return val;
}

export function eval_assignment(
	node: AssignmentExpr,
	env: Environment
): RuntimeVal {
	if (node.assigne.kind !== "Identifier") {
		throw `Invalid LHS inaide assignment expr ${JSON.stringify(node.assigne)}`;
	}

	const varname = (node.assigne as Identifier).symbol;
	return env.assignVar(varname, evaluate(node.value, env));
}

export function eval_object_expr(
	obj: ObjectLiteral,
	env: Environment
): RuntimeVal {
	const object = { type: "object", properties: new Map() } as ObjectVal;
	for (const { key, value } of obj.properties) {
		const runtimeVal =
			value == undefined ? env.lookupVar(key) : evaluate(value, env);

		object.properties.set(key, runtimeVal);
	}

	return object;
}

export function eval_call_expr(expr: CallExpr, env: Environment): RuntimeVal {
	const args = expr.args.map((arg) => evaluate(arg, env));
	const fn = evaluate(expr.caller, env);

	if (fn.type == "native-fn") {
		const result = (fn as NativeFnValue).call(args, env);
		return result;
	}

	if (fn.type == "function") {
		const func = fn as FunctionValue;
		const scope = new Environment(func.declarationEnv);

		// Create the variables for the parameters list
		for (let i = 0; i < func.parameters.length; i++) {
			// TODO Check the bounds here.
			// verify arity of function
			const varname = func.parameters[i];
			scope.declareVar(varname, args[i], false);
		}

		let result: RuntimeVal = MK_NULL();
		// Evaluate the function body line by line
		for (const stmt of func.body) {
			result = evaluate(stmt, scope);
		}

		return result;
	}

	throw "Cannot call value that is not a function: " + JSON.stringify(fn);
}

export function eval_string_literal(
	stringLiteral: StringLiteral,
	env: Environment
  ): RuntimeVal {
	const stringValue = stringLiteral.value;
	return { value: stringValue, type: "string" };
  }

export function eval_greater_than_expr(
	binop: GreaterThanExpr,
	env: Environment
): BooleanVal | NullVal {
	const leftHandSide = evaluate(binop.left, env);
	const rightHandSide = evaluate(binop.right, env);

	if (leftHandSide.type == "number" && rightHandSide.type == "number") {
		const result = leftHandSide.value > rightHandSide.value;
		return { value: result, type: "boolean" } as BooleanVal;
	}
	// One or both are null
	return MK_NULL() as NullVal;
}

export function eval_greater_than_or_equals_expr(
	binop: GreaterThanOrEqualsExpr,
	env: Environment
): BooleanVal | NullVal {
	const leftHandSide = evaluate(binop.left, env);
	const rightHandSide = evaluate(binop.right, env);

	if (leftHandSide.type == "number" && rightHandSide.type == "number") {
		const result = leftHandSide.value >= rightHandSide.value;
		return { value: result, type: "boolean" } as BooleanVal;
	}
	// One or both are null
	return MK_NULL() as NullVal;
}

export function eval_less_than_expr(
	binop: LessThanExpr,
	env: Environment
): BooleanVal | NullVal {
	const leftHandSide = evaluate(binop.left, env);
	const rightHandSide = evaluate(binop.right, env);

	if (leftHandSide.type == "number" && rightHandSide.type == "number") {
		const result = leftHandSide.value < rightHandSide.value;
		return { value: result, type: "boolean" } as BooleanVal;
	}
	// One or both are null
	return MK_NULL() as NullVal;
}

export function eval_less_than_or_equals_expr(
	binop: LessThanOrEqualsExpr,
	env: Environment
): BooleanVal | NullVal {
	const leftHandSide = evaluate(binop.left, env);
	const rightHandSide = evaluate(binop.right, env);

	if (leftHandSide.type == "number" && rightHandSide.type == "number") {
		const result = leftHandSide.value <= rightHandSide.value;
		return { value: result, type: "boolean" } as BooleanVal;
	}
	// One or both are null
	return MK_NULL() as NullVal;
}

export function eval_equal_expr(
	binop: EqualsExpr,
	env: Environment
): BooleanVal | NullVal {
	const leftHandSide = evaluate(binop.left, env);
	const rightHandSide = evaluate(binop.right, env);

	if (leftHandSide.type == "number" && rightHandSide.type == "number") {
		const result = leftHandSide.value == rightHandSide.value;
		return { value: result, type: "boolean" } as BooleanVal;
	}
	// One or both are null
	return MK_NULL() as NullVal;
}

export function eval_not_equal_expr(
	binop: NotEqualsExpr,
	env: Environment
): BooleanVal | NullVal {
	const leftHandSide = evaluate(binop.left, env);
	const rightHandSide = evaluate(binop.right, env);

	if (leftHandSide.type == "number" && rightHandSide.type == "number") {
		const result = leftHandSide.value != rightHandSide.value;
		return { value: result, type: "boolean" } as BooleanVal;
	}
	// One or both are null
	return MK_NULL() as NullVal;
}

export function eval_and_expr(
	binop: AndExpr,
	env: Environment
): BooleanVal | NullVal {
	const leftHandSide = evaluate(binop.left, env);
	const rightHandSide = evaluate(binop.right, env);

	if (leftHandSide.type == "boolean" && rightHandSide.type == "boolean") {
		const result = leftHandSide.value && rightHandSide.value;
		return { value: result, type: "boolean" } as BooleanVal;
	}
	// One or both are null
	return MK_NULL() as NullVal;
}

export function eval_or_expr(
	binop: OrExpr,
	env: Environment
): BooleanVal | NullVal {
	const leftHandSide = evaluate(binop.left, env);
	const rightHandSide = evaluate(binop.right, env);

	if (leftHandSide.type == "boolean" && rightHandSide.type == "boolean") {
		const result = leftHandSide.value || rightHandSide.value;
		return { value: result, type: "boolean" } as BooleanVal;
	}
	// One or both are null
	return MK_NULL() as NullVal;
}

export function eval_plus_equals_expr(
	binop: PlusEqualsExpr,
	env: Environment
): NumberVal | NullVal {
	const leftHandSide = evaluate(binop.left, env);
	const rightHandSide = evaluate(binop.right, env);

	if (leftHandSide.type == "number" && rightHandSide.type == "number") {
		const result = (leftHandSide.value += rightHandSide.value);
		return { value: result, type: "number" } as NumberVal;
	}

	// One or both are null
	return MK_NULL() as NullVal;
}

export function eval_minus_equals_expr(
	binop: MinusEqualsExpr,
	env: Environment
): NumberVal | NullVal {
	const leftHandSide = evaluate(binop.left, env);
	const rightHandSide = evaluate(binop.right, env);

	if (leftHandSide.type == "number" && rightHandSide.type == "number") {
		const result = (leftHandSide.value -= rightHandSide.value);
		return { value: result, type: "number" } as NumberVal;
	}

	// One or both are null
	return MK_NULL() as NullVal;
}