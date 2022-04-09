let routes = {
  path: "/home/systemFlow/:pid",
  name: "systemFlow",
  component: () => import("@/views/systemFlow"),
};
export default routes;
