import test from "ava";
import { AllowedCharacter } from "./AllowedCharacter.js";
import { Interpreter } from "./interpreter.js";

let interpreter: Interpreter;

test.beforeEach("", () => {
  interpreter = new Interpreter();
});

test("The memory tape should be initialized as an empty array", t => {
  interpreter.initMemoryTape();

  t.is(interpreter["memoryIndex"], 0);
  t.deepEqual(interpreter["memoryTape"], []);
});

test("`incrementPointer()` increments the memory pointer by one", t => {
  const interpreter = new Interpreter();

  t.is(interpreter["memoryIndex"], 0);
  interpreter.incrementPointer();
  t.is(interpreter["memoryIndex"], 1);
});

test("`decrementPointer()` decrements the memory pointer by one", t => {
  const interpreter = new Interpreter();

  t.is(interpreter["memoryIndex"], 0);
  interpreter.decrementPointer();
  t.is(interpreter["memoryIndex"], -1);
});

test("`incrementValue()` increments the value of the current memory pointer by one", t => {
  const interpreter = new Interpreter();

  t.is(interpreter.currentValue, 0);
  interpreter.incrementValue();
  t.is(interpreter.currentValue, 1);
});

test("`decrementValue()` decrements the value of the current memory pointer by one", t => {
  const interpreter = new Interpreter();

  t.is(interpreter.currentValue, 0);
  interpreter.decrementValue();
  t.is(interpreter.currentValue, -1);
});

test("`jumpToAfterBlockStart()` (`]`) sets the code pointer to the previous `[`'s index if the current value isn't 0", t => {
  const interpreter = new Interpreter();
  interpreter.currentValue = 1;
  interpreter["code"] = "+><<>+[[.[<<<+]]".split("") as AllowedCharacter[];
  interpreter["codeIndex"] = interpreter["code"].length - 1;
  const previousBracketIndex = interpreter["code"].lastIndexOf("[");

  interpreter.jumpToAfterBlockStart();

  t.is(interpreter["codeIndex"], previousBracketIndex);
  t.is(interpreter["code"][interpreter["codeIndex"]], "[");
});

test("`jumpToAfterBlockStart()` (`]`) does not set the code pointer to the previous `[`'s index if the current value is 0", t => {
  const interpreter = new Interpreter();
  interpreter.currentValue = 0;
  interpreter["code"] = "+><<>+[[.[<<<+]<]".split("") as AllowedCharacter[];
  const startIndex = interpreter["code"].length - 1;
  interpreter["codeIndex"] = startIndex;

  interpreter.jumpToAfterBlockStart();

  t.is(interpreter["codeIndex"], startIndex);
});

test("`jumpToAfterBlockEnd()` (`[`) sets the code pointer to the next `]`'s index if the current value is 0", t => {
  const interpreter = new Interpreter();
  interpreter.currentValue = 0;
  interpreter["code"] = "+><<>+[[.[<<<+]<]".split("") as AllowedCharacter[];
  interpreter["codeIndex"] = 0;
  const nextBracketIndex = interpreter["code"].indexOf("]");

  interpreter.jumpToAfterBlockEnd();

  t.is(interpreter["codeIndex"], nextBracketIndex);
  t.is(interpreter["code"][interpreter["codeIndex"]], "]");
});

test("`jumpToAfterBlockEnd()` (`[`) does not set the code pointer to the next `]`'s index if the current value isn´t 0", t => {
  const interpreter = new Interpreter();
  interpreter.currentValue = 1;
  interpreter["code"] = "+><<>+[[.[<<<+]]".split("") as AllowedCharacter[];
  const startIndex = 0;
  interpreter["codeIndex"] = startIndex;

  interpreter.jumpToAfterBlockEnd();

  t.is(interpreter["codeIndex"], startIndex);
});

test("`removeComments()` removes any non-brainfuck character", t => {
  const withComments = ".,asdaskdpk,+-[]><<";
  const withoutComments = ".,,+-[]><<".split("") as AllowedCharacter[];

  t.deepEqual(interpreter.removeComments(withComments), withoutComments);
});

test("`printValue()` adds the `currentValue` as a ascii string to the `result` property", t => {
  const letter = "a";
  interpreter["result"] = "";
  interpreter.currentValue = letter.charCodeAt(0);
  interpreter.printValue();

  t.is(interpreter["result"], letter);
});

test("`interpret()` reads simple code and interprets it", t => {
  const interpreter = new Interpreter();

  interpreter["result"] = "";
  const result = " ";
  const code = Array(result.charCodeAt(0)).fill("+").join("") + ".";

  interpreter.interpret(code);

  t.is(interpreter["result"], result);
});

test.serial("`interpret()` reads advanced code and interprets it", async t => {
  const interpreter = new Interpreter();

  interpreter["result"] = "";
  const result = "Hallo Verden!";
  const code = `
    ++++++++++
    [
      >+++++++>++++++++++>+++>+<<<<-
    ]
    >++. print 'H'
    >---. print 'a'
    +++++++++++. 'l'
    . 'l'
    +++. 'o'
    >++. mellomrom
    <<++++++++++++++. 'V'
    >----------. 'e'
    +++++++++++++. 'r'
    --------------. 'd'
    +. 'e'
    +++++++++. 'n'
    >+. '!'
  `;

  await interpreter.interpret(code);

  t.is(interpreter["result"], result);
});
