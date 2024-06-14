"use client"
import Link from "next/link";
import React, { useState } from "react";
import { menuBtns } from "../../utils/data";
import clsx from "clsx";
export default function MenuPageList() {

    const [activeName, setActiveName] = useState('Левое меню')

    const setBtnActive = (i)=> {
        setActiveName(menuBtns[i].title)
        console.log(activeName);
    }

  return (
    <>
      <Link
        href="/"
        className="bg-[#fc7a7a] text-[16px] p-[10px] block w-max mb-[10px]"
      >
        Закрыть
      </Link>
      <ul className="menu__list flex gap-[15px]">
        {menuBtns?.map((item, i) => (
          <li key={item.id} onClick={() => setBtnActive(i)}>
            <Link href="" className={clsx("menu__link p-[10px] border border-black block", {
              "bg-[#bcb6b6]": activeName == item.title
            })}>
                {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
