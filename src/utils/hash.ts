import xxhash from 'xxhash-wasm';

// eslint-disable-next-line antfu/no-top-level-await
const hasher = await xxhash();

export function hashBytes(bytes: Uint8Array) {
    return hasher.h32Raw(bytes).toString(16);
}
