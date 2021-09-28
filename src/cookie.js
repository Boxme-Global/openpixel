class Cookie {
    static prefix() {
        return `__${pixelFuncName}_`;
    }

    static set(name, value, minutes, path = '/') {
        let expires = '';
        if (Helper.isPresent(minutes)) {
            const date = new Date();
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            expires = `expires=${date.toGMTString()}; `;
        }
        document.cookie = `${this.prefix()}${name}=${value}; ${expires}path=${path}; SameSite=Lax`;
    }

    static get(name) {
        const _name = `${this.prefix()}${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(_name) === 0) return c.substring(_name.length, c.length);
        }
        return '';
    }

    static delete(name) {
        this.set(name, '', -100);
    }

    static exists(name) {
        return Helper.isPresent(this.get(name));
    }

    static setUtms() {
        const utmArray = ['utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign'];
        let exists = false;
        for (let i = 0, l = utmArray.length; i < l; i++) {
            if (Helper.isPresent(Url.getParameterByName(utmArray[i]))) {
                exists = true;
                break;
            }
        }
        if (exists) {
            let val, save = {};
            for (let i = 0, l = utmArray.length; i < l; i++) {
                val = Url.getParameterByName(utmArray[i]);
                if (Helper.isPresent(val)) {
                    save[utmArray[i]] = val;
                }
            }
            this.set('utm', JSON.stringify(save));
        }
    }

    static getUtm(name) {
        if (this.exists('utm')) {
            const utms = JSON.parse(this.get('utm'));
            return name in utms ? utms[name] : '';
        }
    }

    static setOtms() {
        const otmArray = ['otm_source', 'otm_medium', 'otm_campaign', 'otm_position'];
        let exists = false;
        for (let i = 0, l = otmArray.length; i < l; i++) {
            if (Helper.isPresent(Url.getParameterByName(otmArray[i]))) {
                exists = true;
                break;
            }
        }
        if (exists) {
            let val, save = {};
            for (let i = 0, l = otmArray.length; i < l; i++) {
                val = Url.getParameterByName(otmArray[i]);
                if (Helper.isPresent(val)) {
                    save[otmArray[i]] = val;
                }
            }
            this.set('otm', JSON.stringify(save));
        }
    }

    static getOtm(name) {
        if (this.exists('otm')) {
            const otms = JSON.parse(this.get('otm'));
            return name in otms ? otms[name] : '';
        }
    }
}
