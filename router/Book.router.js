import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import {
  addNewBook,
  bookDetail,
  deleteReview,
  getBooks,
  giveReview,
  searchBooks,
  updateReview,
} from "../controllers/Book.controller.js";

const router = Router();

router.route("/").post(verifyUser, addNewBook).get(getBooks);
router.route("/:id").get(bookDetail);
router.route("/:id/reviews").post(verifyUser, giveReview);
router.route("/reviews/:id").put(updateReview).delete(deleteReview);
router.route("/search").get(searchBooks);

export default router;
