'use strict';

function filterLogs(logs, from, to, limit = logs.length) {
    
    let arr = [...logs];
    if (limit === 0 || logs.length === 0) {
        return [];
    }
    if (!Number.isNaN(Date.parse(from))) {
        arr = arr.filter(e => Date.parse(e.date) >= Date.parse(from));
    }
    if (!Number.isNaN(Date.parse(to))) {
        arr = arr.filter(e => Date.parse(e.date) <= Date.parse(to));
    }
    return arr.slice(0, limit);
}

function exercisesUpdate(body) {

    const rawDate = (body.date) ? new Date(body.date) : new Date();
    const date = rawDate.toDateString();
    
    return {
        $push: {
            log: {
                description: body.description,
                duration: +body.duration,
                date
            }
        }
    };
}

function exercisesFormatResponse(_id, user) {
    
    return {
        _id,
        username: user.username,
        date: user.log[user.log.length - 1].date,
        duration: +user.log[user.log.length - 1].duration,
        description: user.log[user.log.length - 1].description,
    }
}

function printObj(obj) {

    if (obj === undefined || obj === null) return obj;
    const keysArr = Object.keys(obj);
    if (keysArr.length === 0) return 'empty';
    const propArr = Object.values(obj);
    let str = '';
    for (let i = 0; i < keysArr.length; i++) {
      str += keysArr[i] + ': ' + (Array.isArray(propArr[i]) ? 'len:' + propArr[i].length : propArr[i]);
      if (i + 1 !== keysArr.length) {
        str += ', ';
      }    
    }
    return str;
  }




module.exports = {
    filterLogs,
    exercisesUpdate,
    exercisesFormatResponse,
    printObj,
}