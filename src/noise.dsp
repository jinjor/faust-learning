declare name "My DSP";
declare author "jinjor";
declare copyright "(c)jinjor 2020";
declare version "0.0.1";
declare license "MIT";

import("stdfaust.lib");

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
nBands = 3;
filterBank(N) = hgroup("Filter Bank",seq(i,N,oneBand(i)))
with {
    oneBand(j) = vgroup("[%j]Band %a",fi.peak_eq(l,f,b))
    with {
        a = j+1; // just so that band numbers don't start at 0
        l = vslider("[2]Level[unit:db]",0,-70,12,0.01) : si.smoo;
        f = nentry("[1]Freq",(80+(1000*8/N*(j+1)-80)),20,20000,0.01) : si.smoo;
        b = f/hslider("[0]Q[style:knob]",1,1,50,0.01) : si.smoo;
    };
};
// process = filterBank(nBands);

gate = button("[0]gate");

a = hslider("[1]A",0.01,0.01,1,0.01);
d = hslider("[2]D",0.01,0.01,1,0.01);
s = hslider("[3]S",0.8,0,1,0.01);
r = hslider("[4]R",0.1,0.01,1,0.01);
gain = hslider("gain",0.5,0,1,0.01);
envelope = en.adsr(a,d,s,r,gate)*gain;

ctFreq = hslider("[6]cutoffFrequency",1600,50,10000,0.01) : si.smoo;
q = hslider("[7]q",5,1,30,0.1) : si.smoo;
filterGain = hslider("[8]filterGain",1,0,1,0.01) : si.smoo;

reverb = dm.zita_light;

// bypass = checkbox("[4]bypass") * (-1) + 1: si.smoo;
// process = no.noise * envelope : fi.resonlp(ctFreq,q,filterGain) <: reverb;
process = os.sawtooth(442) * envelope : fi.resonlp(ctFreq,q,filterGain) : filterBank(nBands) <: reverb;