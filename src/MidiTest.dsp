// declare options "[midi:on]";
// declare options "[nvoices:12]";

// import("stdfaust.lib");

// noteControl = 16;

// // freq = hslider("frequency[midi:keyon 62]",200,50,1000,0.01) : si.smoo;
// // freq = hslider("frequency[midi:ctrl 11]",200,50,1000,0.01) : si.smoo;
// noteToHz(x) = 442*2^((x-69)/12);
// // freq = hslider("frequency[midi:ctrl %noteControl]",60,1,127,1) : noteToHz : si.smoo;

// freq = hslider("note[midi:keyon 62]",60,1,127,1) : noteToHz : si.smoo;

// gate = button("gate");
// process = os.sawtooth(freq)*0.2*gate;

import("stdfaust.lib");
// The names "freq", "gain", "gate" are used for receiving MIDI messages.
freq = hslider("freq",200,50,1000,0.01);
gain = hslider("gain",0.5,0,1,0.01);
gate = button("gate");
process = os.sawtooth(freq)*gain*gate;