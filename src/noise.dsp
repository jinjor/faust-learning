import("stdfaust.lib");
ctFreq = hslider("[0]cutoffFrequency",500,50,10000,0.01) : si.smoo;
q = hslider("[1]q",5,1,30,0.1) : si.smoo;
gain = hslider("[2]gain",1,0,1,0.01) : si.smoo;
gate = button("[3]gate") : si.smoo;
bypass = checkbox("[4]bypass") * (-1) + 1: si.smoo;
process = no.noise : fi.resonlp(ctFreq,q,gain) : *(gate) <: dm.zita_light : *(bypass),*(bypass);