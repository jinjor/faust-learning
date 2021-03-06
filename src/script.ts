import { FaustNode, FaustNodeDescription, UI } from "./faust.js";
import {
  MIDIAccess,
  MIDIConnectionEvent,
  MIDIMessageEvent
} from "./midi-types.js";
const Keyboard = customElements.get("x-keyboard"); // this is closed source yet.

const assetPath = "assets/js";
const nodeName = "SynthPoly";

// State
let audioCtx = new AudioContext();
let dsp: FaustNode = null;
let playing = false;

// Elements
const startButton = document.getElementById("start") as HTMLButtonElement;
const stopButton = document.getElementById("stop") as HTMLButtonElement;
const paramsContainer = document.getElementById("params");
const keyboardContainer = document.getElementById("keyboard");

// Update Elements
function updateElements() {
  if (dsp != null && !paramsContainer.hasChildNodes()) {
    const json = jsonParseFix(dsp.getJSON()) as FaustNodeDescription;
    for (const ui of json.ui) {
      paramsContainer.appendChild(createUI(ui));
    }
  }
  startButton.style.display = playing ? "none" : null;
  stopButton.style.display = playing ? null : "none";
  paramsContainer.style.opacity = playing ? "1" : "0.5";
  if (!keyboardContainer.hasChildNodes()) {
    const el = new Keyboard({
      onDown: async (e: any) => {
        console.log("down", e);
        if (dsp) {
          dsp.keyOn(0, e.note, 100);
        }
      },
      onUp: (e: any) => {
        console.log("up", e);
        if (dsp) {
          dsp.keyOff(0, e.note, 100);
        }
      }
    });
    keyboardContainer.appendChild(el);
  }
}

// UI
function createUI(ui: UI): HTMLElement {
  if (ui.type === "vgroup" || ui.type === "hgroup" || ui.type === "tgroup") {
    const container = document.createElement("div");

    const label = document.createElement("label");
    label.style.display = "block";
    label.textContent = ui.label;
    container.appendChild(label);

    const list = document.createElement("div");
    list.style.display = "inline-grid";
    list.style.paddingLeft = "20px";

    if (ui.type === "hgroup") {
      list.style.gridAutoFlow = "column";
    }
    for (const item of ui.items) {
      const child = createUI(item);
      if (ui.type === "hgroup") {
        child.style.display = "inline-block";
        child.style.maxWidth = "200px";
      }
      list.appendChild(child);
    }
    container.appendChild(list);
    return container;
  } else if (
    ui.type === "hslider" ||
    ui.type === "vslider" ||
    ui.type === "nentry"
  ) {
    const container = document.createElement("div");

    const label = document.createElement("label");
    label.textContent = ui.label;
    if (ui.type === "vslider") {
      label.style.display = "block";
      label.style.width = "120px";
      // input.style.appearance = "slider-vertical";
      label.style.display = "block";
    } else if (ui.type === "hslider") {
      label.style.display = "inline-block";
      label.style.width = "200px";
    }

    const input = document.createElement("input") as any;
    input.type = "range";
    if (ui.type === "vslider") {
      input.style["-webkit-appearance"] = "slider-vertical";
    }
    input.min = ui.min;
    input.max = ui.max;
    input.value = ui.init;
    input.step = ui.step;
    input.oninput = (e: InputEvent) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      dsp.setParamValue(ui.address, value);
    };
    container.appendChild(label);
    container.appendChild(input);
    return container;
  } else if (ui.type === "button") {
    const container = document.createElement("div");

    const input = document.createElement("input");
    input.type = "button";
    input.style.width = "100px";
    input.value = ui.label;
    input.onmousedown = e => {
      dsp.setParamValue(ui.address, 1);
    };
    input.onmouseleave = e => {
      dsp.setParamValue(ui.address, 0);
    };
    input.onmouseup = e => {
      dsp.setParamValue(ui.address, 0);
    };

    container.appendChild(input);
    return container;
  } else if (ui.type === "checkbox") {
    const container = document.createElement("div");

    const label = document.createElement("label");
    label.style.display = "inline-block";
    label.style.width = "200px";
    label.textContent = ui.label;
    container.appendChild(label);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = false;
    input.onclick = e => {
      dsp.setParamValue(ui.address, input.checked ? 1 : 0);
    };
    container.appendChild(input);

    return container;
  }
  console.log(`type ${(ui as any).type} is not implemented yet`);
  console.log(ui);
  return null;
}

// Attach Events
startButton.addEventListener("click", async () => {
  await audioCtx.resume();
  dsp.connect(audioCtx.destination);
  playing = true;
  updateElements();
});
stopButton.addEventListener("click", async () => {
  dsp.disconnect();
  playing = false;
  updateElements();
});

async function init() {
  await initDSP();
  await initMidi();
  updateElements();
}

function jsonParseFix(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.log("Failed to parse JSON, try another way...");
    let a;
    eval(`a=` + json);
    return a;
  }
}

async function initDSP() {
  // const factory = new (window as any)[nodeName](audioCtx, assetPath);// non-poly
  const factory = new (window as any)[nodeName](audioCtx, 16, assetPath); // poly

  dsp = await factory.load();
  console.log(dsp);
  console.log(dsp.inputChannelCount());
  console.log(dsp.outputChannelCount());
  console.log(dsp.getParams());
  console.log(dsp.getDescriptor());
  console.log(dsp.getJSON());
  console.log(jsonParseFix(dsp.getJSON()));
}
async function initMidi() {
  (navigator as any).requestMIDIAccess().then((midiAccess: MIDIAccess) => {
    for (let input of midiAccess.inputs.values()) {
      console.log(input.name, input.connection, input.state);
      input.onmidimessage = (e: MIDIMessageEvent) => {
        if (dsp) {
          const message = [e.data[0], e.data[1], e.data[2]];
          dsp.midiMessage(message);
        }
      };
      input.onstatechange = (e: MIDIConnectionEvent) => {
        console.log(input.name, input.connection, input.state);
      };
    }
    for (let output of midiAccess.outputs.values()) {
      console.log(output.name, output.connection, output.state);
    }
  });
}
init();
