import React from "react";
import { Link } from "react-router";

const Product = ({ product }) => {
  const { _id, title, price_min, price_max, image } = product;
  return (
    <div className="card bg-base-100 shadow-sm p-4">
      <figure className="h-64 object-cover">
        <img src={image} alt="Shoes" className="rounded-xl" />
      </figure>
      <div className="card-body p-0">
        <div className="py-4">
          <h2 className="card-title text-2xl font-medium">{title}</h2>
          <p className="text-xl text-primary font-semibold">
            $ {price_min} - {price_max}
          </p>
        </div>

        <div className="card-actions p-0">
          <Link
            to={`/productDetails/${_id}`}
            className="btn w-full btn-outline border-primary text-primary font-semibold"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
