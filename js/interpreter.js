class Interpreter {
  memoryTape = [];
  memoryIndex = 0;
  codeIndex = 0;
  result = '';

  constructor() {}

  get currentValue() {
    const value = this.memoryTape[this.memoryIndex];
    const valueNotSet = typeof value === 'undefined';
    if (valueNotSet) {
      this.currentValue = 0;
    }

    return this.memoryTape[this.memoryIndex];
  }

  set currentValue(value) {
    
    this.memoryTape[this.memoryIndex] = value;
  }

  /**
   * Interprets the Brainfuck code in the input string
   * @param {string} code 
   */
  interpret(code) {    
    let printAfterRun = false;
    this.reset();
    this.code = this.removeComments(code);
    
    while (this.codeIndex++ < this.code.length) {
      const currentCodeCharacter = this.code[this.codeIndex];
      switch (currentCodeCharacter) {
        case '>': this.incrementPointer(); break;
        case '<': this.decrementPointer(); break;
        case '+': this.incrementValue(); break;
        case '-': this.decrementValue(); break;
        case '.': this.printValue(); printAfterRun = true; break;
        case ',': this.readValue(); break;
        case '[': this.jumpToAfterBlockEnd(); break;
        case ']': this.jumpToAfterBlockStart(); break;
      }
    }

    if (printAfterRun) {
      console.info(this.result);
    }
  }

  /**
   * @return {number[]}
   */
  initMemoryTape() {
    this.memoryIndex = 0;
    this.memoryTape = [];
  }

  incrementPointer() {
    
    this.memoryIndex++;
  }

  decrementPointer() {
    this.memoryIndex--;
  }

  incrementValue() {
    if (!this.currentValue) {
      this.currentValue = 0;
    }
    this.currentValue++;
  }

  decrementValue() {
    if (!this.currentValue) {
      this.currentValue = 0;
    }

    this.currentValue--;
  }

  /**
   * Instead of printing, we add the current value to the `result` property for easier testing.
   */
  printValue() {
    
    
    this.result += String.fromCharCode(this.currentValue);
    
  }

  readValue() {

  }

  jumpToAfterBlockStart() {
    const doNothing = this.currentValue === 0;
    if (doNothing) {
      return;
    }

    const earliestBlockStart = this.code.indexOf('[');
    const hasEarlierBlockStart = earliestBlockStart > -1 && earliestBlockStart < this.codeIndex;
    if (!hasEarlierBlockStart) {
      console.error(`Syntax error at character number ${this.codeIndex}. No earlier block start ('[')`);
      return;
    }

    while (this.codeIndex--) {
      const isBlockStartCharacter = this.code[this.codeIndex] === '[';
      if (isBlockStartCharacter) {
        this.codeIndex++;
        return;
      }
    }
  }

  jumpToAfterBlockEnd() {
    
    const doNothing = this.currentValue !== 0;
    if (doNothing) {
      return;
    }

    const lastBlockEnd = this.code.lastIndexOf(']');
    const hasLaterBlockEnd = lastBlockEnd > -1 && lastBlockEnd > this.codeIndex;
    if (!hasLaterBlockEnd) {
      console.error(`Syntax error at character number ${this.codeIndex}. No later block end (']')`);
      return;
    }

    while (this.codeIndex++ <= this.code.length) {
      const isBlockEndCharacter = this.code[this.codeIndex] === ']';
      if (isBlockEndCharacter) {
        this.codeIndex++;
        return;
      }
    }
  }

  reset() {
    this.initMemoryTape();
    this.codeIndex = 0;
  }

  /**
   * Removes any character that isn't <>[],.+-
   * @param {string} codeStr 
   */
  removeComments(codeStr) {
    return codeStr.replace(/[^\>\<\+\-\.\,\[\]]/g, '');
  }
}

module.exports = {
  Interpreter,
};