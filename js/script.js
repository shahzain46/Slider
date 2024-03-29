const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const firstCardWidth =carousel.querySelector(".card").offsetWidth;
const carouselChildren = [...carousel.children]


let isDragging = false, startX, startScollLeft, timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth)


// Insert copies of the last few cards to begining of the carousel for infinite scrolling
carouselChildren.slice(0 ,cardPerView).forEach(card => {
    carousel.insertAdjacentHTML('afterbegin', card.outerHTML)
})

// Insert copies of the first few cards to end of the carousel for infinite scrolling
carouselChildren.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML('beforeend', card.outerHTML)
})

// Add event listener for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth
    })
})

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging")
    // records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Update the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScollLeft - (e.pageX - startX)
}
const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging")
}

const autoPlay = () => {
    if(window.innerWidth < 800) return; // Return if window is smaller than 800
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500)
}
autoPlay()

const infiniteScroll = () =>{
    // If the carousel is at the beginning, scroll to end
    if(carousel.scrollLeft === 0){
        carousel.classList.add("no-transition")
        carousel.scrollLeft = carousel.scrollWidth - ( 2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition")
    // If the carousel is at the end, scroll to the beginning
    } else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth){
        carousel.classList.add("no-transition")
        carousel.scrollLeft = carousel.offsetWidth
        carousel.classList.remove("no-transition")
    }
    // clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

carousel.addEventListener('mousedown', dragStart);
carousel.addEventListener('mousemove', dragging);
document.addEventListener('mouseup', dragStop);
carousel.addEventListener('scroll', infiniteScroll);
wrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId));
wrapper.addEventListener('mouseleave', autoPlay);