import React from "react";
import matter from "gray-matter";
import { marked } from "marked";
import fs from "fs";
import { GetStaticProps } from "next";
import Link from "next/link";
import * as Data from "../util/data";
import { PostData } from "../util/types";

export const getStaticProps: GetStaticProps<{ posts: PostData[] }> = async (
  context
) => {
  return await Data.getPostsData();
};

const Blog = (props: GetStaticProps<{ posts: PostData[] }>) => {
  return (
    <div>
      {props.posts.map((post: PostData) => (
        <Link href={"blog/" + post.id}>
          <div>
            <h2 className="">{post.title}</h2>
            <span
              dangerouslySetInnerHTML={{
                __html: post.content.substring(0, 200) + " ...",
              }}
            ></span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Blog;
