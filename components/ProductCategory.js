import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

function ProductCategory({ item, i, url }) {
  const router = useRouter();

  return (
    <div key={i} className="bg-custom-lightGrayColor md:h-[194px] h-[200px] cursor-pointer shadow-sm overflow-hidden hover:scale-105 transition-all duration-200 ease-in-out md:p-1 p-4 flex flex-col justify-center items-center rounded-[3px] mr-0 md:mr-5 md:mt-2 mt-5" onClick={() => { router.push(url) }}>
      <img className=" w-full md:h-[98px] h-[150px] rounded-[12px] object-contain" src={item?.image} />
      <p className="text-black md:text-lg text-[16px]	font-semibold	text-center md:pt-5 pt-3 md:pb-0 pb-4">{item?.name}</p>
    </div>
  );
}

export default ProductCategory;
