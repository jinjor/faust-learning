export interface FaustNodeDescription {
  name: string;
  filename: string;
  version: string;
  compile_options: string;
  library_list: string[];
  include_pathnames: string[];
  size: number;
  inputs: number;
  outputs: number;
  meta: { [key: string]: string }[];
  ui: UI[];
}

export namespace ui {
  export type VGroup = {
    type: "vgroup";
    label: string;
    items: UI[];
  };
  export type HGroup = {
    type: "hgroup";
    label: string;
    items: UI[];
  };
  export type TGroup = {
    type: "tgroup";
    label: string;
    items: UI[];
  };
  export type HSlider = {
    type: "hslider";
    label: string;
    address: string;
    index: number;
    meta: { [key: string]: string }[];
    init: number;
    min: number;
    max: number;
    step: number;
  };
  export type VSlider = {
    type: "vslider";
    label: string;
    address: string;
    index: number;
    meta: { [key: string]: string }[];
    init: number;
    min: number;
    max: number;
    step: number;
  };
  export type NEntry = {
    type: "nentry";
    label: string;
    address: string;
    index: number;
    meta: { [key: string]: string }[];
    init: number;
    min: number;
    max: number;
    step: number;
  };
  export type Button = {
    type: "button";
    label: string;
    address: string;
    index: number;
    meta: { [key: string]: string }[];
  };
  export type Checkbox = {
    type: "checkbox";
    label: string;
    address: string;
    index: number;
    meta: { [key: string]: string }[];
  };
  export type HBarGraph = {
    type: "hbargraph";
    label: string;
    address: string;
    index: number;
    meta: { [key: string]: string }[];
    min: number;
    max: number;
  };
  export type VBarGraph = {
    type: "vbargraph";
    label: string;
    address: string;
    index: number;
    meta: { [key: string]: string }[];
    min: number;
    max: number;
  };
}

export type UI =
  | ui.VGroup
  | ui.HGroup
  | ui.TGroup
  | ui.HSlider
  | ui.VSlider
  | ui.NEntry
  | ui.Button
  | ui.Checkbox
  | ui.HBarGraph
  | ui.VBarGraph;

export interface Descriptor {
  [key: string]: { minValue: number; maxValue: number; defaultValue: number };
}

export interface FaustNode extends AudioWorkletNode {
  /**
   *  Returns a full JSON description of the DSP.
   */
  getJSON(): string;

  // For WAP
  getMetadata(): Promise<any>;

  /**
   *  Set the control value at a given path.
   *
   * @param path - a path to the control
   * @param val - the value to be set
   */
  setParamValue(path: string, val: number): void;

  // For WAP
  setParam(path: string, val: number): void;
  /**
   *  Get the control value at a given path.
   *
   * @return the current control value
   */
  getParamValue(path: string): number;

  // For WAP
  getParam(path: string): number;

  /**
   * Setup a control output handler with a function of type (path, value)
   * to be used on each generated output value. This handler will be called
   * each audio cycle at the end of the 'compute' method.
   *
   * @param handler - a function of type function(path, value)
   */
  setOutputParamHandler(handler: any): void;

  /**
   * Get the current output handler.
   */
  getOutputParamHandler(): any;

  getNumInputs(): number;
  getNumOutputs(): number;

  // For WAP
  inputChannelCount(): number;
  outputChannelCount(): number;

  /**
   * Returns an array of all input paths (to be used with setParamValue/getParamValue)
   */
  getParams(): string[];

  // For WAP
  getDescriptor(): any;

  /**
   * Control change
   *
   * @param channel - the MIDI channel (0..15, not used for now)
   * @param ctrl - the MIDI controller number (0..127)
   * @param value - the MIDI controller value (0..127)
   */
  ctrlChange(channel: number, ctrl: number, value: number): void;

  /**
   * PitchWeel
   *
   * @param channel - the MIDI channel (0..15, not used for now)
   * @param value - the MIDI controller value (-1..1)
   */
  pitchWheel(channel: number, wheel: number): void;
}
