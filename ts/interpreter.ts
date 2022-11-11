import { AllowedCharacter } from "./AllowedCharacter.js";

export class Interpreter {
  private memoryTape: number[] = [];
  private memoryIndex = 0;
  private codeIndex = 0;
  private result = "";
  private code: AllowedCharacter[] = [];

  get currentValue() {
    const value = this.memoryTape[this.memoryIndex];
    const valueNotSet = typeof value === "undefined";
    if (valueNotSet) {
      return 0;
    }

    return this.memoryTape[this.memoryIndex];
  }

  set currentValue(value) {
    this.memoryTape[this.memoryIndex] = value;
  }

  /**
   * Interprets the Brainfuck code in the input string
   */
  interpret(inputCode: string) {
    this.reset();

    this.code = this.removeComments(inputCode);

    let printAfterRun = false;

    while (this.codeIndex < this.code.length) {
      const currentCodeCharacter = this.code[this.codeIndex];

      this.interpretCharacter(currentCodeCharacter);

      printAfterRun = currentCodeCharacter === ".";

      this.codeIndex++;
    }

    if (printAfterRun) {
      console.info(this.result);
    }
  }

  interpretCharacter(character: AllowedCharacter): void {
    switch (character) {
      case ">":
        this.incrementPointer();
        break;
      case "<":
        this.decrementPointer();
        break;
      case "+":
        this.incrementValue();
        break;
      case "-":
        this.decrementValue();
        break;
      case ".":
        this.printValue();
        break;
      case ",":
        this.readValue();
        break;
      case "[":
        this.jumpToAfterBlockEnd();
        break;
      case "]":
        this.jumpToAfterBlockStart();
        break;
    }
  }

  initMemoryTape(): void {
    this.memoryIndex = 0;
    this.memoryTape = [];
  }

  incrementPointer(): void {
    this.memoryIndex++;
  }

  decrementPointer(): void {
    this.memoryIndex--;
  }

  incrementValue(): void {
    if (!this.currentValue) {
      this.currentValue = 0;
    }
    this.currentValue++;
  }

  decrementValue(): void {
    if (!this.currentValue) {
      this.currentValue = 0;
    }

    this.currentValue--;
  }

  /**
   * Instead of printing, we add the current value to the `result` property for easier testing.
   */
  printValue(): void {
    this.result += String.fromCharCode(this.currentValue);
  }

  readValue(): void {}

  jumpToAfterBlockStart(): void {
    const doNothing = this.currentValue === 0;
    if (doNothing) {
      return;
    }

    const earliestBlockStart = this.code.indexOf("[");
    const hasEarlierBlockStart =
      earliestBlockStart > -1 && earliestBlockStart < this.codeIndex;
    if (!hasEarlierBlockStart) {
      console.error(
        `Syntax error at character number ${this.codeIndex}. No earlier block start ('[')`,
      );
      return;
    }

    while (this.codeIndex--) {
      const isBlockStartCharacter = this.code[this.codeIndex] === "[";
      if (isBlockStartCharacter) {
        return;
      }
    }
  }

  jumpToAfterBlockEnd() {
    const doNothing = this.currentValue !== 0;
    if (doNothing) {
      return;
    }

    const lastBlockEnd = this.code.lastIndexOf("]");
    const hasLaterBlockEnd = lastBlockEnd > -1 && lastBlockEnd > this.codeIndex;
    if (!hasLaterBlockEnd) {
      console.error(
        `Syntax error at character number ${this.codeIndex}. No later block end (']')`,
      );
      return;
    }

    while (this.codeIndex++ <= this.code.length) {
      const isBlockEndCharacter = this.code[this.codeIndex] === "]";
      if (isBlockEndCharacter) {
        return;
      }
    }
  }

  reset() {
    this.initMemoryTape();
    this.codeIndex = 0;
    this.code = [];
  }

  /**
   * Removes any character that isn't <>[],.+-
   */
  removeComments(codeStr: string): AllowedCharacter[] {
    return Array.from(
      codeStr.replace(/[^\>\<\+\-\.\,\[\]]/g, ""),
    ) as AllowedCharacter[];
  }
}
