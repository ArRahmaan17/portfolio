const express = require("express");

const Blog = require("../models/blog.model");

const router = express.Router();
const { BLOG_CONTENT_MAX_LENGTH } = require("../models/blog.model");

const slugify = (value) => {
  if (!value) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const ensureUniqueSlug = async (baseSlug, { ignoreId } = {}) => {
  const normalized = slugify(baseSlug);
  if (!normalized) {
    return "";
  }

  let candidate = normalized;
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await Blog.findOne({ where: { slug: candidate } });
    if (!existing || (ignoreId && Number(existing.id) === Number(ignoreId))) {
      return candidate;
    }
    candidate = `${normalized}-${suffix}`;
    suffix += 1;
  }
};

const normalizeContent = (value) => String(value ?? "");

const validateContent = (value) => {
  const content = normalizeContent(value);
  if (!content.trim()) {
    return "content cannot be empty";
  }

  if (content.length > BLOG_CONTENT_MAX_LENGTH) {
    return `content cannot exceed ${BLOG_CONTENT_MAX_LENGTH} characters`;
  }

  return "";
};

router.get("/", async (_req, res, next) => {
  try {
    const blogs = await Blog.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json({
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ where: { slug: req.params.slug } });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const rawSlug = req.body.slug || title;

    if (!title || !content) {
      return res.status(400).json({
        message: "title and content are required",
      });
    }

    const contentError = validateContent(content);
    if (contentError) {
      return res.status(400).json({ message: contentError });
    }

    const slug = await ensureUniqueSlug(rawSlug);
    if (!slug) {
      return res.status(400).json({
        message: "slug is invalid",
      });
    }

    const publishedAtRaw = req.body.published_at ?? req.body.publishedAt;
    let published_at = null;
    if (publishedAtRaw) {
      const parsed = new Date(publishedAtRaw);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({ message: "published_at must be a valid date" });
      }
      published_at = parsed;
    }

    const blog = await Blog.create({
      title,
      content: normalizeContent(content),
      slug,
      published_at,
    });

    return res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        message: "title and content are required",
      });
    }

    const contentError = validateContent(content);
    if (contentError) {
      return res.status(400).json({ message: contentError });
    }

    let slug = blog.slug;
    if (req.body.slug) {
      slug = await ensureUniqueSlug(req.body.slug, { ignoreId: blog.id });
      if (!slug) {
        return res.status(400).json({ message: "slug is invalid" });
      }
    }

    const publishedAtRaw = req.body.published_at ?? req.body.publishedAt;
    let published_at = blog.published_at;
    if (publishedAtRaw !== undefined) {
      if (publishedAtRaw === null || publishedAtRaw === "") {
        published_at = null;
      } else {
        const parsed = new Date(publishedAtRaw);
        if (Number.isNaN(parsed.getTime())) {
          return res.status(400).json({ message: "published_at must be a valid date" });
        }
        published_at = parsed;
      }
    }

    await blog.update({ title, content: normalizeContent(content), slug, published_at });

    return res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const updates = {};
    if (req.body.title !== undefined) {
      if (!req.body.title) {
        return res.status(400).json({ message: "title cannot be empty" });
      }
      updates.title = req.body.title;
    }
    if (req.body.content !== undefined) {
      const contentError = validateContent(req.body.content);
      if (contentError) {
        return res.status(400).json({ message: contentError });
      }
      updates.content = normalizeContent(req.body.content);
    }
    if (req.body.slug !== undefined) {
      if (!req.body.slug) {
        return res.status(400).json({ message: "slug cannot be empty" });
      }
      const slug = await ensureUniqueSlug(req.body.slug, { ignoreId: blog.id });
      if (!slug) {
        return res.status(400).json({ message: "slug is invalid" });
      }
      updates.slug = slug;
    }

    const publishedAtRaw = req.body.published_at ?? req.body.publishedAt;
    if (publishedAtRaw !== undefined) {
      if (publishedAtRaw === null || publishedAtRaw === "") {
        updates.published_at = null;
      } else {
        const parsed = new Date(publishedAtRaw);
        if (Number.isNaN(parsed.getTime())) {
          return res.status(400).json({ message: "published_at must be a valid date" });
        }
        updates.published_at = parsed;
      }
    }

    await blog.update(updates);
    return res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.destroy();
    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
