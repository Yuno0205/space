"use client";

import { Button } from "@/components/ui/button"; // Giữ lại Button
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export function SimplifiedContact() {
  const myEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const emailSubject = "Inquiry from Space Visitor";
  const emailBody = "Hello Yuno,\n\nI'm ...\n\n";

  const handleEmailButtonClick = () => {
    // Create mailto link with subject and body if provided
    const params = new URLSearchParams();
    if (emailSubject) params.append("subject", emailSubject);
    if (emailBody) params.append("body", emailBody);

    const mailtoLink = `mailto:${myEmail}?${params.toString()}`;

    // Open in a new tab/window to prevent navigation away from current page
    window.open(mailtoLink, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="rounded-2xl border border-white/10 p-8 bg-gradient-to-b from-white/5 to-transparent"
    >
      <div className="max-w-md mx-auto text-center">
        <motion.h2
          className="text-2xl md:text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Space Comms Relay {/* Hoặc "Send a Message Through the Cosmos" */}
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-8" // Tăng margin bottom
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Have something to share? Open your comms channel and email me directly!
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
          className="inline-block"
        >
          <Button
            onClick={handleEmailButtonClick}
            className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg" // Tăng padding và font size cho nút
          >
            <Send className="h-5 w-5 mr-3" /> {/* Tăng margin right cho icon */}
            Send Me an Email
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
