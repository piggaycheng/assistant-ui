

export type RecordAdapter = {
  start: () => Promise<void>;
  stop: () => void;
  getAudioBlob: () => Blob | undefined;
  sendAudio: (audioBlob: Blob) => Promise<AudioResponse>;
  setOnStopCallback: (callback: () => void) => void;
};


export type AudioResponse = {
  text: string;
}