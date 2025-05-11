"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, BookText, Check, Volume2, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { supabaseBrowser as supabase } from "@/lib/supabase/client";
import { VocabularyCard } from "@/types/vocabulary";

export function VocabularyPractice({ vocabularies }: { vocabularies: VocabularyCard[] }) {
  const [cards] = useState<VocabularyCard[]>(vocabularies);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<string[]>([]);
  const [unknownWords, setUnknownWords] = useState<string[]>([]);

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  async function handleKnown(id: string) {
    // Không cần cookies(), supabaseBrowser tự quản anon key
    await supabase.from("vocabularies").update({ is_learned: true }).eq("id", id);
    await supabase.from("review_queue").upsert({
      vocab_id: id,
      repetition_count: 1,
      interval_days: 1,
      easiness_factor: 2.5,
      next_review: new Date(Date.now() + 86400000).toISOString(),
    });
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const markAsKnown = () => {
    if (!knownWords.includes(currentCard.id)) {
      setKnownWords([...knownWords, currentCard.id]);
    }
    handleKnown(currentCard.id);
    nextCard();
  };

  const markAsUnknown = () => {
    if (!unknownWords.includes(currentCard.id)) {
      setUnknownWords([...unknownWords, currentCard.id]);
    }
    nextCard();
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard.audio_url) return;
    new Audio(currentCard.audio_url).play().catch(console.error);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <BookText className="mr-2 h-5 w-5" />
                Thẻ từ vựng
              </div>
              <div className="text-sm font-normal">
                {currentCardIndex + 1}/{cards.length}
              </div>
            </CardTitle>
            <CardDescription>Nhấp vào thẻ để xem định nghĩa</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-0">
            <motion.div
              className="w-full max-w-md aspect-square relative cursor-pointer"
              onClick={flipCard}
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
              style={{ perspective: 1000 }}
            >
              {/* Front of card */}
              <div
                className={cn(
                  "absolute h-full inset-0 backface-hidden rounded-xl border dark:border-white/10 border-black/20  bg-white/5 p-6 flex flex-col items-center justify-center",
                  isFlipped ? "invisible" : "visible"
                )}
              >
                <h3 className="text-3xl font-bold mb-2">{currentCard.word}</h3>
                <div className="flex items-center mb-2 gap-2">
                  <p className="text-gray-400">{currentCard.phonetic}</p>
                  {currentCard.audio_url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={(e) => playAudio(e)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {currentCard.word_type && (
                  <Badge variant="outline" className="mt-2 capitalize px-4 py-2">
                    {currentCard.word_type}
                  </Badge>
                )}
                <div className="absolute top-4 right-4"></div>
                <p className="text-sm text-gray-400 mt-4">Nhấp để xem định nghĩa</p>
              </div>

              {/* Back of card */}
              <div
                className={cn(
                  "absolute inset-0 h-full rounded-xl border dark:border-white/10 border-black/20 bg-white/5 p-6 flex flex-col",
                  isFlipped ? "visible" : "invisible"
                )}
                style={{ transform: "rotateY(-180deg)" }}
              >
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Định nghĩa:</h4>
                    <p className="text-gray-300 mb-1">{currentCard.definition}</p>
                    {currentCard.translation && (
                      <p className="text-gray-400 italic">({currentCard.translation})</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Ví dụ:</h4>
                    <p className="text-gray-300 italic">&quot;{currentCard.example}&quot;</p>
                  </div>

                  {/* Từ đồng nghĩa */}
                  {currentCard.synonyms && (
                    <div>
                      <h4 className="font-medium mb-2">Từ đồng nghĩa:</h4>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(currentCard.synonyms)
                          ? currentCard.synonyms
                          : currentCard.synonyms.split(",").map((s) => s.trim())
                        ).map((synonym, idx) => (
                          <Badge key={idx} variant="secondary" className="capitalize px-4 py-2">
                            {synonym}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Từ trái nghĩa */}
                  {currentCard.antonyms && (
                    <div>
                      <h4 className="font-medium mb-2">Từ trái nghĩa:</h4>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(currentCard.antonyms)
                          ? currentCard.antonyms
                          : currentCard.antonyms.split(",").map((s) => s.trim())
                        ).map((antonym, idx) => (
                          <Badge key={idx} variant="outline" className="capitalize px-4 py-2">
                            {antonym}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-400 text-center">Nhấp để xem từ</p>
              </div>
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-between pt-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button onClick={markAsUnknown} variant="outline" className="flex items-center">
                <X className="mr-2 h-4 w-4" />
                Chưa biết
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button onClick={nextCard} variant="outline" className="flex items-center">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button onClick={markAsKnown} variant="outline" className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Đã biết
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Tiến độ</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <div>Đã biết: {knownWords.length}</div>
              <div>Chưa biết: {unknownWords.length}</div>
              <div>Còn lại: {cards.length - currentCardIndex - 1}</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
