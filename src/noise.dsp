import("stdfaust.lib");

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
process = os.sawtooth(442) * envelope : fi.resonlp(ctFreq,q,filterGain) <: reverb;