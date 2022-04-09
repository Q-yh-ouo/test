const date = new Date();
let dateYear = date.getFullYear();
let dateMonth = date.getMonth();

dateMonth = dateMonth < 10 ? "0" + dateMonth : dateMonth;
let dateDays = dateYear + "" + dateMonth;
let dateYears = String(dateYear);

const dateHandle = (data) => {
  let year = data.substr(0, 4);
  let month = data.substr(4, 2);
  let total = new Date(year, month, 0).getDate();
  let startDay = year + month + "01";
  let endDay = year + month + total;
  return {
    month,
    startDay,
    endDay,
  };
};

const lastdate = (data) => {
  let year = data.substr(0, 4);
  let month = data.substr(4, 2);
  if (month == "01") {
    year = year - 1;
    month = "12";
  } else {
    month = month - 1;
    month = month < 10 ? "0" + month : month;
  }
  let lastDate = year + "" + month;
  return dateHandle(lastDate);
};

const yearHandle = (data) => {
  let year = data.substr(0, 4);
  let startDay = year + "01" + "01";
  let endDay = year + "12" + "31";
  return {
    startDay,
    endDay,
  };
};

export default {
  dateDays,
  dateYears,
  dateHandle,
  lastdate,
  yearHandle,
  // seasonHandle
};
