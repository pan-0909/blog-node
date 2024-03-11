//使用时引入包，调用函数传入一个日期即可
function formatDate(value) {
	let data = new Date(value)
	var y = data.getFullYear()
	var m  = data.getMonth() + 1
	m= m < 10 ? ('0' + m) : m;
	var d = data.getDate()
	d = d < 10 ? ('0' + d) : d;
	var h = data.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = data.getMinutes();
	minute = minute < 10 ? ('0' + minute) : minute;
	var second= data.getSeconds();
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

module.exports = {
    formatDate,
  };