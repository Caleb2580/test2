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
    let author = document.querySelector('input#author_search').value;

    let redir = '';

    if (monthSelected == 'All') {
        redir = '/admin/blogs?year=' + yearSelected;
    } else {
        redir = '/admin/blogs?year=' + yearSelected + '&month=' + months_n[months.indexOf(monthSelected)];
    }
    console.log(redir)

    if (author.length > 0) {
        redir += '&author=' + author;
    }

    location.href = redir;
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

        let author = null;
        if (urlParams.get('author') != null) {
            let author_raw = urlParams.get('author');
            author = "";
            for (let i = 0; i < author_raw.length; i++) {
                if (i == 0 || author_raw[i-1] === " ") {
                    author += author_raw[i].toUpperCase();
                } else {
                    author += author_raw[i];
                }
            }
            document.querySelector('input#author_search').value = author;
        }

        fetch('/api/get-blog?' + urlParams)
        .then(res => res.json())
        .then(res => {
            if (Array.isArray(res)) { // Day
                if (res.length == 0) {
                    return;
                } else if (res.length == 1) { // Display Blog
                    if (author != null && author !== res[0].author) {
                        return;
                    }
                    let blog_container = document.createElement('div');
                    blog_container.classList.add('blog_container');
                    let title = document.createElement('h1');
                    title.innerHTML = res[0]['title'];
                    let date = document.createElement('h2');
                    date.innerHTML = res[0]['date'];

                    let authorE = document.createElement('h2');
                    authorE.innerHTML = 'Posted By: ' + res[0]['author'];

                    let main = document.querySelector('.main');
                    blog_container.appendChild(title);
                    blog_container.appendChild(date);
                    blog_container.appendChild(authorE);
                    
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
                    // Display All in that day
                }
            } else {  // Dictionary
                let blogs_added = 0
                let fb = document.querySelector('.featured-blogs');
                if (fb == null) {
                    fb = document.createElement('div');
                    fb.classList.add('featured-blogs');
                    document.querySelector('.main').appendChild(fb);
                }
                for (let key in res) {
                    if (key_order[0] == "month") {
                        for (let day_key in res[key]) {
                            for (let d in res[key][day_key]) {
                                if (author != null && author !== res[key][day_key][d].author) {
                                    res[key][day_key].splice(d, 1);
                                } else {
                                    blogs_added += 1;
                                }
                            }
                            if (Object.keys(res[key][day_key]).length == 0) {
                                delete res[key][day_key];
                            }
                        }
                    } else {
                        for (let d in res[key]) {
                            if (author != null && author !== res[key][d].author) {
                                res[key].splice(d, 1);
                            } else { blogs_added += 1;}
                        }
                    }
                    if (Object.keys(res[key]).length == 0) {
                        delete res[key];
                    }
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
                                // bt.addEventListener('click', function(e) {
                                //     let date = res[key][day_key][d]['date'].split('/');
                                //     location.href = "/admin/blogs?year=" + date[2] + '&month=' + date[0] + '&day=' + date[1] + '&id=' + d;
                                //     delete date;
                                // });
                                let date = res[key][day_key][d]['date'].split('/');
                                bt.setAttribute('onclick', 'location.href = "/admin/blogs?year=' + date[2] + "&month=" + date[0] + "&day=" + date[1] + "&id=" + d + '"');
                                // Tools
                                
                                let tools_container = document.createElement('div');
                                tools_container.classList.add('tools_container');

                                let del_btn = document.createElement('button');
                                del_btn.innerHTML = '&#10005';
                                del_btn.addEventListener('click', function() {
                                    deleteBlog(this);
                                });

                                let edit_btn = document.createElement('button');
                                edit_btn.innerHTML = 'EDIT';
                                edit_btn.classList.add('edit');
                                edit_btn.addEventListener('click', function() {
                                    editBlog(this);
                                });

                                tools_container.appendChild(edit_btn);
                                tools_container.appendChild(del_btn)
                                fb.appendChild(tools_container);
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
                            // bt.addEventListener('click', function(e) {
                            //     let date = res[key][d]['date'].split('/');
                            //     location.href = "/admin/blogs?year=" + date[2] + '&month=' + date[0] + '&day=' + date[1] + '&id=' + d;
                            //     delete date;
                            // });
                            let date = res[key][d]['date'].split('/');
                            bt.setAttribute('onclick', 'location.href = "/admin/blogs?year=' + date[2] + "&month=" + date[0] + "&day=" + date[1] + "&id=" + d + '"');
                            // Tools
                                
                            let tools_container = document.createElement('div');
                            tools_container.classList.add('tools_container');

                            let del_btn = document.createElement('button');
                            del_btn.innerHTML = '&#10005';
                            del_btn.addEventListener('click', function() {
                                deleteBlog(this);
                            });

                            let edit_btn = document.createElement('button');
                            edit_btn.innerHTML = 'EDIT';
                            edit_btn.classList.add('edit');
                            edit_btn.addEventListener('click', function() {
                                editBlog(this);
                            });

                            tools_container.appendChild(edit_btn);
                            tools_container.appendChild(del_btn)
                            fb.appendChild(tools_container);
                        }
                    }
                }
                if (blogs_added == 0) {
                    document.querySelector('.featured-blogs').remove();
                }
            }
        })
    }
}

