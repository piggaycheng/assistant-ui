

export type RecordAdapter = {
  start: () => void;
  stop: () => void;
  getAudioBlob: () => Blob | undefined;
};