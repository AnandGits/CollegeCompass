---
title: Welcome to the Admissions Blog
date: 2026-08-01
---

Drop any markdown file into the `Blogs/` folder at the root of the repo and it will
show up automatically on the `/blog` page — no code changes needed.

## How it works

- Each `.md` file becomes one post.
- The filename (minus `.md`) becomes the post's URL slug.
- An optional frontmatter block at the top of the file sets the **title** and **date**:

```
---
title: My Post Title
date: 2026-08-01
---
```

- If you skip the frontmatter, the first `# Heading` in the file is used as the title instead.
- Posts are sorted newest-first by date; posts without a date are sorted alphabetically after dated posts.

That's it — just write markdown.
