
let editor = null

// {
//   "type": "deleteContentBackward",
//   "repeat": 4
// }
class DeleteAction {
  constructor(action) {
    this.action = action
    this.editor = editor
    this.isActive = true
    if (this.action.repeat) {
      this.times = this.action.repeat
    } else {
      this.times = 1
    }
  }

  next() {
    if (this.times > 0) {
      const curPos = this.editor.selectionStart - 1;
      let text = this.editor.value;
      //const result = text.slice(curPos, curpos + 1)
      const newText = text.substr(0,curPos) + text.substring(curPos + 1) 
      console.log('times', this.times, newText, text, curPos)
      this.editor.value = newText 
      this.editor.selectionStart = this.editor.selectionEnd = curPos
      this.times--

      return true
    } else {

      return false
    }
  }
}

class TextAction {
  constructor(action) {
    this.action = action
    this.textIndex = 0
    this.editor = editor
  }

  insertAtCaret(char) {
    const curPos = this.editor.selectionStart;
    let text = this.editor.value;
    this.editor.value =
      text.slice(0, curPos) + char + text.slice(curPos);
    this.editor.selectionStart = curPos + 1
    this.editor.selectionEnd = this.editor.selectionStart
  }

  next() {
    if (this.textIndex < this.action.text.length) {
      const char = this.action.text[this.textIndex]
      this.insertAtCaret(char)
      this.textIndex++

      return true
    }

    return false
  }
}

class CaretAction {
  constructor(action) {
    this.action = action
    this.isActive = true
    this.editor = editor
  }

  next() {
    if (!this.isActive) {
      return false
    }

    if (this.action.position) {
      this.editor.selectionEnd = this.editor.selectionStart = this.action.position
    } else if (this.action.start !== undefined) {
      this.editor.selectionEnd = this.editor.selectionStart = this.action.start
    } else {
      throw new Error("unknown caret type")
    }

    this.isActive = false

    return true
  }
}

class ActionManager {
  constructor(actions) {
    this.actions = actions
    this.actionIndex = 0
    this.isActive = true 
    this.nextAction()
  }

  nextAction() {
    if (this.actionIndex < (this.actions.length )) {
      const nextAction = this.actions[this.actionIndex]
      if (nextAction.type == 'caret') {
        this.currentAction = new CaretAction(nextAction)
      } else if (nextAction.type == 'insertText') {
        this.currentAction = new TextAction(nextAction)
      } else if (nextAction.type == 'deleteContentBackward') {
        this.currentAction = new DeleteAction(nextAction)
      } else {


        throw new Error('Unknown action:', nextAction)
      }

      this.actionIndex++

      return true
    }

    return false
  }

  next() {
    if (this.isActive && this.currentAction.next()) {
      return true
    } else {
      if (this.nextAction()) {

        return this.next()
      } else {
        this.isActive = false

        return false
      }
    }
  }
}


export default class Replayer extends EventTarget {
  constructor(_editor, options = {}) {
    super();

    this.editor = _editor
    editor = _editor
    this.editor.addEventListener('keypress', this.onKeyup)
  }

  onKeyup = (event) => {
    event.preventDefault()
    console.log('keycode', event.keyCode)
    this.next()
    return false
  }

  setActions(actions) {
    this.actionManager = new ActionManager(actions)
  }

  next() {
    this.actionManager.next()
  }
}
