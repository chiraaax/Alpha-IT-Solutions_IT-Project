// // import express from "express";
// import SuccessOrder from "../models/OrderManagement/SuccessOrder.js";

// export const create = async (req, res) => {
//   try {
//     const newSuccessOrder = new SuccessOrder(req.body);
//     const { orderId } = newSuccessOrder;

//     const orderExist = await SuccessOrder.findOne({ orderId });
//     if (orderExist) {
//       return res.status(400).json({ message: "order already exists." });
//     }
//     const savedData = await newSuccessOrder.save();
//     // res.status(200).json(savedData);
//     res.status(200).json({ message: "order created successfully." });
//   } catch (error) {
//     res.status(500).json({ errorMessage: error.message });
//   }
// };


// // export const getAllUsers = async (req, res) => {
// //   try {
// //     const userData = await User.find();
// //     if (!userData || userData.length === 0) {
// //       return res.status(404).json({ message: "User data not found." });
// //     }
// //     res.status(200).json(userData);
// //   } catch (error) {
// //     res.status(500).json({ errorMessage: error.message });
// //   }
// // };

// // export const getUserById = async (req, res) => {
// //   try {
// //     const id = req.params.id;
// //     const userExist = await User.findById(id);
// //     if (!userExist) {
// //       return res.status(404).json({ message: "User not found." });
// //     }
// //     res.status(200).json(userExist);
// //   } catch (error) {
// //     res.status(500).json({ errorMessage: error.message });
// //   }
// // };

// // export const update = async (req, res) => {
// //   try {
// //     const id = req.params.id;
// //     const userExist = await User.findById(id);
// //     if (!userExist) {
// //       return res.status(404).json({ message: "User not found." });
// //     }
// //     const updatedData = await User.findByIdAndUpdate(id, req.body, {
// //       new: true,
// //     });
// //     // res.status(200).json(updatedData);
// //     res.status(200).json({ message: "User Updated successfully." });
// //   } catch (error) {
// //     res.status(500).json({ errorMessage: error.message });
// //   }
// // };

// // export const deleteUser = async (req, res) => {
// //   try {
// //     const id = req.params.id;
// //     const userExist = await User.findById(id);
// //     if (!userExist) {
// //       return res.status(404).json({ message: "User not found." });
// //     }
// //     await User.findByIdAndDelete(id);
// //     res.status(200).json({ message: "User deleted successfully." });
// //   } catch (error) {
// //     res.status(500).json({ errorMessage: error.message });
// //   }
// // };