import Recorder from "../src/recorder.js";
//import Replayer from "../src/replayer.js";
import Replayer from "./bk-replayer.js";


const recorderEditor = document.querySelector('#recorder')
const actionLog = document.querySelector('#action-log')
const playerEditor = document.querySelector('#player')
const playButton = document.querySelector('#play-button')
const resetButton = document.querySelector('#reset-button')

let recorder = new Recorder(recorderEditor, {pauses: 'ignore'});
window.recorder = recorder
recorder.start();

let replayer = new Replayer(playerEditor, {pauses: 'ignore'});


const tempActions = [
  {
    "type": "caret",
    "start": 0,
    "end": 0
  },
  {
    "type": "insertText",
    "text": "asdf",
    "split": true
  },
  {
    "type": "deleteContentBackward",
    "repeat": 3
  }
]

function playActions() {
  playerEditor.value = ''
  if (actionLog.value) {
    const actions = JSON.parse(actionLog.value)
    replayer.setActions(actions);
  } else {
    console.error('action log is empty')
  }
  //replayer.runAll(recorder.actions);
  //replayer.setActions(tempActions);
}

function playTemp() {
  playerEditor.value = ''
  replayer.setActions(tempActions);
}

playTemp()

recorder.addEventListener("actionschange", evt => {
    // recorder.actions has been updated
    // evt.detail contains the new (or in some cases changed) action
   actionLog.value = JSON.stringify(recorder.actions,null ,2)
   actionLog.scrollTop = actionLog.scrollHeight;
});


playButton.addEventListener("click", playActions)

function reset() {
  recorder.actions = []
  recorderEditor.value = ''
  playerEditor.value = ''
}

resetButton.addEventListener("click", reset)

// [
//   {
//     "type": "caret",
//     "start": 0,
//     "end": 0
//   },
//   {
//     "type": "insertText",
//     "text": "function hello(){\n}",
//     "split": true
//   },
//   {
//     "type": "pause",
//     "delay": 3349
//   },
//   {
//     "type": "caret",
//     "position": 17
//   },
//   {
//     "type": "insertText",
//     "text": "\n  print('hello');",
//     "split": true
//   }
// ]
