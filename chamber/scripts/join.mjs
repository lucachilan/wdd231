import { dateFooter } from './date.mjs';
dateFooter();
import { dislpayNavigation } from './navigation.mjs';
dislpayNavigation();

// form starting here
document.getElementById("join-form").addEventListener("submit", function () {
    document.getElementById("timestamp").value = new Date().toISOString();
});

// dialogs 
const modals = document.querySelectorAll(".member-dialog");
const learnMoreLinks = document.querySelectorAll(".learn-more");
const closeDialogs = document.querySelectorAll(".close-dialog");

learnMoreLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const modalId = link.getAttribute("data-modal");
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.showModal();
        }
    });
});

closeDialogs.forEach(button => {
    button.addEventListener("click", () => {
        button.closest("dialog").close();
    });
});

modals.forEach(modal => {
    modal.addEventListener("click", (e) => {
        const dialogDimensions = modal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            modal.close();
        }
    });
});

const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const cards = document.querySelectorAll('.member-card');
cards.forEach(card => observer.observe(card));
