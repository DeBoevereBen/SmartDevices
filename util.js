function formatTime(dt) {
    var minutes = Math.floor(dt / 60);
    var seconds = Math.floor(dt - (minutes * 60));
    var tenths = Math.floor(10 * (dt - Math.floor(dt)));
    if (minutes > 0)
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds + ":" + tenths;
    else
        return seconds + ":" + tenths;
}

module.exports = {
    formatTime: formatTime
};