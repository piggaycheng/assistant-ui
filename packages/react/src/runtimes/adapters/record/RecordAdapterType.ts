export type RecordAdapter = {
  start: () => Promise<void>;
  stop: () => void;
  setOnStopRecording: (callback: (audioBlob: Blob) => void) => void;
  getSpeechToText: () => (((audioBlob: Blob) => Promise<string>) | undefined);
  setStartVisualizerRecording?: (fn: () => void) => void;
  setStopVisualizerRecording?: (fn: () => void) => void;
};

export type AudioResponse = {
  text: string;
}