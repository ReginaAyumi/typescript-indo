// deno-lint-ignore-file no-empty-interface

// -----------------------------------------------------------
// --------------          AST TYPES        ------------------
// ---     Defines the structure of our languages AST      ---
// -----------------------------------------------------------

export type NodeType =
	// STATEMENTS
	| "Program"
	| "VarDeclaration"
	| "FunctionDeclaration"
	| "IfStmt"
	| "ElseStmt"
	| "ElifStmt"
	| "ForLoopStmt"
	// EXPRESSIONS
	| "AssignmentExpr"
	| "MemberExpr"
	| "CallExpr"
	| "AndExpr"
	| "NullExpr"
	| "GreaterThanExpr"
	| "GreaterThanOrEqualsExpr"
	| "LessThanExpr"
	| "LessThanOrEqualsExpr"
	| "EqualsExpr"
	| "NotEqualsExpr"
	| "AndExpr"
	| "OrExpr"
	| "PlusEqualsExpr"
	| "MinusEqualsExpr"
	// Literals
	| "Property"
	| "ObjectLiteral"
	| "NumericLiteral"
	| "Identifier"
	| "BinaryExpr"
	| "StringLiteral";

/**
 * Statements do not result in a value at runtime.
 They contain one or more expressions internally */
export interface Stmt {
	kind: NodeType;
}

/**
 * Defines a block which contains many statements.
 * -  Only one program will be contained in a file.
 */
export interface ForLoopStmt extends Stmt {
	kind: "ForLoopStmt";
	initialization: Stmt;
	condition: Expr;
	increment: Stmt;
	body: Stmt[];
  }
  
export interface Program extends Stmt {
	kind: "Program";
	body: Stmt[];
}

export interface VarDeclaration extends Stmt {
	kind: "VarDeclaration";
	constant: boolean;
	identifier: string;
	value?: Expr;
}

export interface FunctionDeclaration extends Stmt {
	kind: "FunctionDeclaration";
	parameters: string[];
	name: string;
	body: Stmt[];
}

/**  Expressions will result in a value at runtime unlike Statements */
export interface Expr extends Stmt {}

export interface AssignmentExpr extends Expr {
	kind: "AssignmentExpr";
	assigne: Expr;
	value: Expr;
}

/**
 * A operation with two sides seperated by a operator.
 * Both sides can be ANY Complex Expression.
 * - Supported Operators -> + | - | / | * | %
 */
export interface BinaryExpr extends Expr {
	kind: "BinaryExpr";
	left: Expr;
	right: Expr;
	operator: string; // needs to be of type BinaryOperator
}

export interface NullExpr extends Expr {
	kind: "NullExpr";
}

export interface GreaterThanExpr extends Expr {
	kind: "GreaterThanExpr";
	left: Expr;
	right: Expr;
	operator: ">";
}
export interface LessThanExpr extends Expr {
	kind: "LessThanExpr";
	left: Expr;
	right: Expr;
	operator: "<";
}

export interface GreaterThanOrEqualsExpr extends Expr {
	kind: "GreaterThanOrEqualsExpr";
	left: Expr;
	right: Expr;
	operator: ">=";
}

export interface LessThanOrEqualsExpr extends Expr {
	kind: "LessThanOrEqualsExpr";
	left: Expr;
	right: Expr;
	operation: "<=";
}

export interface EqualsExpr extends Expr {
	kind: "EqualsExpr";
	left: Expr;
	right: Expr;
	operator: "==";
}

export interface NotEqualsExpr extends Expr {
	kind: "NotEqualsExpr";
	left: Expr;
	right: Expr;
	operator: "!=";
}

export interface AndExpr extends Expr {
	kind: "AndExpr";
	left: Expr;
	right: Expr;
	operator: "&&";
}

export interface OrExpr extends Expr {
	kind: "OrExpr";
	left: Expr;
	right: Expr;
	operator: "||";
}

export interface PlusEqualsExpr extends Expr {
	kind: "PlusEqualsExpr";
	left: Expr;
	right: Expr;
	operator: "+=";
}

export interface MinusEqualsExpr extends Expr {
	kind: "MinusEqualsExpr";
	left: Expr;
	right: Expr;
	operator: "-=";
}

export interface CallExpr extends Expr {
	kind: "CallExpr";
	args: Expr[];
	caller: Expr;
}

export interface IfStmt extends Stmt {
	kind: "IfStmt";
	condition: Expr;
	thenBranch: Stmt[];
	elifBranch: ElifStmt[] | undefined;
	elseBranch: ElseStmt[] | undefined;
}

export interface ElifStmt extends Stmt {
	kind: "ElifStmt";
	condition: Expr;
	body: Stmt[];
	elseBranch: ElseStmt[] | undefined;
}

export interface ElseStmt extends Stmt {
	kind: "ElseStmt";
	body: Stmt[];
}

export interface MemberExpr extends Expr {
	kind: "MemberExpr";
	object: Expr;
	property: Expr;
	computed: boolean;
}

// LITERAL / PRIMARY EXPRESSION TYPES
/**
 * Represents a user-defined variable or symbol in source.
 */
export interface Identifier extends Expr {
	kind: "Identifier";
	symbol: string;
}

/**
 * Represents a numeric constant inside the soure code.
 */
export interface NumericLiteral extends Expr {
	kind: "NumericLiteral";
	value: number;
}

export interface Property extends Expr {
	kind: "Property";
	key: string;
	value?: Expr;
}

export interface ObjectLiteral extends Expr {
	kind: "ObjectLiteral";
	properties: Property[];
}

export interface StringLiteral extends Expr {
	kind: "StringLiteral";
	value: string;
}
