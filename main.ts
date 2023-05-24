// deno-lint-ignore-file
import Parser from "./frontend/parser.ts";
import { createGlobalEnv } from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";

//run("./test.txt");
_ql();

async function run(filename: string) {
	const parser = new Parser();
	const env = createGlobalEnv();

	const input = await Deno.readTextFile(filename);
	const program = parser.produceAST(input);

	const result = evaluate(program, env);
	//console.log(result);
}

function _ql() {
    const parser = new Parser();
	const env = createGlobalEnv();

    console.log("\nBahasa Kustom Kel. 2 v0.0.1");
    console.log("Ketik 'exit' untuk keluar\n");
    // Continue Repl Until User Stops Or Types `exit`
    while (true) {
        const input = prompt("$ ");
        // Check for no user or exit keyword
        if (!input || input.includes("exit")) {
            Deno.exit(1);
        }

        // Clear Screen on clear keyword
        if (input.includes("clear")) {
            console.clear();
            continue;
        }

        // Produce AST From sourc-code
        const program = parser.produceAST(input);


        const result = evaluate(program, env);
        //console.log(result.value);
	}
}
