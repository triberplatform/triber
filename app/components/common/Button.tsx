import React from "react";
import Link from "next/link";

interface ButtonProps {
  link: string;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ link, text }) => {
  return (
    <Link href={link} className={`button bg-mainGreen px-7 py-3 rounded text-sm`} passHref>
      {text}
    </Link>
  );
};

export default Button;
