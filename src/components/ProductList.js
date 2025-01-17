import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useNavigate } from "react-router-dom";

const ProductList = ({ productData, handleFavoriteClick, handleAddWish, handleRemoveWish, handleCheckboxClick, wishItem }) => {
  const [coupangs, setCoupangs] = useState([]);
  const [gmarkets, setGmarkets] = useState([]);
  const [elevens, setElevens] = useState([]);
  const [products, setProducts] = useState([]);

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


  return (
    <div className="ProductList">
      <table>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="Product-img">
                <img src={product.image} alt={product.name} width="120" height="100" />
              </td>
              <td className="Product-name">
                {product.name}
              </td>
              <td className="Product-price">
              {uniqueSortedProducts.map((uniqueProduct) => (
                <tr key={uniqueProduct.kg}>
                    {uniqueProduct.kg === 0 ? (
                      <a href={`/pricecompare?name=${encodeURIComponent(product.name)}&kg=${uniqueProduct.kg}`}>
                        {getPrice(product.name, uniqueProduct.kg) === Infinity ? null : (
                          <>
                            {getPrice(product.name, uniqueProduct.kg)}원
                          </>
                        )}
                      </a>
                    ) : (
                      <a href={`/pricecompare?name=${encodeURIComponent(product.name)}&kg=${uniqueProduct.kg}`}>
                        {getPrice(product.name, uniqueProduct.kg) === Infinity ? null : (
                          <>
                            {uniqueProduct.kg}kg {getPrice(product.name, uniqueProduct.kg)}원
                          </>
                        )}
                      </a>
                    )}
                </tr>
              ))}
              </td>
              <td className="Product-button" onClick={() => {
                handleFavoriteClick(product.id);
                product.isFavorited ? handleRemoveWish(product) : handleAddWish(product);
                }} style={{ cursor: 'pointer' , color: wishItem.some((item) => item.id === product.id) ? 'red' : 'black'}}>
                  {wishItem.some((item) => item.id === product.id) ? '❤️' : '🤍'}
              </td>
              <td className="Product-button"><input type="checkbox" onClick={() => handleCheckboxClick(product)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
