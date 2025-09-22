window.addEventListener("error", (ev) => {
    alert(
        ev.message + "\n" 
        + ev.filename + ":" + ev.lineno + ":" + ev.colno + "\n\n"
        + ev.error.stackTrace);
})