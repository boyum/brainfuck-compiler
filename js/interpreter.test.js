import test from 'ava';
import { Interpreter } from './interpreter';

/** @type { Interpreter } */
let interpreter;

test.beforeEach('', () => {
  interpreter = new Interpreter();
});

test('The memory tape should be initialized as an empty array', t => {
  interpreter.initMemoryTape();

  t.is(interpreter.memoryIndex, 0);
  t.deepEqual(interpreter.memoryTape, []);
});

test.serial('`incrementPointer()` increments the memory pointer by one', t => {
  t.is(interpreter.memoryIndex, 0);
  interpreter.incrementPointer();
  t.is(interpreter.memoryIndex, 1);
});

test.serial('`decrementPointer()` decrements the memory pointer by one', t => {
  t.is(interpreter.memoryIndex, 0);
  interpreter.decrementPointer();
  t.is(interpreter.memoryIndex, -1);
});

test('`incrementValue()` increments the value of the current memory pointer by one', t => {
  t.is(interpreter.currentValue, 0);
  interpreter.incrementValue();
  t.is(interpreter.currentValue, 1);
});

test('`decrementValue()` decrements the value of the current memory pointer by one', t => {
  t.is(interpreter.currentValue, 0);
  interpreter.decrementValue();
  t.is(interpreter.currentValue, -1);
});

test('`jumpToAfterBlockStart()` sets the code pointer to the index after the previous if the current value is 0`[`', t => {
  interpreter.code = '+><<>+[[.[<<<+]]';
  interpreter.codeIndex = interpreter.code.length - 1;
  const previousBracketIndex = interpreter.code.lastIndexOf('[');

  interpreter.jumpToAfterBlockStart();

  t.is(interpreter.codeIndex, previousBracketIndex + 1);
});

test('`jumpToAfterBlockStart()` does not set the code pointer to the index after the previous if the current value isn\'t 0`[`', t => {
  interpreter.incrementValue();
  interpreter.code = '+><<>+[[.[<<<+]]';
  const startIndex = interpreter.code.length - 1;
  interpreter.codeIndex = startIndex;

  interpreter.jumpToAfterBlockStart();

  t.is(interpreter.codeIndex, startIndex);
});

test('`jumpToAfterBlockEnd()` sets the code pointer to the index after the next `]` if the current value isn\'t 0', t => {
  interpreter.incrementValue();
  interpreter.code = '+><<>+[[.[<<<+]]';
  interpreter.codeIndex = 0;
  const nextBracketIndex = interpreter.code.indexOf('[');

  interpreter.jumpToAfterBlockEnd();

  t.is(interpreter.codeIndex, nextBracketIndex + 1);
});

test('`jumpToAfterBlockEnd()` does not set the code pointer to the index after the next `]` if the current value is', t => {
  interpreter.code = '+><<>+[[.[<<<+]]';
  const startIndex = 0;
  interpreter.codeIndex = startIndex;

  interpreter.jumpToAfterBlockEnd();

  t.is(interpreter.codeIndex, startIndex);
});