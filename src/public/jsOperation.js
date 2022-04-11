/*
 * @Descripttion: js 运算
 * @version: 1.0.0
 * @Date: 2020-04-27
 */

/**
 * 加
 */
export function JSAdd(a, b) {
  if (!a || !b) {
    return a + b;
  }
  let c, d;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  const h = Math.pow(10, Math.max(c, d));
  return (JSMul(a, h) + JSMul(b, h)) / h;
}

/**
 * 减
 */
export function JSSub(a, b) {
  if (!a || !b) {
    return a - b;
  }
  let c, d;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  const h = Math.pow(10, Math.max(c, d));
  return (JSMul(a, h) - JSMul(b, h)) / h;
}

/**
 * 乘
 */
export function JSMul(a, b) {
  if (!a || !b) {
    return 0;
  }
  let c = 0;
  const d = a.toString();
  const e = b.toString();
  try {
    if (d.split(".")[1]) {
      c += d.split(".")[1].length;
    }
  } catch (f) {
    console.log(f);
  }
  try {
    if (e.split(".")[1]) {
      c += e.split(".")[1].length;
    }
  } catch (f) {
    console.log(f);
  }
  const result =
    (Number(d.replace(".", "")) * Number(e.replace(".", ""))) / Math.pow(10, c);
  return result;
}

/**
 * 除
 */
export function JSDiv(a, b) {
  if (!a || !b) {
    return 0;
  }
  let e = 0;
  let f = 0;
  try {
    if (a.toString().split(".")[1]) {
      e = a.toString().split(".")[1].length;
    }
  } catch (g) {
    console.log(g);
  }
  try {
    if (b.toString().split(".")[1]) {
      f = b.toString().split(".")[1].length;
    }
  } catch (g) {
    console.log(g);
  }
  const result = JSMul(
    Number(a.toString().replace(".", "")) /
      Number(b.toString().replace(".", "")),
    Math.pow(10, f - e)
  );
  return result;
}

/**
 * 格式化总价
 */
export function formatSum(a, b) {
  if (!a || !b) {
    return 0;
  }
  let c = 0;
  const d = a.toString();
  const e = b.toString();
  try {
    if (d.split(".")[1]) {
      c += d.split(".")[1].length;
    }
  } catch (f) {
    console.log(f);
  }
  try {
    if (e.split(".")[1]) {
      c += e.split(".")[1].length;
    }
  } catch (f) {
    console.log(f);
  }
  const result =
    (Number(d.replace(".", "")) * Number(e.replace(".", ""))) / Math.pow(10, c);
  return result;
}
