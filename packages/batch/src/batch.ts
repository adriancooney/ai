import { LanguageModelV2, LanguageModelV3 } from '@ai-sdk/provider';
import { StandardSchemaV1 } from '@ai-sdk/provider-utils';
import { generateText, GenerateTextResult, Output, ToolSet } from 'ai';

export type BatchRequest<
  CURSOR extends StandardSchemaV1,
  METADATA extends StandardSchemaV1,
  REQUEST,
> = {
  cursor: StandardSchemaV1.InferOutput<CURSOR>;
  metadata: StandardSchemaV1.InferOutput<METADATA>;
  request: REQUEST;
};

export type BatchResponse<
  CURSOR extends StandardSchemaV1,
  METADATA extends StandardSchemaV1,
  RESPONSE,
> = {
  cursor: StandardSchemaV1.InferOutput<CURSOR>;
  metadata: StandardSchemaV1.InferOutput<METADATA>;
  response: RESPONSE;
};

export interface Batch<CURSOR extends StandardSchemaV1> {
  build(options: {
    model?: LanguageModelV2 | LanguageModelV3;
    store?: BatchStore<CURSOR>;
    batchId?: string;
    abortSignal?: AbortSignal;
  }): Promise<void>;
  process(options: {
    model?: LanguageModelV2 | LanguageModelV3;
    store?: BatchStore<CURSOR>;
    batchId?: string;
    abortSignal: AbortSignal;
  }): Promise<void>;
}

export type BatchPage<CURSOR extends StandardSchemaV1> = {
  createdAt: number;
  cursorStart: StandardSchemaV1.InferOutput<CURSOR>;
  cursorEnd: StandardSchemaV1.InferOutput<CURSOR>;
  index: number;
  id: string;
};

interface BatchStoreOperationOptions {
  abortSignal?: AbortSignal;
}

export interface BatchStore<CURSOR extends StandardSchemaV1> {
  createBatchPage(
    options: BatchStoreOperationOptions & BatchPage<CURSOR>,
  ): Promise<BatchPage<CURSOR>>;
  updateBatchPageById(
    options: BatchStoreOperationOptions & {
      id: string;
      status: 'submitted' | 'processed' | 'errored';
    },
  ): Promise<void>;
  findLatestBatchPageByBatchId(
    options: BatchStoreOperationOptions & { batchId: string },
  ): Promise<BatchPage<CURSOR> | null>;
  queryBatchPages(
    options: BatchStoreOperationOptions & {
      batchIds?: string[];
      statuses: string[];
    },
  ): Promise<BatchPage<CURSOR>[]>;
}

export interface BatchOptions<
  CURSOR extends StandardSchemaV1,
  METADATA extends StandardSchemaV1,
  REQUEST,
  RESPONSE,
> {
  model?: LanguageModelV2 | LanguageModelV3;
  store?: BatchStore<CURSOR>;
  cursorSchema?: CURSOR;
  metadataSchema?: METADATA;
  batchPageSize?: number;

  buildRequests(options: {
    abortSignal?: AbortSignal;
    cursor?: StandardSchemaV1.InferOutput<CURSOR>;
  }): AsyncIterableIterator<BatchRequest<CURSOR, METADATA, REQUEST>>;

  processResponse(
    options: BatchResponse<CURSOR, METADATA, RESPONSE> & {
      abortSignal: AbortSignal;
    },
  ): Promise<void>;

  onProviderBatchError?: (error: unknown) => unknown;
  onProcessResponseError?: (error: unknown) => unknown;
}

export type GenerateTextBatchRequest = Omit<
  Parameters<typeof generateText>[0],
  'model'
>;

export type GenerateTextBatchResponse<
  CURSOR extends StandardSchemaV1,
  METADATA extends StandardSchemaV1,
  TOOLS extends ToolSet,
  OUTPUT extends Output.Output,
> = GenerateTextResult<TOOLS, OUTPUT> & {
  cursor: StandardSchemaV1.InferOutput<CURSOR>;
  metadata: StandardSchemaV1.InferOutput<METADATA>;
};

export function createGenerateTextBatch<
  CURSOR extends StandardSchemaV1,
  METADATA extends StandardSchemaV1,
  TOOLS extends ToolSet,
  OUTPUT extends Output.Output,
