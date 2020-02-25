const assetPath = "assets/js";
const nodeName = "noise";

// State
let audioCtx: AudioContext;
let dsp: AudioWorkletNode = null;
let playing = false;

// Elements
const playButton = document.getElementById("play") as HTMLButtonElement;
const stopButton = document.getElementById("stop") as HTMLButtonElement;

// Update Elements
function updateElements() {
  playButton.style.display = playing ? "none" : null;
  stopButton.style.display = playing ? null : "none";
}
updateElements();

// Attach Events
playButton.addEventListener("click", async () => {
  if (audioCtx == null) {
    audioCtx = new AudioContext();
  }
  if (dsp == null) {
    dsp = await new (window as any)[nodeName](audioCtx, assetPath).load();
  }
  dsp.connect(audioCtx.destination);
  playing = true;
  updateElements();
});
stopButton.addEventListener("click", async () => {
  dsp.disconnect();
  playing = false;
  updateElements();
});
