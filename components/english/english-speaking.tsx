// "use client";

// import { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { Mic, Volume2, Check, X, RefreshCw, ArrowRight } from "lucide-react";
// import { cn } from "@/lib/utils";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import type { VocabularyCard } from "@/components/vocabulary-flashcard";

// interface SpeakingPracticeProps {
//   cards: VocabularyCard[];
//   filterMode?: "all" | "unknown" | "known";
//   knownWords: number[];
//   unknownWords: number[];
// }

// export default function SpeakingPractice({
//   cards,
//   filterMode = "all",
//   knownWords,
//   unknownWords,
// }: SpeakingPracticeProps) {
//   const [filteredCards, setFilteredCards] = useState<VocabularyCard[]>([]);
//   const [currentCardIndex, setCurrentCardIndex] = useState(0);
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [feedback, setFeedback] = useState<"correct" | "incorrect" | "">("");
//   const [pronunciationScore, setPronunciationScore] = useState(0);
//   const [completedWords, setCompletedWords] = useState<number[]>([]);
//   const [showDefinition, setShowDefinition] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const recognitionRef = useRef<any>(null);
//   const progress =
//     filteredCards.length > 0 ? ((currentCardIndex + 1) / filteredCards.length) * 100 : 0;

//   // Filter cards based on mode
//   useEffect(() => {
//     let filtered: VocabularyCard[] = [];

//     if (filterMode === "all") {
//       filtered = cards;
//     } else if (filterMode === "unknown") {
//       filtered = cards.filter((card) => unknownWords.includes(card.id));
//     } else if (filterMode === "known") {
//       filtered = cards.filter((card) => knownWords.includes(card.id));
//     }

//     setFilteredCards(filtered);
//     setCurrentCardIndex(0);
//     setShowDefinition(false);
//     setTranscript("");
//     setFeedback("");
//   }, [cards, knownWords, unknownWords, filterMode]);

//   const currentCard = filteredCards[currentCardIndex] || {
//     id: 0,
//     word: "Không có từ nào",
//     definition: "Không có từ nào trong danh sách này.",
//     example: "",
//   };

//   // Initialize speech recognition
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//       if (SpeechRecognition) {
//         recognitionRef.current = new SpeechRecognition();
//         recognitionRef.current.continuous = false;
//         recognitionRef.current.interimResults = false;
//         recognitionRef.current.lang = "en-US"; // Set to English for vocabulary practice

//         recognitionRef.current.onresult = (event: any) => {
//           const speechResult = event.results[0][0].transcript.toLowerCase();
//           const confidence = event.results[0][0].confidence;
//           setTranscript(speechResult);

//           // Compare with current word
//           const currentWord = currentCard.word.toLowerCase();
//           const isCorrect =
//             speechResult === currentWord ||
//             speechResult.includes(currentWord) ||
//             currentWord.includes(speechResult) ||
//             calculateSimilarity(speechResult, currentWord) > 0.7;

//           setFeedback(isCorrect ? "correct" : "incorrect");

//           // Calculate score based on confidence and similarity
//           const similarity = calculateSimilarity(speechResult, currentWord);
//           const score = Math.round((similarity * 0.7 + confidence * 0.3) * 100);
//           setPronunciationScore(score);

//           if (isCorrect && !completedWords.includes(currentCard.id)) {
//             setCompletedWords([...completedWords, currentCard.id]);
//           }
//         };

//         recognitionRef.current.onerror = (event: any) => {
//           setIsListening(false);
//           if (event.error === "no-speech") {
//             setError("Không nghe thấy giọng nói. Vui lòng thử lại.");
//           } else if (event.error === "audio-capture") {
//             setError("Không tìm thấy microphone. Vui lòng kiểm tra thiết bị của bạn.");
//           } else if (event.error === "not-allowed") {
//             setError(
//               "Trình duyệt không cho phép truy cập microphone. Vui lòng cấp quyền và thử lại."
//             );
//           } else {
//             setError(`Lỗi: ${event.error}`);
//           }
//           setTimeout(() => setError(null), 3000);
//         };

