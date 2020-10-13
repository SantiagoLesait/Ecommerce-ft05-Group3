import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import ProductCard from "./ProductCard";
import Filter from './Filter';
import SideComponent from './SideComponent';
import Pagination from './Pagination';
import axios from 'axios';
import './Catalogo.css';


function Catalogo({productSearch}) {

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [productsByCategories, setProductsByCategories] = useState([])
  const [priceOrder, serPriceOrder] = useState([])

  /*------------------Pagination---------------------*/

  // const [currentPage, setCurrentPage] = useState(1);
  // const [productsPerPage] = useState(9);

  const getProducts = () =>{
    axios
    .get("http://localhost:4000/products")
    .then((res) => res.data)
    .then((res) => setProducts(res.rows));
  }

    useEffect(() => {
         getProducts();
    }, []);


    useEffect(() => {
      axios
        .get("http://localhost:4000/category")
        .then((res) => res.data)
        .then((res) => setCategories(res));
    }, []);

    useEffect(() => serPriceOrder(""))

    const orderByLowerPrice = () => {
      console.log('lower')
      if(productSearch.length > 0) {
        let orderPrice = productSearch.sort((a, b) => a.price - b.price);
        serPriceOrder(orderPrice);
      }
      else if(productsByCategories.length > 0) {
        let orderPrice = productsByCategories.sort((a, b) => a.price - b.price);
        serPriceOrder(orderPrice);
      }
      else {
        let orderPrice = products.sort((a, b) => a.price - b.price);
        serPriceOrder(orderPrice);
      } 
    };
  
    const orderByHighPrice = () => {
      if(productSearch.length > 0) {
        let orderPrice = productSearch.sort((a, b) => b.price - a.price);
        serPriceOrder(orderPrice);
      }
      else if(productsByCategories.length > 0) {
        let orderPrice = productsByCategories.sort((a, b) => b.price - a.price);
        serPriceOrder(orderPrice);
      }
      else {
        let orderPrice = products.sort((a, b) => b.price - a.price);
        serPriceOrder(orderPrice);
      } 
    };

  const productsFromCategories = (e) => { 
     if(e === "todos los productos") return  setProductsByCategories([]);
      axios
      .get(`http://localhost:4000/products/category/${e}`)
      .then((res) => res.data)
      .then((res) => {
        if(res.length === 0)  return setProductsByCategories(-1);
        setProductsByCategories([]);
        setProductsByCategories(res);
      });
  }

  // const indexOfLastProduct = currentPage * productsPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
      <Row md={12} className="catalogo">
        <Col xs={0} xl={1} ></Col>
        <Col xs={2} ><SideComponent categories={categories} orderByLowerPrice={orderByLowerPrice} 
        orderByHighPrice={orderByHighPrice}
        productsFromCategories={productsFromCategories}/></Col>
        <Col >
        <Row >
        {productSearch.length > 0 ?
        productSearch.map((ele, index) => (
          <div key={index} className="column-productcard">
          <ProductCard 
            id={ele.id}
            name={ele.name}
            description={ele.description.slice(0,50) + "..."}
            price={ele.price}
            stock={ele.stock}
            images={ele.images[0]}
          />
          </div>
        ))
        :
        (productsByCategories) && (productsByCategories === -1) ?
          <div><h1 className="no-products" >No products to display</h1></div>
        :

        productsByCategories.length > 0 ? 
        productsByCategories.map((ele, index) => (
          <div key={index} className="column-productcard">
        {  console.log(ele)}
          <ProductCard 
            id={ele.id}
            name={ele.name}
            description={ele.description.slice(0,50) + "..."}
            price={ele.price}
            stock={ele.stock}
            images={ele.images && ele.images[0]}
          />
          </div>
          ))
        :
        priceOrder.length > 0 ? 
        priceOrder.map((ele, index) => ( 
          <div key={index} className="column-productcard">
          <ProductCard   
            id={ele.id}
            name={ele.name}
            description={ele.description.slice(0,50) + "..."}
            price={ele.price}
            stock={ele.stock}
            images={ele.images[0]}
          />
          </div>
        )) 
        :
        products.map((ele, index) => (
            <div key={index} className="column-productcard">
          <ProductCard
            id={ele.id}
            name={ele.name}
            description={ele.description.slice(0,50) + "..."}
            price={ele.price}
            stock={ele.stock}
            images={ele.images[0]}
          />
          </div>
        ))
        }
        </Row>
        <div className="d-flex justify-content-center mt-5">
        {/* <Pagination productsPerPage={productsPerPage} totalProducts={products.length} paginate={paginate}/> */}
        </div>
        
        </Col>
        <Col xs={0} xl={1} ></Col>
        </Row>
  );
}

export default Catalogo;
