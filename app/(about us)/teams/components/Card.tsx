import Image from "next/image";
import React from "react";

interface cardProps {
  image: string;
  name: string;
  title: string;
}

export default function Card({ image, name, title }: cardProps) {
  return (
    <div className="bg-black text-white rounded px-3 py-4">
      <Image src={image} alt={name} width={400} height={50} />
      <p className="text-xl font-semibold mt-4">{name}</p>
      <p>{title}</p>
    </div>
  );
}
