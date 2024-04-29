export default () => {
    const size = {
        width: 0,
        height: 0,
    }
    if (typeof window !== "undefined" && window) {
        size.width = window.innerWidth;
        size.height = window.innerHeight;
    }
    return size;
}