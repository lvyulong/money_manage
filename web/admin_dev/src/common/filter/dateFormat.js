export default function (value) {
    var dateTime = new Date(value);
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth()+1;
    var date = dateTime.getDate();
    var h = dateTime.getHours()>9?dateTime.getHours():`0${dateTime.getHours()}`;
    var m = dateTime.getMinutes()>9?dateTime.getMinutes():`0${dateTime.getMinutes()}`;
    var s = dateTime.getSeconds()>9?dateTime.getSeconds():`0${dateTime.getSeconds()}`;

    if (!value){
        return ''
    }else{
        return `${year}-${month}-${date}  ${h}:${m}:${s}`
    }
}