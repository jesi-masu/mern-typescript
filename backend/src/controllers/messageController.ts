// backend/src/controllers/messageController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Message from "../models/messageModel";
import User from "../models/userModel"; // Make sure you have this model
import Notification from "../models/notificationModel"; // Make sure you have this model

// --- Function to create a message AND trigger notifications ---
export const createMessage = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  // Validate incoming data
  if (!name || !email || !subject || !message) {
    res.status(400).json({ mssg: "Please fill in all required fields." });
    return; // Important: use return; after sending response
  }

  try {
    // 1. Save the new message to the database
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    // 2. Create notifications for admins and personnel
    try {
      // Find all users with 'admin' or 'personnel' role
      const staffUsers = await User.find({
        role: { $in: ["admin", "personnel"] },
      }).select("_id"); // Only select the ID

      if (staffUsers.length > 0) {
        // Define the notification details
        const notificationMessage = `New contact message received from ${name}. Subject: ${subject}`;
        const notificationType = "new_contact_message"; // A unique type for these notifications

        // Prepare an array of notification documents to be created
        const notificationsToCreate = staffUsers.map((staff) => ({
          userId: staff._id, // Assign to each staff member
          message: notificationMessage,
          type: notificationType,
          // Add any other fields required by your Notification schema, potentially setting them to null or default
          // e.g., orderId: null,
          readStatus: false, // Ensure it starts as unread
        }));

        // Use insertMany for efficiency if creating multiple notifications
        await Notification.insertMany(notificationsToCreate);
        console.log(
          `Notifications created for ${staffUsers.length} staff members for new message.`
        );
      }
    } catch (notificationError) {
      // Log this error, but don't stop the process. The message was saved successfully.
      console.error(
        "Failed to create notifications for new contact message:",
        notificationError
      );
    }

    // 3. Send success response for the message creation
    res.status(201).json(newMessage);
  } catch (error: any) {
    // Handle errors during message saving
    console.error("Error creating message:", error);
    res
      .status(500)
      .json({ mssg: "Failed to send message", error: error.message });
  }
};

// --- Function to get all messages (for the admin page) ---
export const getMessages = async (req: Request, res: Response) => {
  try {
    // Find all messages and sort them by creation date, newest first
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    res
      .status(500)
      .json({ mssg: "Failed to fetch messages", error: error.message });
  }
};

// --- Function to update message status (mark as read/archive) ---
export const updateMessageStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // Expecting "read" or "archived"

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ mssg: "Invalid message ID format" });
    return;
  }

  // Validate the status value
  if (!["read", "archived"].includes(status)) {
    res.status(400).json({ mssg: "Invalid status provided" });
    return;
  }

  try {
    // Find the message by ID and update its status
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { status: status },
      { new: true } // Return the updated document
    );

    // If message not found after update attempt
    if (!updatedMessage) {
      res.status(404).json({ mssg: "Message not found" });
      return;
    }

    // Send back the updated message
    res.status(200).json(updatedMessage);
  } catch (error: any) {
    console.error("Error updating message status:", error);
    res
      .status(500)
      .json({ mssg: "Failed to update message status", error: error.message });
  }
};

// --- Function to delete a message ---
export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ mssg: "Invalid message ID format" });
    return;
  }

  try {
    // Find the message by ID and delete it
    const deletedMessage = await Message.findByIdAndDelete(id);

    // If message not found
    if (!deletedMessage) {
      res.status(404).json({ mssg: "Message not found" });
      return;
    }

    // Send back the deleted message confirmation
    res.status(200).json(deletedMessage);
  } catch (error: any) {
    console.error("Error deleting message:", error);
    res
      .status(500)
      .json({ mssg: "Failed to delete message", error: error.message });
  }
};
