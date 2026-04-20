"use client";

import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useCallback, useRef } from "react";

export default function ClientComponent({ accessToken }: { accessToken: string }) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  // optional: use configId from environment variable
  const configId = process.env["NEXT_PUBLIC_HUME_CONFIG_ID"];

  interface VoiceProviderError {
    message: string;
    code?: string;
    type?: string;
  }

  const onError = useCallback((error: VoiceProviderError) => {
    if (error.type === "socket_error" && error.message === "Socket is not open") {
      console.warn("WebSocket is already closed. Ignoring further actions.");
    }
  }, []);

  const onMessage = useCallback(() => {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }

    timeout.current = window.setTimeout(() => {
      if (ref.current && "scrollHeight" in ref.current && "scrollTo" in ref.current) {
        ref.current.scrollTo({
          top: ref.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 200);
  }, []);

  return (
    <div className={"relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px] "}>
      <VoiceProvider
        auth={{ type: "accessToken", value: accessToken }}
        configId={configId}
        onError={onError}
        onMessage={onMessage}
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall />
      </VoiceProvider>
    </div>
  );
}
