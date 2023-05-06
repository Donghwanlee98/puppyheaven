import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ProductList = ({ productData, handleFavoriteClick, handleAddWish, handleRemoveWish, wishItem, onCheck  }) => {
  const [coupangs, setCoupangs] = useState([]);
  const [gmarkets, setGmarkets] = useState([]);
  const [elevens, setElevens] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getCoupangs = async () => {
      const response = await axios.get('http://localhost:3001/coupang');
      setCoupangs(response.data);
    };
    getCoupangs();

    const getGmarkets = async () => {
      const response = await axios.get('http://localhost:3001/gmarket');
      setGmarkets(response.data);
    };
    getGmarkets();

    const getElevens = async () => {
      const response = await axios.get('http://localhost:3001/eleven');
      setElevens(response.data);
    };
    getElevens();

    setProducts(productData);
  }, [productData]);

  const sortedCoupangs = [...coupangs].sort((a, b) => a.price - b.price);
  const sortedGmarkets = [...gmarkets].sort((a, b) => a.price - b.price);
  const sortedElevens = [...elevens].sort((a, b) => a.price - b.price);
  const sortedProducts = [...sortedCoupangs, ...sortedGmarkets, ...sortedElevens];

  const uniqueProducts = {};
  sortedProducts.forEach((product) => {
    if (!uniqueProducts[product.kg]) {
      uniqueProducts[product.kg] = product;
    } else if (product.price < uniqueProducts[product.kg].price) {
      uniqueProducts[product.kg] = product;
    }
  });

  const uniqueSortedProducts = Object.values(uniqueProducts).sort((a, b) => a.price - b.price);

  const getPrice = (name, kg) => {
    let minPrice = Infinity;

    // 쿠팡에서 가격 찾기
    coupangs.forEach((product) => {
      if (product.name === name && product.kg === kg && product.price < minPrice) {
        minPrice = product.price;
      }
    });

    // 지마켓에서 가격 찾기
    gmarkets.forEach((product) => {
      if (product.name === name && product.kg === kg && product.price < minPrice) {
        minPrice = product.price;
      }
    });

    // 11번가에서 가격 찾기
    elevens.forEach((product) => {
      if (product.name === name && product.kg === kg && product.price < minPrice) {
        minPrice = product.price;
      }
    });

    return minPrice;
  };

  //상품 비교 리스트
  const handleCheck = (image, name, kg) => {
    const price = getPrice(name, kg);
    const product = { image, name, price, kg };
  
    const index = selectedProducts.findIndex(
      (p) => p.name === product.name && p.kg === product.kg
    );
  
    let newSelectedProducts = [...selectedProducts];
  
    if (index >= 0) {
      newSelectedProducts.splice(index, 1);
    } else {
      newSelectedProducts.push(product);
    }
  
    onCheck(newSelectedProducts); // 부모 컴포넌트로 선택된 상품들을 보냄
  
    setSelectedProducts(newSelectedProducts);
  };

  return (
    <div className="ProductList">
      <table>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                  <img src={product.image} alt={product.name} width="120" height="100" />
              </td>
              <td>
                  {product.name}
              </td>
              <td>
              {uniqueSortedProducts.map((uniqueProduct) => (
                <tr key={uniqueProduct.kg}>
                  {uniqueProduct.kg === 0 ? (
                    <a href={`/pricecompare?name=${encodeURIComponent(product.name)}&kg=${uniqueProduct.kg}`}>
                      {getPrice(product.name, uniqueProduct.kg) === Infinity ? null : (
                        <>
                          {getPrice(product.name, uniqueProduct.kg)}원
                          <input type="checkbox" onChange={() => handleCheck(product.image, product.name, uniqueProduct.kg)}/>
                        </>
                      )}
                    </a>
                  ) : (
                    <a href={`/pricecompare?name=${encodeURIComponent(product.name)}&kg=${uniqueProduct.kg}`}>
                      {getPrice(product.name, uniqueProduct.kg) === Infinity ? null : (
                        <>
                          {uniqueProduct.kg}kg {getPrice(product.name, uniqueProduct.kg)}원
                          <input type="checkbox" onChange={() => handleCheck(product.image, product.name, uniqueProduct.kg)}/>
                        </>
                      )}
                    </a>
                  )}
                </tr>
              ))}
              </td>
              <td onClick={() => {
                handleFavoriteClick(product.id);
                product.isFavorited ? handleRemoveWish(product) : handleAddWish(product);
                }} style={{ cursor: 'pointer' , color: wishItem.some((item) => item.id === product.id) ? 'red' : 'black'}}>
                  {wishItem.some((item) => item.id === product.id) ? '❤️' : '🤍'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
