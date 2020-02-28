import { FaustNode, FaustNodeDescription, UI, ui } from "./faust.js";

const assetPath = "assets/js";
const nodeName = "noise";

// State
let audioCtx = new AudioContext();
let dsp: FaustNode = null;
let playing = false;

// Elements
const startButton = document.getElementById("start") as HTMLButtonElement;
const stopButton = document.getElementById("stop") as HTMLButtonElement;
const paramsContainer = document.getElementById("params");

// Update Elements
function updateElements() {
  if (dsp != null && !paramsContainer.hasChildNodes()) {
    paramsContainer.appendChild(createUI(dsp));
  }
  startButton.style.display = playing ? "none" : null;
  stopButton.style.display = playing ? null : "none";
  paramsContainer.style.opacity = playing ? "1" : "0.5";
}
function createUI(dsp: FaustNode): HTMLElement {
  const json = JSON.parse(dsp.getJSON()) as FaustNodeDescription;
  const ui = json.ui[0];
  if (ui.type === "vgroup" || ui.type === "hgroup") {
    return createGroup(ui);
  }
  return null;
}
function createGroup(ui: ui.HGroup | ui.VGroup): HTMLElement {
  const groupContainer = document.createElement("div");

  const label = document.createElement("label");
  label.style.display = "block";
  label.textContent = ui.label;
  groupContainer.appendChild(label);

  for (const item of ui.items) {
    const control = document.createElement("div");
    control.style.paddingLeft = "20px";

    if (item.type === "hslider" || item.type === "vslider") {
      const label = document.createElement("label");
      label.style.display = "inline-block";
      label.style.width = "200px";
      label.textContent = item.label;
      control.appendChild(label);

      const input = document.createElement("input") as any;
      input.type = "range";
      input.min = item.min;
      input.max = item.max;
      input.value = item.init;
      input.step = item.step;
      input.oninput = (e: InputEvent) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        dsp.setParamValue(item.address, value);
      };
      control.appendChild(input);
    } else if (item.type === "button") {
      const label = document.createElement("label");
      label.style.display = "inline-block";
      label.style.width = "200px";
      label.textContent = item.label;
      control.appendChild(label);
      const input = document.createElement("input");
      input.type = "button";
      input.onmousedown = e => {
        dsp.setParamValue(item.address, 1);
      };
      input.onmouseup = e => {
        dsp.setParamValue(item.address, 0);
      };
      control.appendChild(input);
    } else if (item.type === "checkbox") {
      const label = document.createElement("label");
      label.style.display = "inline-block";
      label.style.width = "200px";
      label.textContent = item.label;
      control.appendChild(label);

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = false;
      input.onclick = e => {
        dsp.setParamValue(item.address, input.checked ? 1 : 0);
      };
      control.appendChild(input);
    } else if (item.type === "vgroup" || item.type === "hgroup") {
      control.appendChild(createGroup(item));
    }
    groupContainer.appendChild(control);
  }
  return groupContainer;
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
