import Image from 'next/image'
import React from 'react'

export default function ImageGrid() {
  return (
    <div className='px-[7%] pt-16 pb-32'>
        <div className="lg:flex gap-12 mb-12">
        <Image
            src={"/assets/grid-3.png"}
            width={400}
            height={20}
            alt="chat"
          />
            <Image
            src={"/assets/grid-2.png"}
            width={400}
            height={20}
            alt="chat"
          />
            <Image
            src={"/assets/grid-2.png"}
            width={400}
            height={20}
            alt="chat"
          />
        </div>
        <div className="lg:flex gap-12">
        <Image
            src={"/assets/grid-4.png"}
            width={400}
            height={20}
            alt="chat"
          />
            <Image
            src={"/assets/grid-1.png"}
            width={400}
            height={20}
            alt="chat"
          />
            <Image
            src={"/assets/grid-1.png"}
            width={400}
            height={20}
            alt="chat"
          />
        </div>
    </div>
  )
}
