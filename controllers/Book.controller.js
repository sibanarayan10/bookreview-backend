import { Book } from "../models/Book.model.js";
import { Rating } from "../models/Rating.model.js";
import { Review } from "../models/Review.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addNewBook = async (req, res) => {
  const user = req.user;
  const { title, price } = req.body;

  // Validate required fields
  if (!title || !price) {
    return res
      .status(400)
      .json(
        new ApiResponse(false, 400, "All fields must be filled correctly!")
      );
  }

  const userId = user._id;

  try {
    // Create a new book document
    const newBook = await Book.create({ title, author: userId, price });

    // Only select necessary fields for response
    const bookData = await Book.findById(newBook._id)
      .select("title author price")
      .populate("author", "fullname"); // Optional: populate author's name if needed

    return res.status(201).json(new ApiResponse(true, 201, "", bookData));
  } catch (error) {
    console.error("Error creating new book:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong while adding the book", error)
      );
  }
};

// getting all the books on the site
const getBooks = async (req, res) => {
  try {
    const { skip = 0, limit = 10 } = req.query; // Default pagination if not provided

    const books = await Book.find()
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("author", "fullname") // Populate author field with 'fullname' instead of returning ObjectId
      .select("title author price");

    return res
      .status(200)
      .json(new ApiResponse(true, 200, "books fetched successfully", books));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong", error));
  }
};

// user is getting the book detail
const bookDetail = async (req, res) => {
  const bookId = req.params.id;
  const { limit = 10, skip = 0 } = req.query; // Defaults if not provided

  try {
    // Fetch all ratings for the book
    const totalRatings = await Rating.find({ ratedOn: bookId }).lean();

    // Calculate total rating value
    let totalRatingCount = 0;
    for (let i = 0; i < totalRatings.length; i++) {
      totalRatingCount += totalRatings[i].rating;
    }

    // Calculate average rating with one decimal, avoid divide-by-zero
    const avgRating =
      totalRatings.length > 0
        ? (totalRatingCount / totalRatings.length).toFixed(1)
        : 0;

    // Fetch reviews with pagination
    const reviews = await Review.find({ reviewedOn: bookId })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("reviewedBy", "fullname")
      .populate("reviewedOn", "title")
      .lean();

    const result = { avgRating, reviews };

    return res
      .status(200)
      .json(new ApiResponse(true, 200, "Details fetched successfully", result));
  } catch (error) {
    console.error("Error fetching book details:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong", error));
  }
};

// user is giving a review
const giveReview = async (req, res) => {
  const { context } = req.body;
  const user = req.user;
  const bookId = req.params.id;
  console.log({ bookId: typeof bookId, id: user._id });
  try {
    const reviewExist = await Review.findOne({
      reviewedBy: user._id,
      reviewedOn: bookId,
    }); // check if user already reviewed
    if (reviewExist) {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, "You already reviewed this book"));
    }
    const createReview = await Review.create({
      context,
      reviewedBy: user._id,
      reviewedOn: bookId,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(true, 200, "Review created successfully", createReview)
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, "something went wrong", error));
  }
};
// user updating his own review
const updateReview = async (req, res) => {
  const { id } = req.params;
  const { context } = req.body;
  console.log(context);
  try {
    const review = await Review.findByIdAndUpdate(
      id,
      { context: context },
      {
        new: true,
      }
    ).select("context updatedAt");
    if (!review) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "You never reviewed on this  book"));
    }
    return res
      .status(200)
      .json(new ApiResponse(true, 200, "Review updated successfully", review));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, "something went wrong", error));
  }
};
// user deleting his/her own review
const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the review by ID
    const review = await Review.findByIdAndDelete(id);

    // If no review is found with the given ID
    if (!review) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "You never reviewed this book"));
    }

    // Successfully deleted
    return res.status(200).json(
      new ApiResponse(true, 200, "Review deleted successfully", {
        acknowledged: true,
        deletedCount: 1,
      })
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong", error));
  }
};

// user is searching for a book
const searchBooks = async (req, res) => {
  try {
    const { search } = req.query;

    // Find authors whose names match the query
    const matchingAuthors = await User.find({
      username: { $regex: search, $options: "i" },
    });

    const authorIds = matchingAuthors.map((a) => a._id);

    const books = await Book.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { author: { $in: authorIds } },
      ],
    }).populate("author", "fullname"); // populate author name

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error });
  }
};

export {
  giveReview,
  deleteReview,
  updateReview,
  bookDetail,
  getBooks,
  addNewBook,
  searchBooks,
};
