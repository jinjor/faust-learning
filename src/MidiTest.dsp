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

// freq = hslider("freq",200,50,1000,0.01);
f = hslider("freq",300,50,2000,0.01);
bend = hslider("bend[midi:pitchwheel]",1,0,10,0.01);
freq = f*bend;
gain = hslider("gain",0.5,0,1,0.01);
gate = button("gate");
envelope = en.adsr(0.01,0.01,0.8,0.1,gate)*gain;
process = os.sawtooth(freq)*envelope <: _,_;
effect = dm.zita_light;