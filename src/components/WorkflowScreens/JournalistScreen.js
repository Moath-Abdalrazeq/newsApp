import * as React from "react";
import Menu from "../Menu";
 
 
export default function JournalistScreen() {
  const user = { isAdmin: false, isJournalist: true };

  return <Menu user={user} />;
}
