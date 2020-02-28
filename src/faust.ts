export interface FaustNode extends AudioWorkletNode {
  /**
   *  Returns a full JSON description of the DSP.
   */
  getJSON(): any;

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
