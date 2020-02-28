import { FaustNode } from "./faust.js";

const assetPath = "assets/js";
const nodeName = "noise";

// State
let audioCtx = new AudioContext();
let dsp: FaustNode = null;
let playing = false;

// Elements
const playButton = document.getElementById("play") as HTMLButtonElement;
const stopButton = document.getElementById("stop") as HTMLButtonElement;
const paramsContainer = document.getElementById("params");

// Update Elements
function updateElements() {
  if (dsp != null && !paramsContainer.hasChildNodes()) {
    paramsContainer.appendChild(createGroup(dsp));
  }
  playButton.style.display = playing ? "none" : null;
  stopButton.style.display = playing ? null : "none";
}
function createGroup(dsp: FaustNode): HTMLElement {
  const json = JSON.parse(dsp.getJSON());
  const ui = json.ui[0];
  if (ui.type === "vgroup") {
    const groupContainer = document.createElement("div");

    const label = document.createElement("label");
    label.style.display = "block";
    label.textContent = ui.label;
    groupContainer.appendChild(label);

    for (const item of ui.items) {
      const label = document.createElement("label");
      label.style.display = "inline-block";
      label.style.width = "200px";
      label.textContent = item.label;

      const input = document.createElement("input");
      input.type = "range";
      input.min = item.min;
      input.max = item.max;
      input.value = item.init;
      input.step = item.step;
      input.oninput = (e: InputEvent) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        dsp.setParamValue(item.address, value);
      };

      const control = document.createElement("div");
      control.appendChild(label);
      control.appendChild(input);
      groupContainer.appendChild(control);
    }
    return groupContainer;
  }
  return null;
}

// Attach Events
playButton.addEventListener("click", async () => {
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
  const factory = new (window as any)[nodeName](audioCtx, assetPath);
  dsp = await factory.load();
  console.log(dsp.inputChannelCount());
  console.log(dsp.outputChannelCount());
  console.log(dsp.getParams());
  console.log(dsp.getDescriptor());
  console.log(JSON.parse(dsp.getJSON()));
  updateElements();
}
init();
