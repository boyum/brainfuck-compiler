class Interpreter {
  memoryTape = [];
  memoryIndex = 0;
  codeIndex = 0;
  
  constructor() {
    this.reset();
  }
  
  get currentValue() {
    const value = this.memoryTape[this.memoryIndex];
    const valueNotSet = typeof value === 'undefined';
    if (valueNotSet) {
      this.memoryTape[this.memoryIndex] = 0;
    }
    
    return this.memoryTape[this.memoryIndex];
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


  }

  jumpToAfterBlockEnd() {
    const doNothing = this.currentValue === 0;
    if (doNothing) {
      return;
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
