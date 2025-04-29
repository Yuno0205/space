"use client";
import { useVoice } from "@humeai/voice-react";

import { Mic, MicOff, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import MicFFT from "./MicFFT";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";
import { useCallback } from "react";

export default function Controls() {
  const { disconnect, status, isMuted, unmute, mute, micFft } = useVoice();

  const handlePressedChange = useCallback(() => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  }, [isMuted, mute, unmute]);

  const handleDisconnect = useCallback(() => {
    if (status.value !== "connected") {
      disconnect();
    } else {
      console.warn("WebSocket is already closed.");
    }
  }, [disconnect, status.value]);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full p-4 flex items-center justify-center",
        "bg-gradient-to-t from-card via-card/90 to-card/0"
      )}
    >
      <AnimatePresence>
        {status.value === "connected" ? (
          <motion.div
            initial={{
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: "100%",
              opacity: 0,
            }}
            className={
              "p-4 bg-card border border-border rounded-lg shadow-sm flex items-center gap-4"
            }
          >
            <Toggle pressed={!isMuted} onPressedChange={handlePressedChange}>
              {isMuted ? <MicOff className={"size-4"} /> : <Mic className={"size-4"} />}
            </Toggle>

            <div className={"relative grid h-8 w-48 shrink grow-0"}>
              <MicFFT fft={micFft} className={"fill-current"} />
            </div>

            <Button
              className={"flex items-center gap-1"}
              onClick={handleDisconnect}
              variant={"destructive"}
            >
              <span>
                <Phone className={"size-4 opacity-50"} strokeWidth={2} stroke={"currentColor"} />
              </span>
              <span>End Call</span>
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
