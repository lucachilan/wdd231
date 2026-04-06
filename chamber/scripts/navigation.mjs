export function dislpayNavigation() {

    const hamButton = document.querySelector("#menu");
    const navigation = document.querySelector(".navigation");
    const headerText = document.querySelector("header");

    hamButton.addEventListener("click", () => {
        navigation.classList.toggle("open");
        hamButton.classList.toggle("open");
        headerText.classList.toggle("open");
    });

    function checkScreen() {
        if (window.innerWidth >= 1024) {
            navigation.classList.add("open");
            headerText.classList.add("open");
        } else {
            navigation.classList.remove("open");
            hamButton.classList.remove("open");
            headerText.classList.remove("open");
        }
    }

    checkScreen();

    window.addEventListener("resize", checkScreen);
}