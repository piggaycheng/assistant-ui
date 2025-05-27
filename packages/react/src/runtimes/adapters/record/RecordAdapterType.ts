

export type RecordAdapter = {
  start: () => Promise<void>;
  stop: () => void;
  getAudioBlob: () => Blob | undefined;
};