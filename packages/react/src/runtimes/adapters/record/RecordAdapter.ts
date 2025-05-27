import { RecordAdapter, AudioResponse } from "./RecordAdapterType";

export class SpeechRecordAdapter implements RecordAdapter {
  private stream?: MediaStream;
  private mediaRecorder?: MediaRecorder;
  private audioChunks: Blob[] = [];
  private audioBlob?: Blob;
  private onStopCallback?: () => void;
  private speechRecognitionUrl?: string | undefined;

  constructor(speechRecognitionUrl?: string) {
    this.speechRecognitionUrl = speechRecognitionUrl;
  }

  async start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("getUserMedia is not supported in this browser.");
    }

    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      console.warn("MediaRecorder is already recording.");
      return;
    }

    this.audioChunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(this.stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      this.stream?.getTracks().forEach(track => track.stop());

      if (this.onStopCallback) {
        this.onStopCallback();
      }
    }

    this.mediaRecorder.start();
  }

  stop() {
    if (!this.mediaRecorder || this.mediaRecorder.state !== "recording") {
      console.warn("MediaRecorder is not recording.");
      return;
    }

    this.mediaRecorder?.stop();
  }

  setOnStopCallback(callback: () => void) {
    this.onStopCallback = callback;
  }

  getAudioBlob(): Blob | undefined {
    return this.audioBlob;
  }

  async sendAudio(audioBlob: Blob) {
    if (!this.speechRecognitionUrl) {
      throw new Error("Speech recognition URL is not set.");
    }

    const formData = new FormData();
    formData.append("audio_blob", audioBlob, "recording.webm");

    const response = await fetch(this.speechRecognitionUrl, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Failed to send audio: ${response.statusText}`);
    }

    const result: AudioResponse = await response.json();
    return result; // Assuming the API returns some result
  }
}

