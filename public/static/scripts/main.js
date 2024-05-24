// window.addEventListener('scroll', function() {
//     var nav = document.querySelector('.nav');
//     if (window.scrollY > 50) {
//         nav.style.height = '50px';
//         nav.style.padding = '10px 0';
//     } else {
//         nav.style.height = '100px';
//         nav.style.padding = '20px 0';
//     }
// });

window.addEventListener('scroll', function() {
    var nav = document.querySelector('.nav');
    var nav_logo = document.querySelector('.nav img');
    if (window.scrollY > 50) {
        nav.classList.add('min');
        nav_logo.classList.add('min');
    } else {
        nav.classList.remove('min');
        nav_logo.classList.remove('min');
    }
});


