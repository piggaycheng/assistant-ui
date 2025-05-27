import { RecordAdapter } from "./RecordAdapterType";

export class SpeechRecordAdapter implements RecordAdapter {
  private stream?: MediaStream;
  private mediaRecorder?: MediaRecorder;
  private audioChunks: Blob[] = [];
  private audioBlob?: Blob;

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

  getAudioBlob(): Blob | undefined {
    return this.audioBlob;
  }
}

