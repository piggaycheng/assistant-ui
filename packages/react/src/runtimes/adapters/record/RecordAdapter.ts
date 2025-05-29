import { RecordAdapter } from "./RecordAdapterType";

export class SpeechRecordAdapter implements RecordAdapter {
  private _stream: MediaStream | undefined;
  private _mediaRecorder: MediaRecorder | undefined;
  private _audioChunks: Blob[] = [];
  private _audioBlob: Blob | undefined;
  private _onStopRecording: ((audioBlob: Blob) => void) | undefined;
  private _speechToText: ((audioBlob: Blob) => Promise<string>) | undefined;
  private _startVisualizerRecording: (() => void) | undefined;
  private _stopVisualizerRecording: (() => void) | undefined;

  constructor(
    speechToText?: (audioBlob: Blob) => Promise<string>,
  ) {
    this._speechToText = speechToText;
  }

  async start() {
    if (this._startVisualizerRecording) {
      this._startVisualizerRecording();
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("getUserMedia is not supported in this browser.");
    }

    if (this._mediaRecorder && this._mediaRecorder.state === "recording") {
      console.warn("MediaRecorder is already recording.");
      return;
    }

    this._audioChunks = [];
    this._stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this._mediaRecorder = new MediaRecorder(this._stream);

    this._mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this._audioChunks.push(event.data);
      }
    };

    this._mediaRecorder.onstop = () => {
      this._audioBlob = new Blob(this._audioChunks, { type: 'audio/webm' });
      this._stream?.getTracks().forEach(track => track.stop());

      this._onStopRecording?.(this._audioBlob);
    }

    this._mediaRecorder.start();
  }

  stop() {
    if (this._stopVisualizerRecording) {
      this._stopVisualizerRecording();
      return;
    }

    if (!this._mediaRecorder || this._mediaRecorder.state !== "recording") {
      console.warn("MediaRecorder is not recording.");
      return;
    }

    this._mediaRecorder?.stop();
  }

  setOnStopRecording(callback: (audioBlob: Blob) => void) {
    this._onStopRecording = callback;
  }

  getSpeechToText() {
    return this._speechToText;
  }

  setStartVisualizerRecording(fn: () => void) {
    this._startVisualizerRecording = fn;
  }

  setStopVisualizerRecording(fn: () => void) {
    this._stopVisualizerRecording = fn;
  }
}

