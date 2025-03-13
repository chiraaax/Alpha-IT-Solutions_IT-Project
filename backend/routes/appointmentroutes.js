import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// Create an appointment
router.post("/", async (req, res) => {
  try {
    const {
      name, email, phone, deviceType, issueDescription, contactMethod,
      date, timeSlot, problemType, pickupOrDropoff, chipLevelRepair,
      attemptedFixes, backupData
    } = req.body;

    // Check if all required fields are filled
    if (!name || !email || !phone || !date || !timeSlot || !problemType || !pickupOrDropoff) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if an appointment already exists for the selected date and time slot
    const existingAppointment = await Appointment.findOne({ date, timeSlot });
    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked. Please choose another time." });
    }

    // Create a new appointment with all required fields
    const newAppointment = new Appointment({
      name, email, phone, deviceType, issueDescription, contactMethod,
      date, timeSlot, problemType, pickupOrDropoff, chipLevelRepair,
      attemptedFixes, backupData
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Server Error:", error); // Debugging error logs
    res.status(500).json({ message: "Server error", error });
  }
});


// Fetch all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
