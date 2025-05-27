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

    return {
      stream: this.stream,
      mediaRecorder: this.mediaRecorder,
      audioChunks: this.audioChunks,
    }
  }

  stop() {
    this.mediaRecorder?.stop();
  }

  getAudioBlob(): Blob | undefined {
    return this.audioBlob;
  }
}

