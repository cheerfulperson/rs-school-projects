export function $(str, all = false) {
    return all ? document.querySelectorAll(str) : document.querySelector(str);
}

export async function fetchData(url = '', data = {}, meth = 'GET', contentType = 'application/json') {
    const response = await fetch(url, {
        method: meth,
    });

    return response.json(); // parses JSON response into native JavaScript objects
}

export function hasChildren(path, parent) {
    return path.find(e => e == parent) ? true : false;
}