>(
  options: BatchOptions<
    CURSOR,
    METADATA,
    GenerateTextBatchRequest,
    GenerateTextBatchResponse<CURSOR, METADATA, TOOLS, OUTPUT>
  >,
): Batch<CURSOR> {
  const defaultBatchId = 'default';
  const batchPageSize = options.batchPageSize || 100;

  async function submitBatchPage(
    store: BatchStore<CURSOR>,
    model: LanguageModelV2 | LanguageModelV3,
    index: number,
    requests: BatchRequest<CURSOR, METADATA, GenerateTextBatchRequest>[],
    abortSignal?: AbortSignal,
  ): Promise<BatchPage<CURSOR>> {
    if (!model.doCreateBatch) {
      throw new Error(`Provider does not support batching`);
    }

    const { batchId } = await model.doCreateBatch({
      requests,
      abortSignal,
    });

    const cursorStart = requests[0].cursor;
    const cursorEnd = requests[requests.length - 1].cursor;

    return await store.createBatchPage({
      abortSignal,
      id: batchId,
      cursorStart,
      cursorEnd,
      createdAt: Date.now(),
      index,
    });
  }

  return {
    async build({
      store: inputStore,
      model: inputModel,
      batchId = defaultBatchId,
      abortSignal,
    }) {
      const store = inputStore || options.store;
      const model = inputModel || options.model;

      if (!store) {
        throw new Error(`No batch store provided, cannot build batch`);
      }

      if (!model) {
        throw new Error(`No model provided, cannot build batch`);
      }

      let latestBatchPage = await store.findLatestBatchPageByBatchId({
        abortSignal,
        batchId,
      });

      let requests: BatchRequest<CURSOR, METADATA, GenerateTextBatchRequest>[] =
        [];

      const requestIterator = options.buildRequests({
        cursor: latestBatchPage?.cursorEnd,
        abortSignal,
      });

      for await (const request of requestIterator) {
        requests.push(request);

        if (requests.length === batchPageSize) {
          latestBatchPage = await submitBatchPage(
            store,
            model,
            latestBatchPage ? latestBatchPage.index + 1 : 0,
            requests,
            abortSignal,
          );

          requests = [];
        }
      }

      if (requests.length) {
        await submitBatchPage(
          store,
          model,
          latestBatchPage ? latestBatchPage.index + 1 : 0,
          requests,
          abortSignal,
        );
      }
    },

    async process({
      store: inputStore,
      model: inputModel,
      batchId = defaultBatchId,
      abortSignal,
    }) {
      let unprocessedBatchPages: BatchPage<CURSOR>[];
      const store = inputStore || options.store;
      const model = inputModel || options.model;

      if (!store) {
        throw new Error(`No batch store provided, cannot process batch`);
      }

      if (!model) {
        throw new Error(`No model provided, cannot process batch`);
      }

      while (
        (unprocessedBatchPages = await store.queryBatchPages({
          abortSignal,
          batchIds: [batchId],
          statuses: ['unprocessed'],
        })).length > 0
      ) {
        if (abortSignal.aborted) {
          return;
        }

        await Promise.all(
          unprocessedBatchPages.map(async batchPage => {
            if (!model.doGetBatchStatus || !model.doGetBatchResults) {
              throw new Error(`Provider does not support batching`);
            }

            const batchPageProviderStatus = await model.doGetBatchStatus({
              abortSignal,
              batchId: batchPage.id,
            });

            if (batchPageProviderStatus.status === 'pending') {
              return;
            }

            if (batchPageProviderStatus.status === 'error') {
              await store.updateBatchPageById({
                abortSignal,
                id: batchPage.id,
                status: 'errored',
              });

              options.onProviderBatchError?.(
                new Error(batchPageProviderStatus.error),
              );

              return;
            }

            const resultIterator = model.doGetBatchResults({
              abortSignal,
              batchId: batchPage.id,
            });

            for await (const result of resultIterator) {
              const { cursor, metadata } = await parseProvideResultMetadata(
                options,
                result.metadata,
              );

              try {
                await options.processResponse({
                  abortSignal,
                  metadata,
                  cursor,
                  response: result.response as GenerateTextBatchResponse<
                    CURSOR,
                    METADATA,
                    TOOLS,
                    OUTPUT
                  >,
                });
              } catch (err) {
                if (options.onProcessResponseError) {
                  options.onProcessResponseError(err);
                } else {
                  console.error(
                    `Failed to process response in batch page '${batchPage.id}' in batch '${batchId}'`,
                  );
                }
              }
            }
          }),
        );
      }
    },
  };
}

async function parseProvideResultMetadata<
  CURSOR extends StandardSchemaV1,
  METADATA extends StandardSchemaV1,
>(
  options: { cursorSchema?: CURSOR; metadataSchema?: METADATA },
  resultMetadata: unknown,
): Promise<{
  cursor: StandardSchemaV1.InferOutput<CURSOR>;
  metadata: StandardSchemaV1.InferOutput<METADATA>;
}> {
  if (
    typeof resultMetadata === 'object' &&
    resultMetadata !== null &&
    'cursor' in resultMetadata &&
    'metadata' in resultMetadata
  ) {
    return {
      cursor: options.cursorSchema
        ? await options.cursorSchema['~standard'].validate(
            resultMetadata.cursor,
          )
        : resultMetadata.cursor,
      metadata: options.metadataSchema
        ? await options.metadataSchema['~standard'].validate(
            resultMetadata.metadata,
          )
        : resultMetadata.metadata,
    };
  }

  throw new Error(`Unable to parse provider result metadata`);
}

// export function createEmbedBatch<
//   CURSOR extends StandardSchemaV1,
//   METADATA extends StandardSchemaV1,
// >(options: BatchOptions<CURSOR, METADATA>): Batch {}

export function* generateTextInBatch(
  options: GenerateTextBatchRequest,
): IterableIterator<GenerateTextBatchRequest> {
  yield options;
}
