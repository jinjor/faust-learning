declare options "[midi:on]";

import("stdfaust.lib");

noteControl = 16

// freq = hslider("frequency[midi:keyon 62]",200,50,1000,0.01) : si.smoo;
// freq = hslider("frequency[midi:ctrl 11]",200,50,1000,0.01) : si.smoo;
noteToHz(x) = 442*2^((x-69)/12);
freq = hslider("frequency[midi:ctrl %noteControl]",60,1,127,1) : noteToHz : si.smoo;
gate = button("gate");
process = os.sawtooth(freq)*0.2*gate;