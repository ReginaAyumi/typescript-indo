
// Represents tokens that our language understands in parsing.
export enum TokenType {
	// Literal Types
	Number,
	Identifier,
	String,
	// Keywords
	Let,
	Const,
	Fn,
	If,
	Else,
	Elif,
	For,

	// Grouping * Operators
	BinaryOperator,
	Equals,
	Comma,
	Dot,
	Colon,
	Semicolon,
	GT,
	GTE,
	LT,
	LTE,
	NOT,
	AND,
	OR,
	NULL,
	EQUALTO,
	PLUSEQUAL,
	MINUSEQUAL,
	OpenParen, // (
	CloseParen, // )
	OpenBrace, // {
	CloseBrace, // }
	OpenBracket, // [
	CloseBracket, //]
	EOF, // Signified the end of file
}

/**
 * Constant lookup for keywords and known identifiers + symbols.
 */
const KEYWORDS: Record<string, TokenType> = {
	tetapkan: TokenType.Let,
	konstan: TokenType.Const,
	fungsi: TokenType.Fn,
	jika: TokenType.If,
	lainnya: TokenType.Else,
	lainnyajika: TokenType.Elif,
	untuk: TokenType.For
};

// Reoresents a single token from the source-code.
export interface Token {
	value: string; // contains the raw value as seen inside the source code.
	type: TokenType; // tagged structure.
}

// Returns a token of a given type and value
function token(value = "", type: TokenType): Token {
	return { value, type };
}

/**
 * Returns whether the character passed in alphabetic -> [a-zA-Z]
 */
function isalpha(src: string) {
	return src.toUpperCase() != src.toLowerCase();
}

/**
 * Returns true if the character is whitespace like -> [\s, \t, \n]
 */
function isskippable(str: string) {
	return str == " " || str == "\n" || str == "\t" || str == "\r";
}

/**
 Return whether the character is a valid integer -> [0-9]
 */
function isint(str: string) {
	const c = str.charCodeAt(0);
	const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
	return c >= bounds[0] && c <= bounds[1];
}

/**
 * Given a string representing source code: Produce tokens and handles
 * possible unidentified characters.
 *
 * - Returns a array of tokens.
 * - Does not modify the incoming string.
 */
