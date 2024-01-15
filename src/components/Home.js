import React, {useState} from "react";
import {Button, ToggleButton} from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import MapView2 from "./MapView2.js";
import ToggleButton2 from "./ToggleButton2.js";

const Home = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const [isToggled, setToggled] = useState(false);
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleToggle = () => {
    setToggled(!isToggled);
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
        <MapView2 isToggled={isToggled}/>
        {/* <br></br>
        <br></br>
        <br></br>
        <br></br> */}
        <div align={"left"}>
          <ToggleButton2 isToggled={isToggled} onToggle={handleToggle}/>
        </div>
      </div>
    </>
  );
};

export default Home;
