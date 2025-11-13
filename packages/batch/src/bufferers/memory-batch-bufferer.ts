import { BatchBufferer } from '../types';
import {
  type CreateBatchBuffererOptions,
  createBatchBufferer,
} from './batch-bufferer';

interface MemoryStore {
  kv: Map<string, unknown>;
  lists: Map<string, unknown[]>;
}

function createMemoryStore(): MemoryStore {
  return {
    kv: new Map(),
    lists: new Map(),
  };
}

export function createMemoryBatchBufferer(
  options?: Omit<CreateBatchBuffererOptions, 'store'>,
): BatchBufferer {
  const memory = createMemoryStore();

  const store = {
    async get<V = unknown>(key: string): Promise<V> {
      return memory.kv.get(key) as V;
    },

    async set(key: string, value: unknown): Promise<void> {
      memory.kv.set(key, value);
    },

    async lpush(key: string, item: unknown): Promise<void> {
      const list = memory.lists.get(key) || [];

      list.unshift(item);

      memory.lists.set(key, list);
    },

    async lrange<V>(
      key: string,
      indexStart: number,
      indexEnd: number,
    ): Promise<V[]> {
      const list = memory.lists.get(key) || [];

      // Handle Redis-style negative indices
      const start = indexStart < 0 ? list.length + indexStart : indexStart;
      const end = indexEnd < 0 ? list.length + indexEnd + 1 : indexEnd + 1;

      return list.slice(start, end) as V[];
    },

    async setnx(key: string, value: unknown): Promise<boolean> {
      if (memory.kv.has(key)) {
        return false;
      }

      memory.kv.set(key, value);

      return true;
    },

    async del(key: string): Promise<void> {
      memory.kv.delete(key);
      memory.lists.delete(key);
    },
  };

  return createBatchBufferer({
    ...options,
    store,
  });
}
