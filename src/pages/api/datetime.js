function getDate(dateTime) {
    // dateTime = dateTime.replace('Z', '');
    let date = new Date(dateTime);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = `0${month}`.slice(-2);
    day = `0${day}`.slice(-2);
    return `${year}-${month}-${day}`;
}

function getTimeFromMySql(dateTime) {
    let date = new Date(dateTime);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    month = `0${month}`.slice(-2);
    day = `0${day}`.slice(-2);
    hour = `0${hour}`.slice(-2);
    min = `0${min}`.slice(-2);
    sec = `0${sec}`.slice(-2);
    return `${day}/${month}/${year} ${hour}:${min}:${sec}`;
}

function getTimeToMySql() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    month = `0${month}`.slice(-2);
    day = `0${day}`.slice(-2);
    hour = `0${hour}`.slice(-2);
    min = `0${min}`.slice(-2);
    sec = `0${sec}`.slice(-2);
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

export {
    getDate,
    getTimeFromMySql,
    getTimeToMySql
}