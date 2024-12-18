import React from "react";
import Photos from "./PhotoGallery";
import PhotoGalleryMobile from "./PhotoGalleryMobile";

export default function Cryptic() {
  return (
    <div className="bg1 flex flex-col py-12 ">
      <h1 className="lg:text-4xl text-center text-3xl font-serif font-semibold my-8">
        How Triber solves these <br /> challenges
      </h1>
      <div className="hidden lg:block">
      <Photos />
      </div>
      <div className="lg:hidden">
       <PhotoGalleryMobile/>
      </div>

      {/* <div className="text-center flex flex-col px-[20%]">
        <h1 className="lg:text-4xl text-3xl font-serif font-semibold mb-8">
          Building A Business <br /> Shouldn`&lsquo;t Be Cryptic
        </h1>
        <div className="lg:flex items-center justify-center lg:gap-12">
          <div className="flex-col flex gap-4 mb-4 lg:mb-0 lg:gap-7">
            <Image
              src={"/assets/chat-3.png"}
              width={200}
              height={200}
              alt="chats"
              className="mx-auto lg:mx-0"
            />
            <Image
              src={"/assets/chat-3.png"}
              width={200}
              height={200}
              alt="chats"
              className="mx-auto lg:mx-0"
            />
          </div>
          <div className="flex-col flex gap-4 lg:gap-16">
            <Image
              src={"/assets/chat-1.png"}
              width={200}
              height={200}
              alt="chats"
              className="mx-auto lg:mx-0"
            />
            <Image
              src={"/assets/chat-2.png"}
              width={200}
              height={200}
              alt="chats"
              className="mx-auto lg:mx-0"
            />
          </div>
        </div>
        <Image
          src={"/assets/chat-5.png"}
          width={200}
          height={200}
          alt="chats"
          className="ml-12 self-center hidden lg:block mt-8"
        />
      </div> */}
    </div>
  );
}
