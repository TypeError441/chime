export function useCookies() {
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;

        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
        
        return null;
    };

    // set a cookie
    const setCookie = (name, value) => {
        document.cookie = `${name}=${value}; expires=Tue, 03 Nov 2099 00:00:00 GMT; path=/`;
    };

    return {
        getCookie,
        setCookie
    };
}