function deleteBlog(btn) {
    let fb = document.querySelector('.featured-blogs');
    let adds = fb.querySelectorAll('div.fp-holder, div.tools_container');

    let last = null;

    adds.forEach((add, index) => {
        if (add.querySelectorAll('button')[1] == btn && last != null) {
            console.log(last);
            console.log(add);

            let date = last.querySelector('h3').innerHTML.split('/');
            console.log(date);
            
            let blog = {
                'title': last.querySelector('h1').innerHTML,
                'month': date[0],
                'day': date[1],
                'year': date[2],
            }

            fetch('/admin/delete-post', {
                'method': 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(blog)
            }).then(res => res.json())
            .then(res => {
                if (res['success']) {
                    alert('Deleted!');
                    location.reload();
                } else {
                    alert(res['error']);
                }
            }) 

            // location.reload();
            return;
        }
        last = add;
    });
}

function editBlog(btn) {
    let fb = document.querySelector('.featured-blogs');
    let adds = fb.querySelectorAll('div.fp-holder, div.tools_container');

    let last = null;

    adds.forEach((add, index) => {
        if (add.querySelector('button.edit') == btn && last != null) {
            console.log(last);
            let bt = last.querySelector('.blog_title');
            let bt_fn = bt.onclick.toString();
            let link = bt_fn.substring(bt_fn.indexOf('"')+1, bt_fn.length);
            link = link.substring(link.indexOf('?'), link.indexOf('"'));
            location.href = '/admin/blog-editor' + link;
        }
        last = add;
    });
}


load();


start = 0;


function handleScrollWheel(amt) {
    let div = document.querySelector('div.everything');

    let dvh = document.querySelector('div.dvh_tracker');
    let dvh_height = window.getComputedStyle(dvh).height;
    dvh_height = parseFloat(dvh_height.substring(0, dvh_height.length-2));
    
    let dvh_width = window.getComputedStyle(dvh).width;
    dvh_width = parseFloat(dvh_width.substring(0, dvh_width.length));

    let margin = window.getComputedStyle(div).marginTop;
    margin = parseFloat(margin.substring(0, margin.length-2));
    let height = window.getComputedStyle(div).height;
    height = parseFloat(height.substring(0, height.length-2)) - dvh_height;
    let final_margin = margin - amt;
    final_margin = Math.min(Math.max(final_margin, -height), 0);
    div.style.marginTop = final_margin + "px";


    // let img = document.querySelector('.bg_image');
    // let img_margin = window.getComputedStyle(img).marginTop;
    // img_margin = parseFloat(img_margin.substring(0, img_margin.length-2));
    // let img_height = window.getComputedStyle(img).height;
    // img_height = parseFloat(img_height.substring(0, img_height.length-2)) - dvh_height;

    // console.log(Math.abs(final_margin /  height));
    // // final_margin = margin + (img_height * Math.abs(event.deltaY / height));
    // final_margin = -1 * (img_height - (Math.abs(final_margin / height) * img_height));

    // img.style.marginTop = final_margin + "px";

    let img = document.querySelector('.bg_image_container');
    let img_width = window.getComputedStyle(img).width;
    img_width = parseFloat(img_width.substring(0, img_width.length-2)) - dvh_width;

    // final_margin = margin + (img_height * Math.abs(event.deltaY / height));
    final_margin = (-1 * (Math.abs(final_margin / height) * img_width)) - (.05 * dvh_width);

    img.style.marginLeft = final_margin + "px";

}

function handleScrollWheelComputer(event) {
    handleScrollWheel(event.deltaY / 2);
}

function handleScrollWheelMobile(event) {
    handleScrollWheel(start - event.touches[0].clientY);
    dif = (start - event.touches[0].clientY)
    start = event.touches[0].clientY;
}

function decreaseMobile(amt, first=false) {
    let a = 0;
    if (first) {
        a = dif * .9;
    } else {
        if (a > 10) {
            a = amt * .9;
        } else if (a > 7) {
            a = amt * .95
        } else {
            a = amt * .98;
        }
    }
    if (Math.abs(a) < 1) {
        return;
    }
    console.log(a);
    handleScrollWheel(a)
    setTimeout(() => {
        decreaseMobile(a);
    }, 10);

}

window.addEventListener('wheel', handleScrollWheelComputer);
window.addEventListener('touchstart', function(event) {
    start = event.touches[0].clientY;
})
window.addEventListener('touchmove', handleScrollWheelMobile);
window.addEventListener('touchend', function(event) {
    decreaseMobile(event, first=true)
});



