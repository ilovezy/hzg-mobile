export function formatDate(value) {
  var date = new Date(value);
  var year = date.getFullYear();
  var month = "0" + (date.getMonth() + 1);
  var day = "0" + date.getDate();
  var hh = "0" + date.getHours();
  var mm = "0" + date.getMinutes();
  var ss = "0" + date.getSeconds();
  return year + "年" + month.substring(month.length - 2, month.length) + "月" + day.substring(day.length - 2, day.length) + '日 '+ hh.substring(hh.length - 2, hh.length)+':'+mm.substring(mm.length - 2, mm.length)+':'+ss.substring(ss.length - 2, ss.length);
}

export function formatDateMD(value) {
  var date = new Date(value);
  var month = "0" + (date.getMonth() + 1);
  var day = "0" + date.getDate();
  return month.substring(month.length - 2, month.length) + "月" + day.substring(day.length - 2, day.length) + '日';
}
