// Implementing a timer feature using the Date() function in JS

function currentTime() {
    const timeElement = document.getElementById("time");
    const dateElement = document.getElementById("date");

    const now = new Date(); // Current date and time values

    const hours = (now.getHours() % 12) || 12;
    const mins = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
    const seconds = (now.getSeconds() < 10)? `0${now.getSeconds}` : now.getSeconds();
    const ampm = now.getHours() < 12 ? "AM" : "PM;"

    timeElement.innerText = `${hours}:${mins}:${seconds} ${ampm}`;

    options = {
        weekda: "long",

    }

    now.toLocaleDateString(undefined, options); // undefined locale means it will use the browser's default locale timezone  which ensures the date is displayed correctly based on the user's location
}

setInterval(() => { // Update the time every second using setInterval
    currentTime();
}, 1000)

currentTime(); // Initial call to set the time immediately as soon as the page loads