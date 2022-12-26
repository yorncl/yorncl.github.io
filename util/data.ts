import fs from "fs";
import type { PostData } from "./types";
import matter from "gray-matter";
import { marked } from "marked";
import hljs from "highlight.js";

export async function getPost(name: string) {
  let post: PostData;
  let markdown = fs.readFileSync("blog/" + name + ".md", "utf8");
  const { data: frontmatter, content } = matter(markdown);
  marked.setOptions({
    highlight: function (code, language) {
      const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
      return hljs.highlight(validLanguage, code).value;
    },
  });

  return {
    props: {
      frontmatter,
      title: frontmatter["title"],
      content: marked(content),
    },
  };

  // parse the Markdown into HTML
  const html = marked(content);
  return post;
}

export async function getPostsData() {
  // get the list of files in the blog directory
  const files = fs.readdirSync("blog");

  // read the Markdown content and metadata for each file
  const posts: PostData[] = files.map((file) => {
    const markdown = fs.readFileSync(`blog/${file}`, "utf8");
    const { data, content } = matter(markdown);

    // parse the Markdown into HTML
    const html = marked(content);

    // return the blog post data
    return {
      id: file.replace(".md", ""), // use the filename as the ID
      title: data.title ? data.title : "default-title",
      content: html,
    };
  });

  return {
    props: {
      posts: posts,
    },
  };
}
