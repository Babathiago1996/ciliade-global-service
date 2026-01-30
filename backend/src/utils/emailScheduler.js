import cron from "node-cron";
import Message from "../models/Message.js";
import { sendAcknowledgmentEmail } from "./email.js";

// Run every minute to check for messages that need acknowledgment
export const startEmailScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      const messagesToAcknowledge = await Message.find({
        acknowledgeEmailSent: false,
        createdAt: { $lte: fiveMinutesAgo },
      });
      for (const message of messagesToAcknowledge) {
        try {
          await sendAcknowledgmentEmail(message.email, message.name);
          message.acknowledgeEmailSent = true;
          await message.save();
          console.log(`✓ Acknowledgment email sent to ${message.email}`);
        } catch (error) {
          console.error(
            `✗ Failed to send email to ${message.email}:`,
            error.message,
          );
        }
      }
    } catch (error) {
      console.error("Email scheduler error:", error.message);
    }
  });

  console.log("✓ Email scheduler started");
};
