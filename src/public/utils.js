const utils = {
  dynComponentsImport: () => {
    let components = {};
    let map = [];
    const ctx = require.context("@/views/", true, /\.component.js$/);
    ctx.keys().forEach((key) => {
      map = map.concat(ctx(key).default);
    });
    map.forEach((val) => {
      components = Object.assign(components, val);
    });
    return components;
  },
  dynRoutesImport: () => {
    let map = [];
    const ctx = require.context("@/views/", true, /\.route.js$/);
    ctx.keys().forEach((key) => {
      map = map.concat(ctx(key).default);
    });
    return map;
  },
};

export default utils;
