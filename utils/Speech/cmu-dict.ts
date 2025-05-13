import { dictionary } from "cmu-pronouncing-dictionary";

let dictionaryLoaded = false;
let loadDictionaryPromise: Promise<void> | null = null;

const loadDictionary = async (): Promise<void> => {
  if (dictionaryLoaded) return;
  if (loadDictionaryPromise) return loadDictionaryPromise;

  loadDictionaryPromise = new Promise(async (resolve, reject) => {
    try {
      // Không cần thiết phải fetch lại toàn bộ từ điển ở đây, thư viện đã xử lý
      dictionaryLoaded = true;
      resolve();
    } catch (error) {
      console.error("Failed to load CMU Pronouncing Dictionary:", error);
      dictionaryLoaded = false;
      reject(error); // Chuyển tiếp lỗi để người gọi có thể xử lý
    } finally {
      loadDictionaryPromise = null;
    }
  });
  return loadDictionaryPromise;
};
export const lookup = async (word: string): Promise<string[] | null> => {
  if (!dictionaryLoaded) {
    await loadDictionary();
  }
  const result = dictionary[word.toUpperCase()];
  return Array.isArray(result) ? result : null;
};
