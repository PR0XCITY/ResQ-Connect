import { Platform } from 'react-native';

let memoryStore: Map<string, string> | null = null;

function getMemoryStore(): Map<string, string> {
	if (!memoryStore) {
		memoryStore = new Map<string, string>();
	}
	return memoryStore;
}

type StorageLike = {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): Promise<void>;
	removeItem(key: string): Promise<void>;
	clear(): Promise<void>;
};

function createWebStorage(): StorageLike {
	try {
		if (typeof window !== 'undefined' && window && window.localStorage) {
			return {
				async getItem(key: string) {
					return window.localStorage.getItem(key);
				},
				async setItem(key: string, value: string) {
					window.localStorage.setItem(key, value);
				},
				async removeItem(key: string) {
					window.localStorage.removeItem(key);
				},
				async clear() {
					window.localStorage.clear();
				}
			};
		}
	} catch {}

	// Fallback to memory
	const mem = getMemoryStore();
	return {
		async getItem(key: string) {
			return mem.has(key) ? mem.get(key)! : null;
		},
		async setItem(key: string, value: string) {
			mem.set(key, value);
		},
		async removeItem(key: string) {
			mem.delete(key);
		},
		async clear() {
			mem.clear();
		}
	};
}

function createNativeStorage(): StorageLike {
	try {
		// Lazy require to avoid bundler issues on web
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const AsyncStorage = require('@react-native-async-storage/async-storage').default as {
			getItem(key: string): Promise<string | null>;
			setItem(key: string, value: string): Promise<void>;
			removeItem(key: string): Promise<void>;
			clear(): Promise<void>;
		};
		if (AsyncStorage) {
			return AsyncStorage;
		}
	} catch {}

	// Fallback to memory if AsyncStorage not available
	const mem = getMemoryStore();
	return {
		async getItem(key: string) {
			return mem.has(key) ? mem.get(key)! : null;
		},
		async setItem(key: string, value: string) {
			mem.set(key, value);
		},
		async removeItem(key: string) {
			mem.delete(key);
		},
		async clear() {
			mem.clear();
		}
	};
}

const storageImpl: StorageLike = Platform.OS === 'web' ? createWebStorage() : createNativeStorage();

export const getItem = (key: string) => storageImpl.getItem(key);
export const setItem = (key: string, value: string) => storageImpl.setItem(key, value);
export const removeItem = (key: string) => storageImpl.removeItem(key);
export const clear = () => storageImpl.clear();

export default { getItem, setItem, removeItem, clear };


