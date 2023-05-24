import { NumberVal, RuntimeVal } from "./values.ts";
import {
	AssignmentExpr,
	BinaryExpr,
	CallExpr,
	FunctionDeclaration,
	Identifier,
	NumericLiteral,
	ObjectLiteral,
	Program,
	StringLiteral,
	Stmt,
	IfStmt,
	ElifStmt,
	ElseStmt,
	GreaterThanExpr,
	LessThanExpr,
	EqualsExpr,
	NotEqualsExpr,
	OrExpr,
	AndExpr,
	PlusEqualsExpr,
	MinusEqualsExpr,
	GreaterThanOrEqualsExpr,
	LessThanOrEqualsExpr,
	VarDeclaration,
	ForLoopStmt,
} from "../frontend/ast.ts";
import Environment from "./environment.ts";
import {
	eval_function_declaration,
	eval_program,
	eval_var_declaration,
	eval_if_stmt,
	eval_elif_stmt,
	eval_else_stmt,
	eval_for_loop,
} from "./eval/statements.ts";
import {
	eval_assignment,
	eval_binary_expr,
	eval_call_expr,
	eval_identifier,
	eval_object_expr,
	eval_string_literal,
	eval_equal_expr,
	eval_greater_than_expr,
	eval_greater_than_or_equals_expr,
	eval_less_than_expr,
	eval_less_than_or_equals_expr,
	eval_minus_equals_expr,
	eval_not_equal_expr,
	eval_or_expr,
	eval_and_expr,
	eval_plus_equals_expr,
} from "./eval/expressions.ts";

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
	switch (astNode.kind) {
		case "NumericLiteral":
			return {
				value: (astNode as NumericLiteral).value,
				type: "number",
			} as NumberVal;
		case "Identifier":
			return eval_identifier(astNode as Identifier, env);
		case "ObjectLiteral":
			return eval_object_expr(astNode as ObjectLiteral, env);
		case "StringLiteral": 
			return eval_string_literal(astNode as StringLiteral, env);
		case "CallExpr":
			return eval_call_expr(astNode as CallExpr, env);
		case "AssignmentExpr":
			return eval_assignment(astNode as AssignmentExpr, env);
		case "GreaterThanExpr":
			return eval_greater_than_expr(astNode as GreaterThanExpr, env);

		case "GreaterThanOrEqualsExpr":
			return eval_greater_than_or_equals_expr(
				astNode as GreaterThanOrEqualsExpr,
				env
			);

		case "LessThanExpr":
			return eval_less_than_expr(astNode as LessThanExpr, env);

		case "LessThanOrEqualsExpr":
			return eval_less_than_or_equals_expr(
				astNode as LessThanOrEqualsExpr,
				env
			);

		case "EqualsExpr":
			return eval_equal_expr(astNode as EqualsExpr, env);

		case "NotEqualsExpr":
			return eval_not_equal_expr(astNode as NotEqualsExpr, env);

		case "AndExpr":
			return eval_and_expr(astNode as AndExpr, env);

		case "PlusEqualsExpr":
			return eval_plus_equals_expr(astNode as PlusEqualsExpr, env);

		case "MinusEqualsExpr":
			return eval_minus_equals_expr(astNode as MinusEqualsExpr, env);

		case "OrExpr":
			return eval_or_expr(astNode as OrExpr, env);
		case "BinaryExpr":
			return eval_binary_expr(astNode as BinaryExpr, env);
		case "Program":
			return eval_program(astNode as Program, env);
		// Handle statements
		case "VarDeclaration":
			return eval_var_declaration(astNode as VarDeclaration, env);
		case "FunctionDeclaration":
			return eval_function_declaration(astNode as FunctionDeclaration, env);
		case "IfStmt":
			return eval_if_stmt(astNode as IfStmt, env);

		case "ElifStmt":
			return eval_elif_stmt(astNode as ElifStmt, env);

		case "ElseStmt":
			return eval_else_stmt(astNode as ElseStmt, env);
		case "ForLoopStmt":
			return eval_for_loop(astNode as ForLoopStmt, env);
		// Handle unimplimented ast types as error.
		default:
			console.error(
				"This AST Node has not yet been setup for interpretation.\n",
				astNode
			);
			Deno.exit(0);
	}
}

