import React from "react";
import LatestProducts from "../LatestProducts/LatestProducts";

const latestProductsPromise = fetch(
  "https://smart-deals-api-server-phi-seven.vercel.app/latest-products",
).then((res) => res.json());

const Home = () => {
  return (
    <div>
      <h3 className="bg-purple-600">This is Home</h3>
      <LatestProducts
        latestProductsPromise={latestProductsPromise}
      ></LatestProducts>
    </div>
  );
};

export default Home;
