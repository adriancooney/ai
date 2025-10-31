import { LanguageModelV2, LanguageModelV3 } from '@ai-sdk/provider';
import { StandardSchemaV1 } from '@ai-sdk/provider-utils';
import { generateText, GenerateTextResult, ToolSet } from 'ai';

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

interface Batch {
  build(options: { batchId?: string; abortSignal: AbortSignal }): Promise<void>;
  process(options: {
    batchId?: string;
    abortSignal: AbortSignal;
  }): Promise<void>;
}

type BatchPage<CURSOR extends StandardSchemaV1> = {
  createdAt: number;
  cursorStart: StandardSchemaV1.InferOutput<CURSOR>;
  cursorEnd: StandardSchemaV1.InferOutput<CURSOR>;
  index: number;
  id: string;
};

interface BatchStoreOperationOptions {
  abortSignal: AbortSignal;
}

interface BatchStore<CURSOR extends StandardSchemaV1> {
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

interface BatchOptions<
  CURSOR extends StandardSchemaV1,
  METADATA extends StandardSchemaV1,
  REQUEST,
  RESPONSE,
> {
  model: LanguageModelV2 | LanguageModelV3;
  cursorSchema: CURSOR;
  metadataSchema: METADATA;
  store: BatchStore<CURSOR>;
  batchPageSize?: number;

  buildRequests(options: {
    abortSignal: AbortSignal;
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

type GenerateTextBatchRequest = Omit<
  Parameters<typeof generateText>[0],
  'model'
>;
type GenerateTextBatchResponse<
  TOOLS extends ToolSet,
  OUTPUT,
> = GenerateTextResult<TOOLS, OUTPUT>;

export function createGenerateTextBatch<
  CURSOR extends StandardSchemaV1,
  METADATA extends StandardSchemaV1,
  TOOLS extends ToolSet,
  OUTPUT,
>(
  options: BatchOptions<
    CURSOR,
    METADATA,
    GenerateTextBatchRequest,
    GenerateTextBatchResponse<TOOLS, OUTPUT>
  >,
): Batch {
  const defaultBatchId = 'default';
  const batchPageSize = options.batchPageSize || 100;

  async function submitBatchPage(
    index: number,
    requests: BatchRequest<CURSOR, METADATA, GenerateTextBatchRequest>[],
    abortSignal: AbortSignal,
  ): Promise<BatchPage<CURSOR>> {
    if (!options.model.doCreateBatch) {
      throw new Error(`Provider does not support batching`);
    }

    const { batchId } = await options.model.doCreateBatch({
      requests,
      abortSignal,
    });

    const cursorStart = requests[0].cursor;
    const cursorEnd = requests[requests.length - 1].cursor;

    return await options.store.createBatchPage({
      abortSignal,
      id: batchId,
      cursorStart,
      cursorEnd,
      createdAt: Date.now(),
      index,
    });
  }

  return {
    async build({ batchId = defaultBatchId, abortSignal }) {
      let latestBatchPage = await options.store.findLatestBatchPageByBatchId({
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
            latestBatchPage ? latestBatchPage.index + 1 : 0,
            requests,
            abortSignal,
          );

          requests = [];
        }
      }

      if (requests.length) {
        await submitBatchPage(
          latestBatchPage ? latestBatchPage.index + 1 : 0,
          requests,
          abortSignal,
        );
      }
    },

    async process({ batchId = defaultBatchId, abortSignal }) {
      let unprocessedBatchPages: BatchPage<CURSOR>[];

      while (
        (unprocessedBatchPages = await options.store.queryBatchPages({
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
            if (
              !options.model.doGetBatchStatus ||
              !options.model.doGetBatchResults
            ) {
              throw new Error(`Provider does not support batching`);
            }

            const batchPageProviderStatus =
              await options.model.doGetBatchStatus({
                abortSignal,
                batchId: batchPage.id,
              });

            if (batchPageProviderStatus.status === 'pending') {
              return;
            }

            if (batchPageProviderStatus.status === 'error') {
              await options.store.updateBatchPageById({
                abortSignal,
                id: batchPage.id,
                status: 'errored',
              });

              options.onProviderBatchError?.(
                new Error(batchPageProviderStatus.error),
              );

              return;
            }

            const resultIterator = options.model.doGetBatchResults({
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
  options: { cursorSchema: CURSOR; metadataSchema: METADATA },
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
      cursor: await options.cursorSchema['~standard'].validate(
        resultMetadata.cursor,
      ),
      metadata: await options.metadataSchema['~standard'].validate(
        resultMetadata.metadata,
      ),
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
