
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

months_n = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12'
]


let scrolling = false;

let min_scroll = 0;
let max_scroll = 2;

let start = 0

let amount = 0;

function handleScrollWheel(event) {
    console.log(event);
    if (!scrolling) {
        scrolling = true;
        amount += event.deltaY > 0 ? 1 : -1;
        if (amount < min_scroll) {
            amount = min_scroll;
        } else if (amount > max_scroll) {
            amount = max_scroll;
        }
        scrollTo({
            top: window.innerHeight * amount,
            left: 0,
            behavior: 'smooth'
        })
        setTimeout(() => {
            scrolling = false;
        }, 250);
    }
}

function handleScrollMobile(event) {
    if (!scrolling) {
        scrolling = true;
        amount += event.touches[0].clientY < start ? 1 : -1;
        if (amount < min_scroll) {
            amount = min_scroll;
        } else if (amount > max_scroll) {
            amount = max_scroll;
        }
        scrollTo({
            top: window.innerHeight * amount,
            left: 0,
            behavior: 'smooth'
        });
    }
}


window.addEventListener('wheel', handleScrollWheel);
window.addEventListener('touchstart', function(event) {
    start = event.touches[0].clientY;
})
window.addEventListener('touchmove', handleScrollMobile);
window.addEventListener('touchend', function(event) {
    console.log('hello');
    scrolling = false;
})



function goTime() {
    let month = document.querySelector('select#month');
    let year = document.querySelector('select#year');

    let monthSelected = month.options[month.selectedIndex].value;
    let yearSelected = year.options[year.selectedIndex].value;

    if (monthSelected == 'All') {
        location.href = '/blog?year=' + yearSelected;
    } else {
        location.href = '/blog?year=' + yearSelected + '&month=' + months_n[months.indexOf(monthSelected)];
    }
}



