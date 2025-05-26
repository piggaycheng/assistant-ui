"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/createActionButton";
import { useCallback } from "react";
import { useComposer, useComposerRuntime } from "../../context";

const useComposerRecord = ({
  // realtime = false,
}: {
  /** allow realtime audio to text */
  realtime?: boolean | undefined;
} = {}) => {
  const disabled = useComposer((c) => !c.isEditing);

  const composerRuntime = useComposerRuntime();
  const callback = useCallback(() => {
    // 開始錄音的 function
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("瀏覽器不支援錄音功能");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];
        mediaRecorder.start();
        // 可以將 mediaRecorder 儲存到 composerRuntime 或 state 以便後續停止錄音
        composerRuntime.setRecorder(mediaRecorder);
        composerRuntime.setAudioChunks(audioChunks);
        
        console.log(composerRuntime.getState())
      })
      .catch((err) => {
        alert("無法啟動錄音：" + err.message);
      });
  }, [composerRuntime]);

  if (disabled) return null;
  return callback;
};

export namespace ComposerPrimitiveRecord {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useComposerRecord>;
}

export const ComposerPrimitiveRecord = createActionButton(
  "ComposerPrimitive.Record",
  useComposerRecord,
  ["realtime"],
);
