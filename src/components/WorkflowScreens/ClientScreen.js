import * as React from "react";

import Menu from "../Menu";
export default function ClientScreen() {
  const user = {isClient: true };
  return <Menu user={user} />;
}
