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
