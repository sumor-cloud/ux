export default () => {
    if(typeof window !== "undefined" && window){
        if (window.screen && window.screen.orientation) {
            return window.screen.orientation.type === 'landscape-primary'
                || window.screen.orientation.type === 'landscape-secondary'
        }else{
            if (window.screen.availHeight > window.screen.availWidth)
                return "portrait";
            else
                return "landscape";
        }
    }
    return false;
}