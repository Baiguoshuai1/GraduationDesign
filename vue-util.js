export default {
  //标准时间转换为yyyy-mm-dd hh:tt
  formatDateTime(date) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    //m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    let s = date.getSeconds()
    s = s < 10 ? ('0' + s) : s;
     const Nowtime=new Date().toLocaleDateString()
     const YeaderMonth=y + '/' + m + '/' + d
    if(Nowtime==YeaderMonth){
      return `今天 ${h}:${minute}`
    }else if(Nowtime.substring(0,4)==y){
      return m + '月' + d + '日 ' + h + ':' + minute
    } else{
      return y + '年' + m + '月' + d + '日 ' + h + ':' + minute
    }
  },
  //转换为标准时间
  formatterDate(date) {
    let result = new Date(date);
    return result
  },
  //数字隔三位加逗号
  thousands(num) {
    var str = num.toString();
    var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
    return str.replace(reg, "$1,");
  },
  //随机颜色
  getRandomColor() {
    return '#' + Math.random().toString(16).slice(2, 8)
  },
  sleep(ms = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  },
  myBrowser() {
    let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    let isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) { //判断是否Opera浏览器
      return "Opera"
    }

    if (userAgent.indexOf("Firefox") > -1) { //判断是否Firefox浏览器
      return "FF";
    }

    if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
    }

    if (userAgent.indexOf("Safari") > -1) { //判断是否Safari浏览器
      return "Safari";
    }
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { //判断是否IE浏览器
      return "IE";
    }
  },
  GetPercent(num, total) {
    num = parseFloat(num);
    total = parseFloat(total);
    if (isNaN(num) || isNaN(total)) {
      return "-";
    }
    return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00)+"%";
  },
  //拼接参数
  jointParams(params){
    let arr=[]
    for (const key in params) {
        arr.push(`${key}=${params[key]}`);
    }
    return arr.join('&')
  },
  //a导出
  exportExcel(path,params,name,url='http://47.100.218.45:18082'){
    let elink = document.createElement('a');
    elink.download = `${name}.xlsx`;
    elink.style.display = 'none';
    elink.href = `${url}${path}?json=${encodeURIComponent(JSON.stringify(params))}`
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }

}


