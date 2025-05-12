// import { getIpaPhones } from "cmudict-ipa";
// import { wordToPhonemes } from "en-phonemes";
// import stringSimilarity from "string-similarity";

// // Interface cho kết quả đánh giá
// export interface PhonemeEvaluation {
//   word: string;
//   expectedIpa: string;
//   actualIpa: string | null;
//   score: number;
//   details: PhonemeDetail[];
// }

// export interface PhonemeDetail {
//   phoneme: string;
//   isCorrect: boolean;
// }

// /**
//  * Chuyển đổi một từ tiếng Anh sang dạng biểu diễn IPA (International Phonetic Alphabet)
//  */
// export const wordToIpa = (word: string): string => {
//   try {
//     // Thử chuyển từ thành âm vị sử dụng CMU Dictionary
//     const phonemes = wordToPhonemes(word.toLowerCase());
//     if (phonemes) {
//       // Chuyển đổi phonemes sang IPA
//       return getIpaPhones(phonemes).join("");
//     }
//   } catch (error) {
//     console.error(`Lỗi khi chuyển đổi từ "${word}" sang IPA:`, error);
//   }

//   // Nếu không thể chuyển đổi, trả về từ gốc
//   return word;
// };

// /**
//  * So sánh phát âm dựa trên IPA
//  * @param expected Từ hoặc cụm từ mẫu
//  * @param actual Từ hoặc cụm từ phát âm thực tế
//  */
// export const comparePronunciation = (expected: string, actual: string): PhonemeEvaluation[] => {
//   // Tách thành các từ
//   const expectedWords = expected.toLowerCase().trim().split(/\s+/);
//   const actualWords = actual.toLowerCase().trim().split(/\s+/);

//   // Kết quả đánh giá
//   const results: PhonemeEvaluation[] = [];

//   // Đánh giá từng từ
//   expectedWords.forEach((expectedWord, index) => {
//     // Lấy từ tương ứng trong thực tế (nếu có)
//     const actualWord = index < actualWords.length ? actualWords[index] : null;

//     // Chuyển đổi sang IPA
//     const expectedIpa = wordToIpa(expectedWord);
//     const actualIpa = actualWord ? wordToIpa(actualWord) : null;

//     // Tính điểm tương đồng
//     let score = 0;
//     const details: PhonemeDetail[] = [];

//     if (actualIpa) {
//       // Tính điểm dựa trên độ tương đồng chuỗi
//       score = stringSimilarity.compareTwoStrings(expectedIpa, actualIpa);

//       // Tạo chi tiết đánh giá cho từng âm vị
//       const expectedPhonemes = expectedIpa.split("");
//       const actualPhonemes = actualIpa.split("");

//       expectedPhonemes.forEach((phoneme, i) => {
//         details.push({
//           phoneme,
//           isCorrect: i < actualPhonemes.length && phoneme === actualPhonemes[i],
//         });
//       });
//     }

//     // Thêm vào kết quả
//     results.push({
//       word: expectedWord,
//       expectedIpa,
//       actualIpa,
//       score,
//       details,
//     });
//   });

//   return results;
// };

// /**
//  * Tính điểm tổng thể dựa trên kết quả đánh giá từng từ
//  */
// export const calculateOverallScore = (evaluations: PhonemeEvaluation[]): number => {
//   if (evaluations.length === 0) return 0;

//   const totalScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0);
//   return (totalScore / evaluations.length) * 10; // Chuyển thành thang điểm 10
// };

// /**
//  * Tính toán màu sắc dựa trên điểm số
//  */
// export const getScoreColor = (score: number): string => {
//   if (score >= 9) return "green";
//   if (score >= 7) return "limegreen";
//   if (score >= 5) return "orange";
//   if (score >= 3) return "darkorange";
//   return "red";
// };
