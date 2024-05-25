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

function load() {
    const urlParams = new URLSearchParams(window.location.search);

    let key_order = ["year", "month", "day"]

    const year = urlParams.get('year');
    if (year != null) {

        let monthE = document.querySelector('select#month');
        let yearE = document.querySelector('select#year');

        for (let i in yearE.options) {
            if (yearE[i].value == year) {
                yearE.selectedIndex = i;
            }
        }

        key_order.shift();
        const month = urlParams.get('month');
        if (month != null) {
            key_order.shift();
            const day = urlParams.get('day');
            const id = urlParams.get('id');

            for (let i in monthE.options) {
                if (monthE[i].value === months[months_n.indexOf(month)]) {
                    monthE.selectedIndex = i;
                }
            }
        }

        fetch('/api/get-blog?' + urlParams)
        .then(res => res.json())
        .then(res => {
            if (Array.isArray(res)) { // Day
                if (res.length == 0) {
                    return;
                } else if (res.length == 1) { // Display Blog
                    let blog_container = document.createElement('div');
                    blog_container.classList.add('blog_container');
                    let title = document.createElement('h1');
                    title.innerHTML = res[0]['title'];
                    let date = document.createElement('h2');
                    date.innerHTML = res[0]['date'];

                    let main = document.querySelector('.main');
                    blog_container.appendChild(title);
                    blog_container.appendChild(date);
                    
                    blog_container.innerHTML += res[0]['content'];

                    // let ps = res[0]['content'].split('\n');
                    // for (let p in ps) {
                    //     let content = document.createElement('p');
                    //     content.innerHTML = ps[p];
                    //     blog_container.appendChild(content);
                    // }
                    main.appendChild(blog_container);
                } else {
                    if (document.querySelector('.featured-blogs') == null) {
                        let fb = document.createElement('div');
                        fb.classList.add('featured-blogs');
                        document.querySelector('.main').appendChild(fb);
                    }
                    console.log(res);  // Display All in that day
                }
            } else {  // Dictionary
                let fb = document.querySelector('.featured-blogs');
                if (fb == null) {
                    fb = document.createElement('div');
                    fb.classList.add('featured-blogs');
                    document.querySelector('.main').appendChild(fb);
                }
                for (let key in res) {
                    let monthHeader = document.createElement('h1');
                    monthHeader.classList.add('monthHeader');
                    if (key_order[0] == "month") {
                        monthHeader.innerHTML = months[months_n.indexOf(key)];
                        fb.appendChild(monthHeader);
                        for (let day_key in res[key]) {
                            for (let d in res[key][day_key]) {
                                // <div class="fp-holder">
                                //     <div class="fp">
                                //         <img src="/blog_posts/Sailing to Maryland/1.jpg" alt="">
                                //         <div class="blog_title"><h1>Sailing to Maryland</h1><h3>May 5th, 2024</h3></div>
                                //     </div>
                                // </div>
                                let fpHolder = document.createElement('div');
                                fpHolder.classList.add('fp-holder');
                                let fp = document.createElement('div');
                                fp.classList.add('fp');
                                let img = document.createElement('img');
                                img.setAttribute('src', res[key][day_key][d]['featured_image']);
                                fp.appendChild(img);
                                let bt = document.createElement('div');
                                bt.classList.add('blog_title');
                                let h1 = document.createElement('h1');
                                h1.innerHTML = res[key][day_key][d]['title'];
                                let h3 = document.createElement('h3');
                                h3.innerHTML = res[key][day_key][d]['date'];
                                bt.appendChild(h1);
                                bt.appendChild(h3);
                                fp.appendChild(bt);
                                fpHolder.appendChild(fp);
                                fb.appendChild(fpHolder);
                                bt.addEventListener('click', function(e) {
                                    let date = res[key][day_key][d]['date'].split('/');
                                    location.href = "/blog?year=" + date[2] + '&month=' + date[0] + '&day=' + date[1] + '&id=' + d;
                                    delete date;
                                });
                            }
                        }
                    } else {
                        monthHeader.innerHTML = months[months_n.indexOf(month)] + ' ' + key;
                        fb.appendChild(monthHeader);
                        for (let d in res[key]) {
                            // <div class="fp-holder">
                            //     <div class="fp">
                            //         <img src="/blog_posts/Sailing to Maryland/1.jpg" alt="">
                            //         <div class="blog_title"><h1>Sailing to Maryland</h1><h3>May 5th, 2024</h3></div>
                            //     </div>
                            // </div>
                            let fpHolder = document.createElement('div');
                            fpHolder.classList.add('fp-holder');
                            let fp = document.createElement('div');
                            fp.classList.add('fp');
                            let img = document.createElement('img');
                            img.setAttribute('src', res[key][d]['featured_image']);
                            fp.appendChild(img);
                            let bt = document.createElement('div');
                            bt.classList.add('blog_title');
                            let h1 = document.createElement('h1');
                            h1.innerHTML = res[key][d]['title'];
                            let h3 = document.createElement('h3');
                            h3.innerHTML = res[key][d]['date'];
                            bt.appendChild(h1);
                            bt.appendChild(h3);
                            fp.appendChild(bt);
                            fpHolder.appendChild(fp);
                            fb.appendChild(fpHolder);
                            bt.addEventListener('click', function(e) {
                                let date = res[key][d]['date'].split('/');
                                location.href = "/blog?year=" + date[2] + '&month=' + date[0] + '&day=' + date[1] + '&id=' + d;
                                delete date;
                            });
                        }
                    }
                }
            }
        })
    }
}

load();




