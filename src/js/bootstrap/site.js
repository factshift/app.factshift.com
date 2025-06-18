function setSite(site) {
  window.spwashi.site = site;
  window.spwashi.setItem('site', site);
  document.body.dataset.siteName = site;
}

export function initSite(site) {
  const domain = site || window.location.hostname;
  switch (domain) {
    case 'factshift.com':
      setSite("factshift.com")
      break;
    case 'boon.land':
      setSite("boon.land")
      window.spwashi.parameters.defaultName = '*';
      break;
    case 'bane.land':
      setSite("bane.land")
      window.spwashi.parameters.defaultName = '.';
      break;
    case 'bone.land':
      setSite("bone.land")
      window.spwashi.parameters.defaultName = '#';
      break;
    case 'bonk.land':
      setSite("bonk.land")
      window.spwashi.parameters.defaultName = '!';
      break;
    case 'honk.land':
      setSite("honk.land")
      window.spwashi.parameters.defaultName = '*';
      break;
    case 'boof.land':
      setSite("boof.land")
      window.spwashi.parameters.defaultName = '_';
      break;
    case 'lore.land':
      setSite("lore.land")
      window.spwashi.parameters.defaultName = '~';
      break;
    case 'spwashi.com':
      setSite("spwashi.com")
      window.spwashi.parameters.defaultName = 'node';
      break;
    case 'localhost':
    default:
      setSite("localhost")
      window.spwashi.parameters.defaultName = '[ item ]';
      break;
  }
}