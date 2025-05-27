import { AppendMessage, PendingAttachment } from "../../types";
import { AttachmentAdapter } from "../adapters/attachment";
import { ThreadComposerRuntimeCore } from "../core/ComposerRuntimeCore";
import { ThreadRuntimeCore } from "../core/ThreadRuntimeCore";
import { BaseComposerRuntimeCore } from "./BaseComposerRuntimeCore";
import { RecordAdapter } from "../adapters/record";

export class DefaultThreadComposerRuntimeCore
  extends BaseComposerRuntimeCore
  implements ThreadComposerRuntimeCore {
  private _canCancel = false;
  public get canCancel() {
    return this._canCancel;
  }

  public override get attachments(): readonly PendingAttachment[] {
    return super.attachments as readonly PendingAttachment[];
  }

  protected getAttachmentAdapter() {
    return this.runtime.adapters?.attachments;
  }

  constructor(
    private runtime: Omit<ThreadRuntimeCore, "composer"> & {
      adapters?: {
        attachments?: AttachmentAdapter | undefined;
        record?: RecordAdapter | undefined;
      } | undefined;
    },
  ) {
    super();
    this.connect();
  }

  public connect() {
    return this.runtime.subscribe(() => {
      if (this.canCancel !== this.runtime.capabilities.cancel) {
        this._canCancel = this.runtime.capabilities.cancel;
        this._notifySubscribers();
      }
    });
  }

  public async handleSend(
    message: Omit<AppendMessage, "parentId" | "sourceId">,
  ) {
    this.runtime.append({
      ...(message as AppendMessage),
      parentId: this.runtime.messages.at(-1)?.id ?? null,
      sourceId: null,
    });
  }

  public async handleCancel() {
    this.runtime.cancelRun();
  }

  protected getRecordAdapter() {
    return this.runtime.adapters?.record;
  }
}
