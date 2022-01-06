'use strict';

function filterLogs(logs, from, to, limit = logs.length) {
    
    let arr = [...logs];
    if (logs.length === 0) {
        return arr;
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
    const date = `${rawDate.getFullYear()}-${rawDate.getMonth() + 1}-${rawDate.getDate()}`;
    
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

function exercisesFormatResponse(user) {
    
    return {
        _id: user._id,
        username: user.username,
        date: user.log[user.log.length - 1].date,
        duration: user.log[user.log.length - 1].duration,
        description: user.log[user.log.length - 1].description
    }
}





module.exports = {
    filterLogs,
    exercisesUpdate,
    exercisesFormatResponse,
}