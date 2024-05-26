function openMobileMenu() {
    let mm = document.querySelector('.mobile_menu');
    let top = window.getComputedStyle(mm).top;

    if (top === '-300px') {
        mm.style.top = "0px";
    } else {
        mm.style.top = '-300px';
    }
}