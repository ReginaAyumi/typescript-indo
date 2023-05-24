import {
	FunctionDeclaration,
	Program,
	VarDeclaration,
	IfStmt,
	ElifStmt,
	ElseStmt,
	ForLoopStmt,
} from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { FunctionValue, MK_NULL, RuntimeVal } from "../values.ts";

export function eval_program(program: Program, env: Environment): RuntimeVal {
	let lastEvaluated: RuntimeVal = MK_NULL();
	for (const statement of program.body) {
	  switch (statement.kind) {
			case "ForLoopStmt":
			lastEvaluated = eval_for_loop(statement, env);
			break;
			default:
			lastEvaluated = evaluate(statement, env);
		  break;
		}
	}
	return lastEvaluated;
}

export function eval_var_declaration(
	declaration: VarDeclaration,
	env: Environment
): RuntimeVal {
	const value = declaration.value
		? evaluate(declaration.value, env)
		: MK_NULL();

	return env.declareVar(declaration.identifier, value, declaration.constant);
}

export function eval_function_declaration(
	declaration: FunctionDeclaration,
	env: Environment
): RuntimeVal {
	// Create new function scope
	const fn = {
		type: "function",
		name: declaration.name,
		parameters: declaration.parameters,
		declarationEnv: env,
		body: declaration.body,
	} as FunctionValue;

	return env.declareVar(declaration.name, fn, true);
}

export function eval_if_stmt(stmt: IfStmt, env: Environment): RuntimeVal {
	const condition = evaluate(stmt.condition, env);
	if (condition.value) {
		for (const statement of stmt.thenBranch) {
			evaluate(statement, env);
		}
	} else if (stmt.elifBranch) {
		for (const elif of stmt.elifBranch) {
			eval_elif_stmt(elif, env);
		}
	} else {
		if (stmt.elseBranch) {
			for (const statement of stmt.elseBranch) {
				eval_else_stmt(statement, env);
			}
		}
	}
	return MK_NULL();
}

export function eval_elif_stmt(stmt: ElifStmt, env: Environment): RuntimeVal {
	const condition = evaluate(stmt.condition, env);
	if (condition.value) {
		for (const statement of stmt.body) {
			evaluate(statement, env);
		}
	} else {
		if (stmt.elseBranch) {
			for (const statement of stmt.elseBranch) {
				eval_else_stmt(statement, env);
			}
		}
	}
	return MK_NULL();
}

export function eval_else_stmt(stmt: ElseStmt, env: Environment): RuntimeVal {
	for (const statement of stmt.body) {
		evaluate(statement, env);
	}
	return MK_NULL();
}

export function eval_for_loop(stmt: ForLoopStmt, env: Environment): RuntimeVal {
	// Execute initialization statement
	evaluate(stmt.initialization, env);
  
	while (evaluate(stmt.condition, env).value) {
	  // Execute body statements
	  for (const bodyStatement of stmt.body) {
		evaluate(bodyStatement, env);
	  }
  
	  // Execute increment statement
	  evaluate(stmt.increment, env);
	}
  
	return MK_NULL();
}

  
