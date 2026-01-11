import {
  createPostValidation,
  updatePostValidation,
} from "../validations/post.validation.js";
import {
  createPostService,
  getPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
  toggleLikePostService,
  getRepostsService,
} from "../services/post.service.js";
import { MSG } from "../constants/messages.js";

// Create a new post
// export const createPost = async (req, res) => {
//   try {
//     const { error } = createPostValidation.validate(req.body);
// console.log(req.body);
//     const content = req.body.content?.trim();
//     const hasContent = content && content.length > 0;
//     const hasMedia = req.files && req.files.length > 0;
//     if (!hasContent && !hasMedia) {
//       return res.status(400).json({
//         success: false,
//         message: "Post must contain text or media",
//       });
//     }

//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details[0].message,
//       });
//     }


//        const media = hasMedia
//       ? req.files.map((file) => ({
//           type: file.mimetype.startsWith("video") ? "video" : "image",
//           url: file.path,
//         }))
//       : [];
//     // const result = await createPostService(req.body, req.user._id);
    
//     const result = await createPostService(
//   {
//     ...value,
//     media,
//   },
//   req.user._id
// );


//     res.status(result.success ? 201 : 400).json(result);
//   } catch (err) {
//     console.error("CREATE POST ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: MSG.ERROR.SERVER_ERROR || "Internal server error",
//     });
//   }
// };

export const createPost = async (req, res) => {
  try {
    console.log(req.body);
const { error, value } = createPostValidation.validate(req.body, {
  abortEarly: false,
  stripUnknown: true,
});
    const content = req.body.content?.trim();
    const hasContent = content && content.length > 0;
    const hasMedia = req.files && req.files.length > 0;

    // ✅ LinkedIn rule
    if (!hasContent && !hasMedia) {
      return res.status(400).json({
        success: false,
        message: "Post must contain text or media",
      });
    }

    const media = hasMedia
      ? req.files.map((file) => ({
          type: file.mimetype.startsWith("video") ? "video" : "image",
          url: file.path,
        }))
      : [];

    const result = await createPostService(
      {
        content,
        location: req.body.location || "",
        privacy: req.body.privacy || "public",
        tags: req.body.tags || [],
        mentions: req.body.mentions || [],
        media,
      },
      req.user._id
    );

    return res.status(201).json(result);
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all posts (feed)
export const getPosts = async (req, res) => {
  try {
    const {
      search,
      author,
      tags,
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {};
    if (search) filters.search = search;
    if (author) filters.author = author;
    if (tags) filters.tags = Array.isArray(tags) ? tags : [tags];

    const result = await getPostsService(filters, parseInt(page), parseInt(limit));
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR || "Internal server error",
    });
  }
};

// Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user._id : null;

    const result = await getPostByIdService(id, userId);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("GET POST BY ID ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR || "Internal server error",
    });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = updatePostValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await updatePostService(id, req.body, req.user._id);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("UPDATE POST ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR || "Internal server error",
    });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deletePostService(id, req.user._id);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("DELETE POST ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR || "Internal server error",
    });
  }
};

// Like/Unlike post
export const toggleLikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await toggleLikePostService(id, req.user._id);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("TOGGLE LIKE POST ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR || "Internal server error",
    });
  }
};

// Get reposts of a post
export const getReposts = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await getRepostsService(id, parseInt(page), parseInt(limit));
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("GET REPOSTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR || "Internal server error",
    });
  }
};









