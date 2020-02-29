export type MIDIInputMap = Map<DOMString, MIDIInput>; // maplike
export type MIDIOutputMap = Map<DOMString, MIDIOutput>; // maplike
export type DOMString = string;

export interface MIDIAccess extends EventTarget {
  readonly inputs: MIDIInputMap;
  readonly outputs: MIDIOutputMap;
  onstatechange: (e: MIDIConnectionEvent) => void;
  readonly sysexEnabled: boolean;
}
export type MIDIPortType = "input" | "output";
export type MIDIPortDeviceState = "disconnected" | "connected";
export type MIDIPortConnectionState = "open" | "closed" | "pending";
export interface MIDIPort extends EventTarget {
  readonly id: DOMString;
  readonly manufacturer?: DOMString;
  readonly name?: DOMString;
  readonly type: MIDIPortType;
  readonly version?: DOMString;
  readonly state: MIDIPortDeviceState;
  readonly connection: MIDIPortConnectionState;
  onstatechange: (e: MIDIConnectionEvent) => void;
  open: Promise<MIDIPort>;
  close: Promise<MIDIPort>;
}
export interface MIDIInput extends MIDIPort {
  onmidimessage: (e: MIDIMessageEvent) => void;
}
export interface MIDIOutput extends MIDIPort {
  send(data: Uint8Array | number[], timestamp?: number): void;
  clear(): void;
}
export interface MIDIMessageEvent extends Event {
  readonly receivedTime: number;
  readonly data: Uint8Array;
}
export interface MIDIConnectionEvent extends Event {
  readonly port: MIDIPort;
}
export interface MIDIMessageEventInit extends EventInit {
  receivedTime: number;
  data: Uint8Array;
}
