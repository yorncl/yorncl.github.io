import { copyFileSync } from "fs";
import type { NextPage, NextComponentType } from "next";
import Circle from "../components/Circle";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Home: NextPage = () => {
  return (
    <div className=" flex flex-col items-center">
      <p align="justify" className="text-base my-5">
        Hello, my name is Martin. I study Computer Science at{" "}
        <a
          href="https://42.fr"
          className="underline ml-2 font-black decoration-4 decoration-indigo-700"
        >
          42 Paris
        </a>
        . You can check out my projects over on my
        <a
          href="https://github.com/yorncl/"
          className="underline ml-2 font-black decoration-4 decoration-pink-700"
        >
          Github
        </a>
        .
      </p>
      <div className="flex flex-col mt-4 text-xl items-start">
        <a href="https://github.com/yorncl/">
          <FaGithub className="inline text-3xl" />
          <span>Github</span>
        </a>
        <a
          href="https://www.linkedin.com/in/martin-claudel-b50362150/"
          className="mt-3"
        >
          <FaLinkedin className="inline text-3xl" />
          <span>Linkedin</span>
        </a>
      </div>
      <img className="mt-10" src="/construction.svg" alt="construction sign" />
      <div className="flex flex-col items-center justify-start">
        <h2 className="font-black text-center">Under construction</h2>
        <span className="text-xs text-center">
          Later, you might find a semi-informative blog, or a cool SVG
          aninmation. Who knows ?
        </span>
      </div>
      {/* <Circle></Circle> */}
    </div>
  );
};

export default Home;
