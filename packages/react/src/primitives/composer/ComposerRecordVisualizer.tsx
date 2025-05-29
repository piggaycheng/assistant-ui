"use client";

import { FC, useEffect, useState, useMemo } from "react";

import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { useComposerRuntime, useComposer } from "../../context";

export const ComposerPrimitiveRecordVisualizer: FC = () => {
  const [isWindowReady, setIsWindowReady] = useState(false);
  const recorderControls = useVoiceVisualizer();
  const {
    recordedBlob,
    startRecording,
    stopRecording
  } = recorderControls;

  const composerRuntime = useComposerRuntime();
  const isRecording = useComposer((c) => c.isRecording);

  const isShow = useMemo(() => {
    return isWindowReady && isRecording;
  }, [isRecording, isWindowReady]);

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
      {isShow && <VoiceVisualizer
        controls={recorderControls}
        backgroundColor="#333"
        isControlPanelShown={false}
        isDefaultUIShown={false}
        onlyRecording
        mainContainerClassName="w-full rounded-lg overflow-hidden"
        height={50} />}
    </>
  )
}

ComposerPrimitiveRecordVisualizer.displayName = "ComposerPrimitive.RecordVisualizer";