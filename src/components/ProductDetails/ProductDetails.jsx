import React, { use, useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";

const ProductDetails = () => {
  const { _id: productId } = useLoaderData();
  const [bids, setBids] = useState([]);
  const bidModalRef = useRef(null);
  const { user } = use(AuthContext);
  // console.log("single product", product);

  useEffect(() => {
    axios
      .get(
        `https://smart-deals-api-server-phi-seven.vercel.app/products/bids/${productId}`,
      )
      .then((data) => {
        console.log("after axios get", data);
        setBids(data.data);
      });
  }, [productId]);

  // useEffect(() => {
  //   fetch(`https://smart-deals-api-server-phi-seven.vercel.app/products/bids/${productId}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("bids for this products", data);
  //       setBids(data);
  //     });
  // }, [productId]);

  const handleBidModalOpen = () => {
    bidModalRef.current.showModal();
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const bid = e.target.bid.value;
    // console.log(_id,name,bid,email)
    const newBid = {
      product: productId,
      buyer_name: name,
      buyer_email: email,
      buyer_image: user?.photoURL,
      bid_price: bid,
      status: "pending",
    };

    fetch("https://smart-deals-api-server-phi-seven.vercel.app/bids", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newBid),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          bidModalRef.current.close();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your bid has been placed.",
            showConfirmButton: false,
            timer: 1500,
          });
          // add the new bid to the state
          newBid._id = data.insertedId;
          const newBids = [...bids, newBid];
          newBids.sort((a, b) => b.bid_price - a.bid_price);
          setBids(newBids);
        }
        console.log("after placing bid", data);
      });
  };
  return (
    <div>
      {/* product info */}
      <div>
        <div></div>
        <div>
          <button onClick={handleBidModalOpen} className="btn btn-primary">
            I want Buy This Product
          </button>

          <dialog
            ref={bidModalRef}
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Give Seller Your Offered Price
              </h3>
              <p className="py-4">Offer something seller can not resist</p>

              <form onSubmit={handleBidSubmit}>
                <fieldset className="fieldset">
                  <label className="label">Buyer Name</label>
                  <input
                    type="text"
                    className="input"
                    name="name"
                    defaultValue={user?.displayName}
                    readOnly
                  />
                  <label className="label">Buyer Email</label>
                  <input
                    type="email"
                    className="input"
                    name="email"
                    defaultValue={user?.email}
                    readOnly
                  />
                  {/* bid amount */}
                  <label className="label">Bid</label>
                  <input
                    type="text"
                    className="input"
                    name="bid"
                    placeholder="Your Bid"
                  />

                  <button className="btn btn-neutral mt-4">
                    Please your bid
                  </button>
                </fieldset>
              </form>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Cancel</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
      {/* bids for this product */}
      <div>
        <h3 className="text-3xl">
          Bids For This Products:{" "}
          <span className="text-primary"> {bids.length}</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>SL No</th>
                <th>Buyer Name</th>
                <th>Buyer Email</th>
                <th>Bid Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {bids.map((bid, index) => (
                <tr key={bid._id}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{bid.buyer_name}</div>
                        <div className="text-sm opacity-50">United States</div>
                      </div>
                    </div>
                  </td>
                  <td>{bid.buyer_email}</td>
                  <td>{bid.bid_price}</td>
                  <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

// [
//   {
//     "title": "Yamaha R15 V4",
//     "price_min": 4200,
//     "price_max": 4800,
//     "email": "rahimuddin@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-01T10:00:00Z",
//     "image": "https://i.pinimg.com/736x/2c/3b/f3/2c3bf32843e09e383f72a7079c250d00.jpg",
//     "status": "pending",
//     "location": "Dhaka",
//     "seller_image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
//     "seller_name": "Rahim Uddin",
//     "condition": "used",
//     "usage": "10 months",
//     "description": "Well maintained Yamaha R15 V4, showroom serviced.",
//     "seller_contact": "01710000001"
//   },
//   {
//     "title": "Honda CBR 150R",
//     "price_min": 3800,
//     "price_max": 4300,
//     "email": "hasanali@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-02T11:15:00Z",
//     "image": "https://i.pinimg.com/736x/29/9e/80/299e80b1f20f3419904fcc640cb04c19.jpg",
//     "status": "pending",
//     "location": "Chattogram",
//     "seller_image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
//     "seller_name": "Hasan Ali",
//     "condition": "used",
//     "usage": "1 year",
//     "description": "Smooth engine, accident free.",
//     "seller_contact": "01810000002"
//   },
//   {
//     "title": "Suzuki Gixxer SF 155",
//     "price_min": 3000,
//     "price_max": 3500,
//     "email": "nusratjahan@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-03T09:30:00Z",
//     "image": "https://i.pinimg.com/736x/c6/c4/49/c6c449de3885a868487a619adc5a7e81.jpg",
//     "status": "pending",
//     "location": "Sylhet",
//     "seller_image": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
//     "seller_name": "Nusrat Jahan",
//     "condition": "used",
//     "usage": "8 months",
//     "description": "Sporty look, excellent mileage.",
//     "seller_contact": "01910000003"
//   },
//   {
//     "title": "Bajaj Pulsar NS160",
//     "price_min": 2800,
//     "price_max": 3200,
//     "email": "imranhossain@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-04T14:20:00Z",
//     "image": "https://i.pinimg.com/736x/ee/99/df/ee99dfe0bee29d2f7cb46cea4c4bd2db.jpg",
//     "status": "pending",
//     "location": "Khulna",
//     "seller_image": "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
//     "seller_name": "Imran Hossain",
//     "condition": "used",
//     "usage": "1.5 years",
//     "description": "Powerful engine, new tires installed.",
//     "seller_contact": "01610000004"
//   },
//   {
//     "title": "TVS Apache RTR 160 4V",
//     "price_min": 2700,
//     "price_max": 3100,
//     "email": "sabbirahmed@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-05T16:45:00Z",
//     "image": "https://i.pinimg.com/736x/e4/e7/87/e4e787cbf59e448d1e50e2513f5bd737.jpg",
//     "status": "pending",
//     "location": "Rajshahi",
//     "seller_image": "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
//     "seller_name": "Sabbir Ahmed",
//     "condition": "used",
//     "usage": "11 months",
//     "description": "Race tuned performance, no issues.",
//     "seller_contact": "01510000005"
//   },
//   {
//     "title": "Yamaha MT-15",
//     "price_min": 3900,
//     "price_max": 4400,
//     "email": "farzanaakter@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-06T08:10:00Z",
//     "image": "https://i.pinimg.com/1200x/3f/ee/13/3fee13e7e6184ae31fa781d6c1db6434.jpg",
//     "status": "pending",
//     "location": "Dhaka",
//     "seller_image": "https://images.unsplash.com/photo-1546961329-78bef0414d7c",
//     "seller_name": "Farzana Akter",
//     "condition": "fresh",
//     "usage": "Unused",
//     "description": "Brand new MT-15, registration ready.",
//     "seller_contact": "01710000006"
//   },
//   {
//     "title": "Honda Hornet 2.0",
//     "price_min": 3200,
//     "price_max": 3600,
//     "email": "arifkhan@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-07T12:00:00Z",
//     "image": "https://i.pinimg.com/736x/cf/2e/ab/cf2eabbce6c1d8d8febfa157bf3c60c3.jpg",
//     "status": "pending",
//     "location": "Barishal",
//     "seller_image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
//     "seller_name": "Arif Khan",
//     "condition": "used",
//     "usage": "1 year",
//     "description": "Muscular look, great control.",
//     "seller_contact": "01810000007"
//   },
//   {
//     "title": "KTM RC 125",
//     "price_min": 4100,
//     "price_max": 4600,
//     "email": "mahmudulhasan@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-08T15:00:00Z",
//     "image": "https://i.pinimg.com/1200x/09/c8/de/09c8de3ffc484c1be966da6a2f6d5436.jpg",
//     "status": "pending",
//     "location": "Dhaka",
//     "seller_image": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
//     "seller_name": "Mahmudul Hasan",
//     "condition": "used",
//     "usage": "9 months",
//     "description": "Track inspired design.",
//     "seller_contact": "01910000008"
//   },
//   {
//     "title": "Royal Enfield Classic 350",
//     "price_min": 5200,
//     "price_max": 6000,
//     "email": "tanvirrahman@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-09T18:30:00Z",
//     "image": "https://i.pinimg.com/1200x/81/2c/01/812c014fa4a71d2736deb1cede74cb6c.jpg",
//     "status": "sold",
//     "location": "Cumilla",
//     "seller_image": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
//     "seller_name": "Tanvir Rahman",
//     "condition": "used",
//     "usage": "2 years",
//     "description": "Classic cruiser, heavy build.",
//     "seller_contact": "01710000009"
//   },
//   {
//     "title": "KTM Duke 200",
//     "price_min": 4300,
//     "price_max": 4800,
//     "email": "shakilahmed@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-10T20:00:00Z",
//     "image": "https://i.pinimg.com/1200x/e6/a6/29/e6a62956029c037aeb5892a86dcb8289.jpg",
//     "status": "pending",
//     "location": "Rangpur",
//     "seller_image": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
//     "seller_name": "Shakil Ahmed",
//     "condition": "used",
//     "usage": "1 year",
//     "description": "Street fighter, great acceleration.",
//     "seller_contact": "01610000010"
//   },
//   {
//     "title": "Suzuki GSX-R150",
//     "price_min": 4500,
//     "price_max": 5000,
//     "email": "rashedmahmud@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-11T09:00:00Z",
//     "image": "https://i.pinimg.com/736x/c6/c4/49/c6c449de3885a868487a619adc5a7e81.jpg",
//     "status": "pending",
//     "location": "Gazipur",
//     "seller_image": "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
//     "seller_name": "Rashed Mahmud",
//     "condition": "used",
//     "usage": "8 months",
//     "description": "Lightweight sport bike, smooth ride.",
//     "seller_contact": "01810000011"
//   },
//   {
//     "title": "Honda CB Hornet 160R",
//     "price_min": 3300,
//     "price_max": 3700,
//     "email": "sohelrana@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-12T10:15:00Z",
//     "image": "https://i.pinimg.com/736x/18/5d/1f/185d1f02dbfcdaac549d065bde77498c.jpg",
//     "status": "pending",
//     "location": "Mymensingh",
//     "seller_image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
//     "seller_name": "Sohel Rana",
//     "condition": "used",
//     "usage": "1 year",
//     "description": "Balanced performance, good mileage.",
//     "seller_contact": "01510000012"
//   },
//   {
//     "title": "Yamaha FZ-S V3",
//     "price_min": 3000,
//     "price_max": 3400,
//     "email": "anikaislam@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-13T11:45:00Z",
//     "image": "https://i.pinimg.com/736x/57/a9/27/57a9274cebd8dd4c073786162b7c0be3.jpg",
//     "status": "pending",
//     "location": "Narayanganj",
//     "seller_image": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
//     "seller_name": "Anika Islam",
//     "condition": "used",
//     "usage": "9 months",
//     "description": "Smooth city ride, lightweight.",
//     "seller_contact": "01910000013"
//   },
//   {
//     "title": "TVS Apache RTR 200 4V",
//     "price_min": 4000,
//     "price_max": 4500,
//     "email": "kamrulislam@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-14T08:30:00Z",
//     "image": "https://i.pinimg.com/736x/ba/5b/91/ba5b9149cc171cadd58a93dee51ab9ea.jpg",
//     "status": "pending",
//     "location": "Bogura",
//     "seller_image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
//     "seller_name": "Kamrul Islam",
//     "condition": "fresh",
//     "usage": "Unused",
//     "description": "Powerful performance, brand new.",
//     "seller_contact": "01710000014"
//   },
//   {
//     "title": "Bajaj Pulsar NS200",
//     "price_min": 4200,
//     "price_max": 4700,
//     "email": "nazmulhossain@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-15T09:45:00Z",
//     "image": "https://i.pinimg.com/736x/42/99/2f/42992faf0e8e36e24b3a01e3f233bf37.jpg",
//     "status": "pending",
//     "location": "Jessore",
//     "seller_image": "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
//     "seller_name": "Nazmul Hossain",
//     "condition": "used",
//     "usage": "1 year",
//     "description": "High speed, comfortable ride.",
//     "seller_contact": "01810000015"
//   },
//   {
//     "title": "Royal Enfield Meteor 350",
//     "price_min": 5500,
//     "price_max": 6200,
//     "email": "afsanarahman@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-16T10:30:00Z",
//     "image": "https://i.pinimg.com/1200x/81/2c/01/812c014fa4a71d2736deb1cede74cb6c.jpg",
//     "status": "pending",
//     "location": "Dhaka",
//     "seller_image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
//     "seller_name": "Afsana Rahman",
//     "condition": "fresh",
//     "usage": "Unused",
//     "description": "Comfortable cruiser, brand new.",
//     "seller_contact": "01610000016"
//   },
//   {
//     "title": "KTM Duke 390",
//     "price_min": 7000,
//     "price_max": 7500,
//     "email": "masudrana@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-17T11:15:00Z",
//     "image": "https://i.pinimg.com/736x/69/7f/9d/697f9d35b2a7087f48a986dc838f08cf.jpg",
//     "status": "pending",
//     "location": "Dhaka",
//     "seller_image": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
//     "seller_name": "Masud Rana",
//     "condition": "fresh",
//     "usage": "Unused",
//     "description": "High-end street bike, aggressive styling.",
//     "seller_contact": "01910000017"
//   },
//   {
//     "title": "Honda CB Shine SP",
//     "price_min": 2900,
//     "price_max": 3300,
//     "email": "rifathasan@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-18T12:00:00Z",
//     "image": "https://i.pinimg.com/736x/0a/31/f1/0a31f153febab902d13a5c354a3a6c6c.jpg",
//     "status": "pending",
//     "location": "Chattogram",
//     "seller_image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
//     "seller_name": "Rifat Hasan",
//     "condition": "used",
//     "usage": "1 year",
//     "description": "Smooth commuter bike, low mileage.",
//     "seller_contact": "01710000018"
//   },
//   {
//     "title": "TVS Sport",
//     "price_min": 2200,
//     "price_max": 2600,
//     "email": "rashedmahmud@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-19T10:45:00Z",
//     "image": "https://i.pinimg.com/1200x/a2/3b/2d/a23b2dd5dc38a619d92f374df20eef25.jpg",
//     "status": "pending",
//     "location": "Rangpur",
//     "seller_image": "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
//     "seller_name": "Rashed Mahmud",
//     "condition": "used",
//     "usage": "9 months",
//     "description": "Reliable city bike, great mileage.",
//     "seller_contact": "01810000019"
//   },
//   {
//     "title": "Hero Glamour FI",
//     "price_min": 2500,
//     "price_max": 2900,
//     "email": "abdulkarim@gmail.com",
//     "category": "Bike",
//     "created_at": "2025-02-20T11:30:00Z",
//     "image": "https://i.pinimg.com/736x/73/59/57/735957f6a69322e3780dbca85de7e286.jpg",
//     "status": "pending",
//     "location": "Khulna",
//     "seller_image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
//     "seller_name": "Abdul Karim",
//     "condition": "used",
//     "usage": "1 year",
//     "description": "Efficient commuter, lightweight and smooth.",
//     "seller_contact": "01810000020"
//   }
// ]
