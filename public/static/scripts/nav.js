
function menuButtonPressed() {
    let e = document.querySelector('.items');
    let e_container = document.querySelector('.itemscontainer');
    if (e != null && e_container != null) {
        if (e.classList.contains('show')) {
            e.classList.remove('show');
            e_container.classList.remove('show');
        } else {
            e.classList.add('show');
            e_container.classList.add('show');
        }
    }
}













