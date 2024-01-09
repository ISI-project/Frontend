import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import MapView from "./MapView.js"
import MapView2 from "./MapView2.js";

const Home = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="p-4 box mt-3 mb-3 text-center container">
        <h1>Hello,</h1>
        <h3>
          {user && user.email}
        </h3>
        <Button variant="danger mb-2" onClick={handleLogout}>
          Log out
        </Button>
        <MapView2 />
        {/* <br></br>
        <br></br>
        <br></br>
        <br></br> */}
      </div>
    </>
  );
};

export default Home;
