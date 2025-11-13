import {
  BatchModelV1,
  LanguageModelV2,
  LanguageModelV3,
} from '@ai-sdk/provider';
import { generateText, GenerateTextResult, Output, ToolSet } from 'ai';
import { InfiniteBatch } from './infinite-batch';

export type BatchStatus = 'pending' | 'ready' | 'processed' | 'error';
export type BatchMetadata = Record<string, unknown>;

export interface Batch<METADATA extends BatchMetadata = BatchMetadata> {
  id: string;
  status: BatchStatus;
  metadata: METADATA;
}

export interface BatchStoreOperationOptions {
  abortSignal?: AbortSignal;
}

export type BatchRequestGenerateText = Omit<
  Parameters<typeof generateText>[0],
  'model'
> & {
  id: string;
};

export type BatchRequest<MODEL extends BatchModelV1> = MODEL extends
  | LanguageModelV2
  | LanguageModelV3
  ? BatchRequestGenerateText
  : never;

export type BatchResponseGenerateText<
  TOOLS extends ToolSet,
  OUTPUT extends Output.Output,
> = GenerateTextResult<TOOLS, OUTPUT> & {
  id: string;
};

export type BatchResponse<
  MODEL extends BatchModelV1,
  TOOLS extends ToolSet = ToolSet,
  OUTPUT extends Output.Output = Output.Output,
> = MODEL extends LanguageModelV2 | LanguageModelV3
  ? BatchResponseGenerateText<TOOLS, OUTPUT>
  : never;

export type InferBatchResponse<IF extends InfiniteBatch<any, any, any, any>> =
  IF extends InfiniteBatch<any, infer M, infer T, infer O>
    ? BatchResponse<M, T, O>
    : never;

export interface BatchBufferer {
  pushRequest<MODEL extends BatchModelV1>(
    model: MODEL,
    batchId: string,
    request: BatchRequest<MODEL>,
    options?: { abortSignal?: AbortSignal },
  ): Promise<void>;
}
