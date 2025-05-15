import { useVoice } from "@humeai/voice-react";
import { Mic, MicOff, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";
import { useCallback, useState, useRef } from "react"; // Added useState and useRef
import MicFFT from "./MicFFT";

export default function Controls() {
  const { disconnect, status, isMuted, unmute, mute, micFft } = useVoice();
  const [isDisconnecting, setIsDisconnecting] = useState(false); // New state
  const timeout = useRef<number | null>(null);

  const handlePressedChange = useCallback(() => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  }, [isMuted, mute, unmute]);

  const handleDisconnect = useCallback(() => {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
      timeout.current = null;
    }
    if (status.value === "connected") {
      setIsDisconnecting(true); // Set disconnecting state
      try {
        disconnect();
        setIsDisconnecting(false);
        // Optionally, add UI feedback here ("Call Ended")
      } catch (error) {
        setIsDisconnecting(false);
        console.error("Error disconnecting:", error);
        // Display error to the user
      }
    } else {
      console.warn("WebSocket is already closed.");
      // Optionally, add UI feedback here ("Call already ended")
    }
  }, [disconnect, status.value, timeout]);

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
              disabled={isDisconnecting} // Disable during disconnect
            >
              <span>
                <Phone className={"size-4 opacity-50"} strokeWidth={2} stroke={"currentColor"} />
              </span>
              {isDisconnecting ? "Ending Call..." : "End Call"} {/* Show "Ending Call..." */}
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
