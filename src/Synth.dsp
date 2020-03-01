declare name "My DSP";
declare author "jinjor";
declare copyright "(c)jinjor 2020";
declare version "0.0.1";
declare license "MIT";

declare options "[midi:on]";

import("stdfaust.lib");

constant = environment {
  pi = 3.14159;
  e = 2,718;
};

// Function Definitions 
// linear2db(x) = 20*log10(x);
// linear2db = \(x).(20*log10(x));

// Pattern matching
// duplicate(1,x) = x;
// duplicate(n,x) = x, duplicate(n-1,x);
// process = duplicate(5,no.noise);

// Recursive (timer)
// process = _~+(1);

// Peak Equalizer
nBands = 4;
filterBank(N) = hgroup("[3]EQ",seq(i,N,oneBand(i)))
with {
    oneBand(j) = vgroup("[%j]Band %a",fi.peak_eq(l,f,b))
    with {
        a = j+1; // just so that band numbers don't start at 0
        l = vslider("[2]Level[unit:db]",0,-70,12,0.01) : si.smoo;
        f = hslider("[1]Freq",(80+(1000*8/N*(j+1)-80)),20,20000,0.01) : si.smoo;
        b = f/hslider("[0]Q[style:knob]",1,1,50,0.01) : si.smoo;
    };
};
eq = filterBank(nBands);

// AM Synth
// freq = hslider("[0]freq",440,50,3000,0.01);
// gain = hslider("[1]gain",1,0,1,0.01);
// shift = hslider("[2]shift",0,0,1,0.01);
// gate = button("[3]gate");
// envelope = gain*gate : si.smoo;
// nOscs = 4;
// process = prod(i,nOscs,os.osc(freq*(i+1+shift)))*envelope;

// Pink Noise
// pink = f : + ~ g 
// with {
//   f(x) = 0.04957526213389*x - 0.06305581334498*x' + 0.01483220320740*x'';
//     g(x) = 1.80116083982126*x - 0.80257737639225*x';
// };

// Simple Envelope
// ar(a,r,g) = v
// letrec {
//   'n = (n+1) * (g<=g');
//   'v = max(0, v + (n<a)/a - (n>=a)/r) * (g<=g');
// };
// gate = button("gate");
// process = os.osc(440)*ar(1000,1000,gate);

// Read-only Table (triangle)
// triangleWave = waveform{0,0.5,1,0.5,0,-0.5,-1,-.5};
// triangleOsc(f) = triangleWave,int(os.phasor(8,f)) : rdtable;
// f = hslider("freq",440,50,2000,0.01);
// process = triangleOsc(f);

// Read-only Table (sine)
// import("stdfaust.lib");
// sineWave(tablesize) = float(ba.time)*(2.0*ma.PI)/float(tablesize) : sin;
// tableSize = 1 << 16;
// triangleOsc(f) = tableSize,sineWave(tableSize),int(os.phasor(tableSize,f)) : rdtable;
// f = hslider("freq",440,50,2000,0.01);
// process = triangleOsc(f);

// Select
// s2 = nentry("Selector",0,0,1,1);
// sig = os.osc(440),os.sawtooth(440) : select2(s2);

// Global UI Metadata
// [style:knob]
// [style:menu]
// [style:radio]
// [style:led]
// [style:numerical]
// [unit:dB]
// [unit:xx]
// [scale:xx] log, exp
// [tooltip:xx]
// [hidden:xx]

adsrGroup(x) = vgroup("[1]ADSR",x);
a = adsrGroup(hslider("[1]A",0.01,0.01,1,0.01) : si.smoo);
d = adsrGroup(hslider("[2]D",0.01,0.01,1,0.01) : si.smoo);
s = adsrGroup(hslider("[3]S",0.8,0,1,0.01) : si.smoo);
r = adsrGroup(hslider("[4]R",0.1,0.01,1,0.01) : si.smoo);
gain = adsrGroup(hslider("[5]gain",0.5,0,1,0.01) : si.smoo);
envelope = en.adsr(a,d,s,r,gate)*gain;

filterGroup(x) = vgroup("[2]Filter",x);
ctFreq     = filterGroup(hslider("[1]cutoffFrequency",1600,50,10000,0.01)) : si.smoo;
q          = filterGroup(hslider("[2]q",5,1,30,0.1)) : si.smoo;
filterGain = filterGroup(hslider("[3]gain",1,0,1,0.01)) : si.smoo;

reverb = vgroup("[4]Reverb", dm.zita_light);

gate = button("[5]Gate");

// bypass = checkbox("[4]bypass") * (-1) + 1: si.smoo;
// process = no.noise * envelope : fi.resonlp(ctFreq,q,filterGain) <: reverb;
process = os.sawtooth(442) * envelope : fi.resonlp(ctFreq,q,filterGain) : eq <: _,_;
effect = reverb;