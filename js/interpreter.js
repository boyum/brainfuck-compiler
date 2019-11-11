class Interpreter {
  memoryTape = [];
  memoryIndex = 0;
  codeIndex = 0;
  
  constructor() { }
  
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
    this.reset();
    this.code = code;
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
    this.memoryTape[this.memoryIndex]++;
  }

  decrementValue() {
    this.memoryTape[this.memoryIndex]--;
  }

  printValue() {
    console.log(this.currentValue);
  }

  readValue() {

  }
  
  jumpToAfterBlockStart() {
    const doNothing = this.currentValue !== 0;
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
    const doNothing = this.currentValue === 0;
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
}

module.exports = {
  Interpreter,
};