export function tokenize(sourceCode: string): Token[] {
	const tokens = new Array<Token>();
	const src = sourceCode.split("");

	// produce tokens until the EOF is reached.
	while (src.length > 0) {
		// BEGIN PARSING ONE CHARACTER TOKENS
		if (src[0] == "(") {
			tokens.push(token(src.shift(), TokenType.OpenParen));
		} else if (src[0] == ")") {
			tokens.push(token(src.shift(), TokenType.CloseParen));
		} else if (src[0] == "{") {
			tokens.push(token(src.shift(), TokenType.OpenBrace));
		} else if (src[0] == "}") {
			tokens.push(token(src.shift(), TokenType.CloseBrace));
		} else if (src[0] == "[") {
			tokens.push(token(src.shift(), TokenType.OpenBracket));
		} else if (src[0] == "]") {
			tokens.push(token(src.shift(), TokenType.CloseBracket));
		} // HANDLE BINARY OPERATORS
		else if (
			src[0] == "+" ||
			src[0] == "-" ||
			src[0] == "*" ||
			src[0] == "/" ||
			src[0] == "%" 
		) {
			tokens.push(token(src.shift(), TokenType.BinaryOperator));
		} // Handle Conditional & Assignment Tokens
		else if (src[0] == ";") {
			tokens.push(token(src.shift(), TokenType.Semicolon));
		} else if (src[0] == ":") {
			tokens.push(token(src.shift(), TokenType.Colon));
		} else if (src[0] == ",") {
			tokens.push(token(src.shift(), TokenType.Comma));
		} else if (src[0] == ".") {
			tokens.push(token(src.shift(), TokenType.Dot));
		} // HANDLE MULTICHARACTER KEYWORDS, TOKENS, IDENTIFIERS ETC...
		else {
			// Handle numeric literals -> Integers
			if (isint(src[0])) {
				let num = "";
				while (src.length > 0 && isint(src[0])) {
					num += src.shift();
				}

				// append new numeric token.
				tokens.push(token(num, TokenType.Number));
			} // HANDLE "FOR" KEYWORD
			else if (src[0] == "u" && src[1] == "n" && src[2] == "t" && src[3] == "u" && src[4] == "k") {
			  tokens.push(token(src.shift(), TokenType.Identifier));
			  tokens[tokens.length - 1].value += src.shift();
			  tokens[tokens.length - 1].value += src.shift();
			  tokens[tokens.length - 1].value += src.shift();
			  tokens[tokens.length - 1].value += src.shift();
			  tokens[tokens.length - 1].type = TokenType.For;
			} // Handle Identifier & Keyword Tokens.
			else if (isalpha(src[0])) {
				let ident = "";
				while (src.length > 0 && isalpha(src[0])) {
					ident += src.shift();
				}

				// CHECK FOR RESERVED KEYWORDS
				const reserved = KEYWORDS[ident];
				// If value is not undefined then the identifier is
				// reconized keyword
				if (typeof reserved == "number") {
					tokens.push(token(ident, reserved));
				} else {
					// Unreconized name must mean user defined symbol.
					tokens.push(token(ident, TokenType.Identifier));
				}
			} else if (src[0] == '"') { // Handle string literals
				let str = "";
				src.shift();
				while (src.length > 0 && src[0] != '"') {
				  str += src.shift();
				}
				if (src[0] == '"') {
				  src.shift();
				} else {
					throw new Error('Unterminated string literal');
				}
				tokens.push(token(str, TokenType.String));
			} else if (src[0] == "<") {
				if (src[1] == "=") {
					tokens.push(token(src.shift(), TokenType.LTE));
					tokens[tokens.length - 1].value += src.shift();
				} else {
					tokens.push(token(src.shift(), TokenType.LT));
				}
			} else if (src[0] == ">") {
				if (src[1] == "=") {
					tokens.push(token(src.shift(), TokenType.GTE));
					tokens[tokens.length - 1].value += src.shift();
				} else {
					tokens.push(token(src.shift(), TokenType.GT));
				}
			} else if (src[0] == "=") {
				if (src[1] == "=") {
					tokens.push(token(src.shift(), TokenType.EQUALTO));
					tokens[tokens.length - 1].value += src.shift();
				} else {
					tokens.push(token(src.shift(), TokenType.Equals));
				}
			} else if (src[0] == "!" && src[1] == "=") {
				tokens.push(token(src.shift(), TokenType.NOT));
				tokens[tokens.length - 1].value += src.shift();
			} else if (src[0] == "&" && src[1] == "&") {
				tokens.push(token(src.shift(), TokenType.AND));
				tokens[tokens.length - 1].value += src.shift();
			} else if (src[0] == "|") {
				if (src[1] == "|") {
					tokens.push(token(src.shift(), TokenType.OR));
					tokens[tokens.length - 1].value += src.shift();
				}
			} else if (src[0] == "+" && src[1] == "=") {
				tokens.push(token(src.shift(), TokenType.PLUSEQUAL));
				tokens[tokens.length - 1].value += src.shift();
			} else if (src[0] == "-" && src[1] == "=") {
				tokens.push(token(src.shift(), TokenType.MINUSEQUAL));
				tokens[tokens.length - 1].value += src.shift();
			} else if (isskippable(src[0])) {
				// Skip uneeded chars.
				src.shift();
			} // Handle unreconized characters.
			// TODO: Impliment better errors and error recovery.
			else {
				console.error(
					"Unreconized character found in source: ",
					src[0].charCodeAt(0),
					src[0]
				);
				Deno.exit(1);
			}
		}
	}

	tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
	return tokens;
}
