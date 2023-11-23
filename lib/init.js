const basePath = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? '' : '/playground';

function inseartImportmap() {
  const script = document.createElement('script');
  script.type = 'importmap';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', basePath + '/importmap.json', false);
  xhr.send();
  script.innerHTML = xhr.responseText;
  document.head.append(script);
}

function installComponents() {
  const script = document.createElement('script');
  script.type = 'module';
  script.src = basePath + '/components/install.js';
  document.head.append(script);
}

(function init() {
  window.basePath = basePath;
  inseartImportmap();
  installComponents();
})();

