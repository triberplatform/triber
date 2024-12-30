import Image from 'next/image'
import React from 'react'

export default function Sponsor() {
  return (
    <div>
    
         <div className="lg:flex-row flex-col flex gap-10  lg:gap-20 mt-10 items-center justify-center">
          <Image
            src={"/assets/fcmb-logo.svg"}
            width={80}
            height={20}
            alt="chat"
          />
          <Image
            src={"/assets/stanbic-logo.svg"}
            width={250}
            height={20}
            alt="chat"
          />
          <Image
            src={"/assets/access-logo.svg"}
            width={150}
            height={20}
            alt="chat"
          />
          <Image
            src={"/assets/wema-logo.svg"}
            width={100}
            height={20}
            alt="chat"
          />
        </div>
        <div className="lg:flex-row flex-col flex gap-10 lg;gap-20 mt-5 items-center justify-center">
          <Image
            src={"/assets/sterling-logo.png"}
            width={150}
            height={20}
            alt="chat"
          />
          <Image
            src={"/assets/pecan-logo.svg"}
            width={150}
            height={20}
            alt="chat"
          />
          <Image
            src={"/assets/providus-logo.png"}
            width={120}
            height={20}
            alt="chat"
          />
          <Image
            src={"/assets/gt-logo.svg"}
            width={80}
            height={20}
            alt="chat"
          />
        </div>
    </div>
  )
}
