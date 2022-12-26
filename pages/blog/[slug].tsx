import React from "react";
import fs from "fs";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import { marked } from "marked";
import hljs from "highlight.js";
import { PostData } from "../../util/types";
import * as Data from "../../util/data";

export async function getStaticProps(context: { params: { slug: string } }) {
  return await Data.getPost(context.params.slug);
}

export const getStaticPaths = async () => {
  const files = fs.readdirSync("blog");
  const paths = files.map((file) => ({
    params: {
      slug: file.replace(".md", ""),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

const BlogPost = (data: GetStaticProps<{ data: PostData }>) => {
  return (
    <div className="text-justify">
      <h2 className="my-4">{data.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </div>
  );
};

export default BlogPost;
