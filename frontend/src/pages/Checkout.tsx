
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from "@/components/Layout";
import MultiStepCheckout from "@/components/checkout/MultiStepCheckout";
import { products } from "@/data/products";

const Checkout = () => {
  const { id } = useParams();
  const product = id ? products.find(p => p.id === parseInt(id)) : null;

  return (
    <Layout>
      <MultiStepCheckout product={product} />
    </Layout>
  );
};

export default Checkout;
