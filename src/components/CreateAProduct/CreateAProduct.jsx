import React from "react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
// import useAxios from "../../hooks/useAxios";

const CreateAProduct = () => {
  const { user } = useAuth();
  //   const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();

  const handleCreateAProduct = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const image = e.target.image.value;
    const price_min = e.target.price_min.value;
    const price_max = e.target.price_max.value;
    const newProduct = {
      title,
      image,
      price_min,
      price_max,
      email: user.email,
      seller_name: user.displayName,
    };

    // axios.post(`https://smart-deals-api-server-phi-seven.vercel.app/products`, newProduct).then((data) => {
    //   console.log(data.data);
    //   if (data.data.insertedId) {
    //     Swal.fire({
    //       position: "top-end",
    //       icon: "success",
    //       title: "Your Product has been Created.",
    //       showConfirmButton: false,
    //       timer: 1500,
    //     });
    //   }
    // });
    axiosSecure.post("/products", newProduct).then((data) => {
      console.log(data.data);
      if (data.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your Product has been Created.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };
  return (
    <div className="lg:w-1/2 mx-auto">
      <form onSubmit={handleCreateAProduct}>
        <fieldset className="fieldset">
          <label className="label">Name</label>
          <input type="text" className="input" name="title" />
          <label className="label">Image Url</label>
          <input type="text" className="input" name="image" />
          <label className="label">Min Price</label>
          <input type="text" className="input" name="price_min" />
          <label className="label">Max Price</label>
          <input type="text" className="input" name="price_max" />

          <button className="btn btn-neutral mt-4">Add A Product</button>
        </fieldset>
      </form>
    </div>
  );
};

export default CreateAProduct;
