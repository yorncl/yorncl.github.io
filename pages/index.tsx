import { copyFileSync } from "fs";
import type { NextPage, NextComponentType } from "next";
import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import styles from "../styles/home.module.css";

const Home: NextPage = () => {
  function transcos(offset: number) {
    return Math.cos(offset);
  }

  const [offsets, setOffsets] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  let currentFrame: number;

  const animate = () => {
    setOffsets((arr: { x: number; y: number }[]) => {
      let newArr = [...arr];
      for (let i = 0; i < newArr.length; i++) {
        newArr[i].x = Math.cos(i + Date.now() / 1000) * 100 + 50 * (i + 1);
        newArr[i].y = Math.sin(i + Date.now() / 1000) * 100 + 50 * (i + 1);
      }
      return newArr;
    });
    currentFrame = requestAnimationFrame(animate);
  };
  useEffect(() => {
    animate();
    return () => cancelAnimationFrame(currentFrame);
  }, []);

  return (
    <div className=" flex flex-col items-center">
      <span className="text-sm">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
        egestas urna justo, id cursus ex iaculis sit amet. Morbi sagittis nisi
        vitae tellus pulvinar semper. Fusce tempus diam quis ex maximus, ut
        imperdiet enim pulvinar. Curabitur lobortis sed tellus a ornare. Nulla
        malesuada ac elit at accumsan. Vestibulum feugiat nisi nec sem mollis,
        et porttitor ex tempus. Mauris in ex at dui blandit maximus. Mauris sed
        blandit augue.
      </span>
      <div className={`${styles.animatedCircle} text-3xl`}>
        <FaGithub
          style={{
            transform: `translate(${offsets[0].x}px, ${offsets[0].y}px)`,
          }}
        />
        <FaLinkedin
          style={{
            transform: `translate(${offsets[1].x}px, ${offsets[1].y}px)`,
          }}
        />
        <FaTwitter
          style={{
            transform: `translate(${offsets[2].x}px, ${offsets[2].y}px)`,
          }}
        />
      </div>
    </div>
  );
};

export default Home;
