"use client";

import { Button } from "@/components/ui/button"; // Giữ lại Button
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export function SimplifiedContact() {
  const myEmail = "mainhathao195@gmail.com";
  const emailSubject = "Inquiry from Space Visitor";
  const emailBody =
    "Hello Yuno,\n\nI'm reaching out from your awesome space website regarding...\n\n";

  const handleEmailButtonClick = () => {
    // Tạo mailto link
    let mailtoLink = `mailto:${myEmail}`;
    if (emailSubject) {
      mailtoLink += `?subject=${encodeURIComponent(emailSubject)}`;
      if (emailBody) {
        mailtoLink += `&body=${encodeURIComponent(emailBody)}`;
      }
    } else if (emailBody) {
      mailtoLink += `?body=${encodeURIComponent(emailBody)}`;
    }

    window.location.href = mailtoLink;
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
          Launch a Com-Signal {/* Hoặc "Send a Message Through the Cosmos" */}
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-8" // Tăng margin bottom
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Got a cosmic query or a supernova idea? Open your comms channel and send me a direct
          message via email!
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
