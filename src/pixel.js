class Pixel {
  constructor(event, timestamp, optional) {
    this.params = [];
    this.event = event;
    this.timestamp = timestamp;
    this.optional = Helper.optionalData(optional);
    this.buildParams();
    this.send();
  }

  buildParams() {
    const attr = this.getAttribute();
    for (var index in attr) {
      if (attr.hasOwnProperty(index)) {
        this.setParam(index, attr[index](index));
      }
    }
  }

  getAttribute() {
    return {
      id: () => Config.id, // website Id
      uid: () => Cookie.get("uid"), // user Id
      event_name: () => this.event, // event being triggered
      event_data: () => this.optional, // any event data to pass along
      version: () => Config.version, // openpixel.js version
      path: () => window.location.href, // document location
      referrer: () => document.referrer, // referrer location
      timestamp: () => this.timestamp, // timestamp when event was triggered
      document_encoding: () => document.characterSet, // document encoding
      screen_size: () => window.screen.width + "x" + window.screen.height, // screen resolution
      viewport: () => window.innerWidth + "x" + window.innerHeight, // viewport size
      color_deep: () => window.screen.colorDepth, // color depth
      document_title: () => document.title, // document title
      brower_name: () => Browser.nameAndVersion(), // browser name and version number
      is_mobile: () => Browser.isMobile(), // is a mobile device?
      user_agent: () => Browser.userAgent(), // user agent
      timezone_offset: () => new Date().getTimezoneOffset(), // timezone
      utm_source: (key) => Cookie.getUtm(key), // get the utm source
      utm_medium: (key) => Cookie.getUtm(key), // get the utm medium
      utm_term: (key) => Cookie.getUtm(key), // get the utm term
      utm_content: (key) => Cookie.getUtm(key), // get the utm content
      utm_campaign: (key) => Cookie.getUtm(key), // get the utm campaign
      otm_source: (key) => Cookie.getOtm(key), // get the otm source - for Omisocial tracking
      otm_medium: (key) => Cookie.getOtm(key), // get the otm medium - for Omisocial tracking
      otm_campaign: (key) => Cookie.getOtm(key), // get the otm campaign - for Omisocial tracking
      otm_position: (key) => Cookie.getOtm(key), // get the otm position - for Omisocial tracking
      ...Config.params,
    };
  }

  setParam(key, val) {
    if (Helper.isPresent(val)) {
      this.params.push(`${key}=${encodeURIComponent(val)}`);
    } else {
      this.params.push(`${key}=`);
    }
  }

  send() {
    window.navigator.sendBeacon ? this.sendBeacon() : this.sendImage();
  }

  sendBeacon() {
    window.navigator.sendBeacon(this.getSourceUrl());
  }

  sendImage() {
    this.img = document.createElement("img");
    this.img.src = this.getSourceUrl();
    this.img.style.display = "none";
    this.img.width = 1;
    this.img.height = 1;
    document.getElementsByTagName("body")[0].appendChild(this.img);
  }

  getSourceUrl() {
    return `${pixelEndpoint}?${this.params.join("&")}`;
  }
}
