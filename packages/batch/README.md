# AI SDK - Batching

# Concepts

- BatchRequest - a generation or embed request to a provider to process asynchronously
- BatchResponse - a response from a provider for a BatchRequest
- Batch - an unbounded list of requests that are processed asynchronously
  - All `Batch`s have an `id`
- BatchPage - a list of requests with size `batchPageSize`, with a start and end cursor, that are processed asynchronously
  - Batch pages are created in order
  - Batch pages may be processed out of order

# Considerations

- A batch's `processResponse` has at-least-once execution semantics. If a batch's processing is interrupted or failed to be marked
