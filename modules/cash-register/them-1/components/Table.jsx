"use client";
import React, { useEffect, useState } from "react";
import { columns, columnsTable } from "../utils/data";
import MenuList from "./header/MenuList";
import { products } from "../utils/data";
import kassaStore from "@/stores/kassa";

export default function Table() {
  const {
    searchProduct,
    amountChose,
    setAmountsObj,
    selectedProducts,
    setSelectedProducts,
    totalAmountsObj,
    setTotalAmountsObj,
    delSelectedProducts,
    updateTotalAmountsObj,
    openPay,
    setError,
  } = kassaStore();

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [amounts, setAmounts] = useState({});
  const [totalAmounts, setTotalAmounts] = useState({});


  // Фильтруем склад и продукты с 0 значением
  useEffect(() => {
    const arr = products.filter(
      (item) =>
        item["Наименование"]
          .toLowerCase()
          .trim()
          .includes(searchProduct.toLowerCase().trim()) 
          && item["Количество"] > 0 
          && item["Количество"] >= amountChose
    );
    const newArr = searchProduct.length > 0 ? arr : [];
    setFilteredProducts(newArr);
  }, [searchProduct, amountChose]);

  // Добавляем в отдельный массив выбранный товар
  const setProducts = (id) => {
    const obj = products.filter((item) => item.id == id)[0]; // Вытаскиваем из склада выбранный товар
    if (selectedProducts.some((el) => el.id == obj.id)) {
      setError(true);
    } else {
      setSelectedProducts(obj); // Добавляем выбранный товар в массив
      setFilteredProducts((prev) => prev.filter((item) => item.id != id)); // Удаляем из найденных продуктов выбранный

      setAmounts((prevState) => ({
        ...prevState,
        [obj["Наименование"]]: amountChose,
      }));

      setTotalAmounts((prevState) => ({
        ...prevState,
        [obj["Наименование"]]: obj["Цена"] * amountChose,
      }));

      // Применяем обновление объекта amountsObj
      setAmountsObj({ [obj["Наименование"]]: amountChose });
      setTotalAmountsObj({ [obj["Наименование"]]: obj["Цена"] * amountChose });
    }
  };

  const countProduct = (e) => {
    const symbol = e.target.getAttribute("data-symbol");
    const parent = e.target.closest("tr");
    const name = parent.querySelector(".name").innerHTML.trim();
    const price = Number(
      parent.querySelector(".price").getAttribute("data-price")
    );
    const input = parent.querySelector(".amount");
    let amount = Number(input.value);
    let sum = totalAmounts[name];

    if (symbol === "+") {
      amount += 1;
      sum += price;
    } else if (symbol === "-") {
      amount -= 1;
      sum -= price;
    }

    if (amount >= 1 && amount <= Number(input.getAttribute("max"))) {
      setAmounts((prevState) => ({
        ...prevState,
        [name]: amount,
      }));

      setTotalAmounts((prev) => ({
        ...prev,
        [name]: sum,
      }));

      // Применяем обновление объекта amountsObj
      setAmountsObj({ [name]: amount });
      setTotalAmountsObj({ [name]: sum });
    }
  };

  const delProduct = (id, name) => {

    const arr = selectedProducts.filter(item => item.id != id)
    const obj = selectedProducts.find(item => item.id == id)

    let newTotalAmount = {}

    for (const key in totalAmountsObj) {

      if (key != name) {
        newTotalAmount[key] = totalAmountsObj[key]
      }
    }
    delSelectedProducts(arr)
    setFilteredProducts(state => [...state, obj])
    updateTotalAmountsObj(newTotalAmount)
  }

  return (
    <div className="border border-black min-h-[90vh] relative overflow-hidden">
      <MenuList />
      {openPay && <span className="dark fixed top-0 left-0 bg-[#706e6e8f] h-[100vh] w-[100vw] z-[100]"></span>}
      {filteredProducts.length > 0 && (
        <table className="w-[100%] flex flex-col h-full">
          <thead className="w-[100%] bg-[#c5eeff]">
            <tr className="grid grid-cols-4 justify-items-start">
              {columns?.map((item) => (
                <th key={item.id} className="text-[16px] font-bold p-[10px]">
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item, i) => (
              <tr
                onClick={() => setProducts(item.id)}
                key={i}
                className="grid grid-cols-4 border-b border-black cursor-pointer hover:bg-[#bfed6b]"
              >
                <td className="p-[10px] flex items-center">
                  {item["Наименование"]}
                </td>
                <td className="p-[10px] flex items-center">
                  {item["Штрихкод"]}
                </td>
                <td className="p-[10px] flex items-center">
                  {item["Количество"]} шт
                </td>
                <td className="p-[10px] flex items-center">
                  {item["Цена"]} сум
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedProducts.length > 0 && (
        <table className="w-[100%] flex flex-col h-full">
          <thead className="w-[100%] bg-[#c5eeff]">
            <tr className="grid grid-cols-5 justify-items-start">
              {columnsTable?.map((item) => (
                <th key={item.id} className="text-[16px] font-bold p-[10px]">
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedProducts?.map((item) => (
              <tr
                key={item.id}
                className="grid grid-cols-5 border-b border-black cursor-pointer bg-[#bfed6b]"
              >
                <td className="p-[10px] flex items-center name">
                  {item["Наименование"]}
                </td>
                <td className="p-[10px] flex items-center">
                  {item["Штрихкод"]}
                </td>
                <td className="p-[10px] flex items-center">
                  <div className="border border-black flex justify-between items-center gap-[5px] p-[5px]">
                    <button
                      onClick={(e) => countProduct(e)}
                      data-symbol="-"
                      className="border border-black w-[30px] h-[15px] flex items-center justify-center bg-[#f7b279]"
                    >
                      -
                    </button>
                    <input
                      min={1}
                      max={item["Количество"]}
                      type="number"
                      className="max-w-[70px] w-full text-center amount"
                      value={amounts[item["Наименование"]] || amountChose}
                      readOnly
                    />
                    <button
                      onClick={(e) => countProduct(e)}
                      data-symbol="+"
                      className="border border-black w-[30px] h-[15px] flex items-center justify-center bg-[#89e373]"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td
                  className="p-[10px] flex items-center price"
                  data-price={item["Цена"]}
                >
                  {item["Цена"]}
                  <span>сум</span>
                </td>
                <td className="p-[10px] flex items-center relative">
                  {totalAmounts[item["Наименование"]]}
                  <span>сум</span>
                  <button onClick={() => delProduct(item.id, item["Наименование"])} className="del p-[5px_10px] border border-black bg-[#d67878e9] cursor-pointer absolute top-[10px] right-[10px]" >X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
