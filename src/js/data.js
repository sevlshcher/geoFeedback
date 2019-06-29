function getData() {
    let date = new Date();

    let day = date.getDate();
    let mon = date.getMonth() + 1;
    let year = date.getFullYear();
    let sec = date.getSeconds();
    let min = date.getMinutes();
    let hour = date.getHours();

    if (day < 10) { day = '0' + day}
    if (mon < 10) { mon = '0' + mon}
    if (sec < 10) { sec = '0' + sec}
    if (min < 10) { min = '0' + min}

    return `${year}.${mon}.${day} ${hour}:${min}:${sec}`
}

export {
    getData
}