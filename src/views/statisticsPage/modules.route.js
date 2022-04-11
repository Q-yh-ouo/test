/*
 * @author: 郭湛良-景兴
 * @since: 2021-06-28
 */
let routes = {
  path: "/home/statisticsPage/:pid",
  name: "statisticsPage",
  component: () => import("@/views/statisticsPage"),
};
export default routes;
