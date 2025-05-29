"use client";

import { FC, useEffect, useState } from "react";

import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { useComposerRuntime } from "../../context";

export const ComposerPrimitiveRecordVisualizer: FC = () => {
  const [isWindowReady, setIsWindowReady] = useState(false);
  const recorderControls = useVoiceVisualizer();
  const {
    recordedBlob,
    startRecording,
    stopRecording
  } = recorderControls;

  const composerRuntime = useComposerRuntime();

  useEffect(() => {
    composerRuntime.setStartVisualizerRecording(startRecording);
    composerRuntime.setStopVisualizerRecording(stopRecording);
  }, [composerRuntime, startRecording, stopRecording]);

  useEffect(() => {
    if (!recordedBlob) return;

    const speechToText = composerRuntime.getSpeechToText();
    if (speechToText) {
      speechToText(recordedBlob).then((text) => {
        composerRuntime.setText(text);
      });
    } else {
      console.warn("No speechToText function set in the composer runtime.");
    }
  }, [composerRuntime, recordedBlob]);

  useEffect(() => {
    // Ensure the window is ready before using the voice visualizer
    if (typeof window !== "undefined")
      setIsWindowReady(true);
  }, []);

  return (
    <>
      {isWindowReady && <VoiceVisualizer controls={recorderControls} backgroundColor="#333" />}
    </>
  )
}

ComposerPrimitiveRecordVisualizer.displayName = "ComposerPrimitive.RecordVisualizer";