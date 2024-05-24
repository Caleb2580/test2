
function getSelectedYear() {
    let e = document.querySelector('.years');
    if (e != null) {
        return e.querySelector('.arc.selected');
    }
    return null;
}

function selectYear(e) {
    let y = getSelectedYear();
    if (y != null) {
        y.classList.remove('selected');
    }
    e.classList.add('selected');
}


blog_posts = [
    {
        title: 'Sailing to Maryland',
        blog: 'Test Test Test',
        image_path: 'static/blog_posts/1.jpg'
    }
]

// years = [
//     '2024',
//     '2023',
//     '2022',
//     '2021'
// ]

years = []
for (let i = 2030; i > 2022; i--) {
    years.push(i.toString());
}

console.log(years);

months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]


archive_HTML = document.querySelector('.archive');
years_HTML = archive_HTML.querySelector('.years');
months_HTML = archive_HTML.querySelector('.months');

for (let i = 0; i < years.length; i++) {
    let yearDiv = document.createElement('div');
    yearDiv.innerHTML = years[i];
    yearDiv.classList.add('arc');
    if (i == 0) {
        yearDiv.classList.add('selected');
    }
    yearDiv.addEventListener('click', function(event) {
        selectYear(event.currentTarget);
    });
    years_HTML.appendChild(yearDiv);
    if (i != years.length-1) {
        let connecter = document.createElement('div');
        connecter.classList.add('connecter');
        years_HTML.appendChild(connecter);
    }
}

for (let i = 0; i < months.length; i++) {
    let monthDiv = document.createElement('div');
    monthDiv.innerHTML = months[i];
    monthDiv.classList.add('montharc');
    months_HTML.appendChild(monthDiv);
    // if (i != months.length-1) {
    //     let connecter = document.createElement('div');
    //     connecter.classList.add('monthconnecter');
    //     months_HTML.appendChild(connecter);
    // }
}

// archive_HTML.style = 'height: ' + years.length * 125 + 'px';


let url = window.location.href;
let paramsStr = url.substring(url.indexOf('?')+1, url.length);
let params = {
    'year': null,
    'month': null,
};
if (paramsStr.length > 0) {
    let paramsList = paramsStr.split('&');
    for (let p in paramsList) {
        let par = paramsList[p].split('=');
        if (par.length == 2) {
            if (par[0] == 'year') {
                params['year'] = par[1];
            }
        }
    }
}

console.log(params);