//         recognitionRef.current.onend = () => {
//           setIsListening(false);
//         };
//       } else {
//         setError(
//           "Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng sử dụng Chrome, Edge hoặc Safari."
//         );
//       }
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.abort();
//       }
//     };
//   }, [currentCard.id, currentCard.word, completedWords]);

//   const startListening = () => {
//     setTranscript("");
//     setFeedback("");
//     setError(null);

//     try {
//       recognitionRef.current.start();
//       setIsListening(true);
//     } catch (err) {
//       console.error("Speech recognition error:", err);
//       setError("Có lỗi khi khởi động nhận dạng giọng nói. Vui lòng thử lại.");
//       setIsListening(false);
//     }
//   };

//   const stopListening = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     }
//   };

//   const playAudio = () => {
//     if (currentCard.audio_url) {
//       const audio = new Audio(currentCard.audio_url);
//       audio.play();
//     } else if ("speechSynthesis" in window) {
//       // Use text-to-speech if no audio URL is available
//       const utterance = new SpeechSynthesisUtterance(currentCard.word);
//       utterance.lang = "en-US";
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const nextCard = () => {
//     if (currentCardIndex < filteredCards.length - 1) {
//       setCurrentCardIndex(currentCardIndex + 1);
//       setTranscript("");
//       setFeedback("");
//       setShowDefinition(false);
//     }
//   };

//   const resetCard = () => {
//     setTranscript("");
//     setFeedback("");
//   };

//   const toggleDefinition = () => {
//     setShowDefinition(!showDefinition);
//   };

//   // Calculate similarity between two strings (Levenshtein distance based)
//   const calculateSimilarity = (str1: string, str2: string): number => {
//     const track = Array(str2.length + 1)
//       .fill(null)
//       .map(() => Array(str1.length + 1).fill(null));

//     for (let i = 0; i <= str1.length; i += 1) {
//       track[0][i] = i;
//     }

//     for (let j = 0; j <= str2.length; j += 1) {
//       track[j][0] = j;
//     }

//     for (let j = 1; j <= str2.length; j += 1) {
//       for (let i = 1; i <= str1.length; i += 1) {
//         const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
//         track[j][i] = Math.min(
//           track[j][i - 1] + 1, // deletion
//           track[j - 1][i] + 1, // insertion
//           track[j - 1][i - 1] + indicator // substitution
//         );
//       }
//     }

//     const distance = track[str2.length][str1.length];
//     const maxLength = Math.max(str1.length, str2.length);
//     return maxLength > 0 ? 1 - distance / maxLength : 1;
//   };

//   if (filteredCards.length === 0) {
//     return (
//       <Card className="text-center p-6">
//         <CardTitle className="mb-4">Không có từ nào</CardTitle>
//         <CardDescription>
//           {filterMode === "unknown"
//             ? "Bạn chưa đánh dấu từ nào là chưa biết."
//             : filterMode === "known"
//               ? "Bạn chưa đánh dấu từ nào là đã biết."
//               : "Không có từ nào trong danh sách."}
//         </CardDescription>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {error && (
//         <Alert variant="destructive">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <Mic className="mr-2 h-5 w-5" />
//                 Luyện nói
//                 {filterMode === "unknown" && (
//                   <Badge className="ml-2" variant="destructive">
//                     Chưa biết
//                   </Badge>
//                 )}
//                 {filterMode === "known" && (
//                   <Badge className="ml-2" variant="secondary">
//                     Đã biết
//                   </Badge>
//                 )}
//               </div>
//               <div className="text-sm font-normal">
//                 {currentCardIndex + 1}/{filteredCards.length}
//               </div>
//             </CardTitle>
//             <CardDescription>Nhấn nút microphone và đọc từ vựng</CardDescription>
//           </CardHeader>

//           <CardContent>
//             <div className="flex flex-col items-center justify-center space-y-6">
//               {/* Word display */}
//               <div className="text-center">
//                 <h3 className="text-3xl font-bold mb-2">{currentCard.word}</h3>
//                 <div className="flex items-center justify-center gap-2">
//                   <p className="text-gray-400">{currentCard.phonetic}</p>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 rounded-full"
//                     onClick={playAudio}
//                   >
//                     <Volume2 className="h-4 w-4" />
//                     <span className="sr-only">Phát âm thanh</span>
//                   </Button>
//                 </div>
//                 {currentCard.word_type && (
//                   <Badge variant="outline" className="mt-2">
//                     {currentCard.word_type}
//                   </Badge>
//                 )}
//               </div>

//               {/* Microphone button */}
//               <div className="flex justify-center">
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   animate={
//                     isListening
//                       ? {
//                           scale: [1, 1.1, 1],
//                           transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
//                         }
//                       : {}
//                   }
//                 >
//                   <Button
//                     size="lg"
//                     className={cn(
//                       "rounded-full h-16 w-16 flex items-center justify-center",
//                       isListening ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
//                     )}
//                     onClick={isListening ? stopListening : startListening}
//                   >
//                     <Mic className="h-6 w-6" />
//                   </Button>
//                 </motion.div>
//               </div>

//               {/* Transcript and feedback */}
//               {transcript && (
//                 <div className="w-full max-w-md">
//                   <div className="text-center mb-4">
//                     <p className="text-lg font-medium">Bạn đã nói:</p>
//                     <p
//                       className={cn(
//                         "text-xl",
//                         feedback === "correct"
//                           ? "text-green-500"
//                           : feedback === "incorrect"
//                             ? "text-red-500"
//                             : ""
//                       )}
//                     >
//                       {transcript}
//                     </p>
//                   </div>

//                   {feedback && (
//                     <div className="flex flex-col items-center space-y-4">
//                       <div
//                         className={cn(
//                           "flex items-center justify-center rounded-full h-12 w-12",
//                           feedback === "correct"
//                             ? "bg-green-100 text-green-600"
//                             : "bg-red-100 text-red-600"
//                         )}
//                       >
//                         {feedback === "correct" ? (
//                           <Check className="h-6 w-6" />
//                         ) : (
//                           <X className="h-6 w-6" />
//                         )}
//                       </div>

//                       <div className="text-center">
//                         <p className="font-medium mb-1">
//                           {feedback === "correct" ? "Tuyệt vời!" : "Hãy thử lại!"}
//                         </p>
//                         <p className="text-sm text-gray-500">Độ chính xác: {pronunciationScore}%</p>
//                       </div>

//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm" onClick={resetCard}>
//                           <RefreshCw className="mr-2 h-4 w-4" />
//                           Thử lại
//                         </Button>
//                         <Button variant="outline" size="sm" onClick={toggleDefinition}>
//                           {showDefinition ? "Ẩn định nghĩa" : "Xem định nghĩa"}
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Definition (conditionally shown) */}
//               {showDefinition && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   className="w-full max-w-md border rounded-lg p-4 mt-4"
//                 >
//                   <div className="space-y-3">
//                     <div>
//                       <h4 className="font-medium mb-1">Định nghĩa:</h4>
//                       <p className="text-gray-600">{currentCard.definition}</p>
//                       {currentCard.translation && (
//                         <p className="text-gray-400 italic mt-1">({currentCard.translation})</p>
//                       )}
//                     </div>

//                     <div>
//                       <h4 className="font-medium mb-1">Ví dụ:</h4>
//                       <p className="text-gray-600 italic">&quot;{currentCard.example}&quot;</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </div>
//           </CardContent>

//           <CardFooter className="flex justify-between pt-6">
//             <div className="flex-1">
//               <Button
//                 variant="outline"
//                 className="w-full"
//                 onClick={nextCard}
//                 disabled={currentCardIndex >= filteredCards.length - 1}
//               >
//                 Từ tiếp theo
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </div>
//           </CardFooter>
//         </Card>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3, delay: 0.2 }}
//       >
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle>Tiến độ</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Progress value={progress} className="h-2" />
//             <div className="flex justify-between mt-2 text-sm text-gray-400">
//               <div>
//                 Đã luyện: {completedWords.length}/{filteredCards.length} từ
//               </div>
//               <div>
//                 Hoàn thành: {Math.round((completedWords.length / filteredCards.length) * 100)}%
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }
