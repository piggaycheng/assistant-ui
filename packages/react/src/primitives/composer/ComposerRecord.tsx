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
  const isRecording = useComposer((c) => c.isRecording);

  const composerRuntime = useComposerRuntime();
  const callback = useCallback(() => {
    if (isRecording) {
      composerRuntime.stopRecord();
      return;
    }
    composerRuntime.startRecord()
  }, [composerRuntime, isRecording]);

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
