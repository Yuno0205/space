"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookText, Check, X, ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type VocabularyCard = {
  id: number;
  word: string;
  definition: string;
  example: string;
  pronunciation: string;
  saved: boolean;
};

export function VocabularyPractice({ vocabularies }: { vocabularies: any[] }) {
  const [cards, setCards] = useState<VocabularyCard[]>([
    {
      id: 1,
      word: "Ambiguous",
      definition: "Open to more than one interpretation; not having one obvious meaning.",
      example: "The instructions were ambiguous and confusing.",
      pronunciation: "/æmˈbɪɡjuəs/",
      saved: false,
    },
    {
      id: 2,
      word: "Benevolent",
      definition: "Well meaning and kindly.",
      example: "A benevolent smile.",
      pronunciation: "/bəˈnɛvələnt/",
      saved: true,
    },
    {
      id: 3,
      word: "Conundrum",
      definition: "A confusing and difficult problem or question.",
      example: "She faced the conundrum of choosing between her career and family.",
      pronunciation: "/kəˈnʌndrəm/",
      saved: false,
    },
    {
      id: 4,
      word: "Diligent",
      definition: "Having or showing care and conscientiousness in one's work or duties.",
      example: "She was diligent in her studies.",
      pronunciation: "/ˈdɪlɪdʒənt/",
      saved: false,
    },
    {
      id: 5,
      word: "Ephemeral",
      definition: "Lasting for a very short time.",
      example: "The ephemeral nature of fashion trends.",
      pronunciation: "/ɪˈfɛm(ə)rəl/",
      saved: true,
    },
  ]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<number[]>([]);
  const [unknownWords, setUnknownWords] = useState<number[]>([]);

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const markAsKnown = () => {
    if (!knownWords.includes(currentCard.id)) {
      setKnownWords([...knownWords, currentCard.id]);
    }
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

  const toggleSaved = () => {
    const updatedCards = [...cards];
    updatedCards[currentCardIndex].saved = !updatedCards[currentCardIndex].saved;
    setCards(updatedCards);
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
              className="w-full max-w-md aspect-[3/2] relative cursor-pointer"
              onClick={flipCard}
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
              style={{ perspective: 1000 }}
            >
              {/* Front of card */}
              <div
                className={cn(
                  "absolute inset-0 backface-hidden rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col items-center justify-center",
                  isFlipped ? "invisible" : "visible"
                )}
              >
                <h3 className="text-3xl font-bold mb-2">{currentCard.word}</h3>
                <p className="text-gray-400">{currentCard.pronunciation}</p>
                <div className="absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaved();
                    }}
                    className="h-8 w-8"
                  >
                    {currentCard.saved ? (
                      <BookmarkCheck className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-4">Nhấp để xem định nghĩa</p>
              </div>

              {/* Back of card */}
              <div
                className={cn(
                  "absolute inset-0  rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col",
                  isFlipped ? "visible" : "invisible"
                )}
                style={{ transform: "rotateY(-180deg)" }}
              >
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Định nghĩa:</h4>
                  <p className="text-gray-300 mb-4">{currentCard.definition}</p>
                  <h4 className="font-medium mb-2">Ví dụ:</h4>
                  <p className="text-gray-300 italic">&quot;{currentCard.example}&quot;</p>
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
