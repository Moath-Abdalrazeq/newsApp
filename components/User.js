 import React  from "react";
 import JournalistScreen from "./JournalistScreen";
import ClientScreen from "./ClientScreen";
import AdminScreen from "./AdminScreen";
import { firebase } from "../config";
import "firebase/firestore";

 
const User = (props) => {
  const { role } = props;

 
  if ({role}=== "journalist") {
    return <JournalistScreen />;
  } else if ({role} === "admin") {
    return <AdminScreen />;
  } else {
    return <ClientScreen />;
  }
};

export default User;
