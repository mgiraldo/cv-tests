var grid = document.getElementById("grid");
var expansion, metadata;
var expanded;
var expansion;
var imageHash = {};
var metadata, palette;

var xmlhttp = new XMLHttpRequest(),
  method = "GET",
  url = "./colors-v4-closefar.json";
xmlhttp.open(method, url, true);
xmlhttp.onload = function(data) {
  parsed = JSON.parse(data.target.response);
  parsed.forEach(p => {
    var far = p.far;
    var mid = p.mid;
    var close = p.close;
    var uuid = p.id.replace("../images/scaled/", "").replace(".jpg", "");
    imageHash[p.id] = {
      far: far,
      mid: mid,
      close: close,
      url: p.id.replace("..", ""),
      uuid: uuid
    };
  });
  init();
};
xmlhttp.send();

function init() {
  var keys = Object.keys(imageHash);
  var len = keys.length;
  var rnd = Math.floor(Math.random() * len);
  var item = imageHash[keys[rnd]];
  console.log(item);
  displayItem(item);
}

function displayItem(item) {
  console.log(item);
  grid.innerHTML = "";
  var main = document.createElement("div");
  var img = new Image();
  img.src = item.url;
  main.appendChild(img);
  main.classList.add("main");
  grid.appendChild(main);

  palette = document.createElement("ul");
  palette.classList.add("palette");
  palette.appendChild(document.createElement("li"));
  palette.appendChild(document.createElement("li"));
  palette.appendChild(document.createElement("li"));
  palette.appendChild(document.createElement("li"));
  palette.appendChild(document.createElement("li"));
  main.appendChild(palette);

  metadata = document.createElement("div");
  metadata.classList.add("metadata");
  grid.appendChild(metadata);
  var colorurl = "/output-colors/" + item.uuid + ".json";
  loadColors(colorurl);
  getMetadata(item.uuid);

  item.close.forEach(i => {
    createChild(i, "close");
  });

  item.mid.forEach(i => {
    createChild(i, "mid");
  });

  item.far.forEach(i => {
    createChild(i, "far");
  });

  window.scrollTo(0, 0);
}

function createChild(item, type) {
  var child = document.createElement("div");
  child.setAttribute("data-item", item);
  child.classList.add(type);
  var img = new Image();
  img.src = item.replace("..", "");
  child.appendChild(img);
  grid.appendChild(child);
  child.onclick = closeFarClick;
}

function closeFarClick(e) {
  var key = e.target.getAttribute("data-item");
  var item = imageHash[key];
  displayItem(item);
}

function createExpansion(sibling, url, colorurl, id, point) {
  var currentExpansion = document.getElementById("expansion");
  if (currentExpansion) currentExpansion.remove();
  var currentExpanded = expanded;
  if (currentExpanded) {
    currentExpanded.classList.remove("expanded");
  }
  if (sibling === currentExpanded) {
    expanded = undefined;
    return;
  }
  sibling.classList.add("expanded");
  expansion = document.createElement("div");
  expansion.setAttribute("id", "expansion");
  expansion.classList.add("expansion", "collapsed");
  if (sibling.classList.contains("selected"))
    expansion.classList.add("selected");
  var main = document.createElement("div");
  main.classList.add("main");
  var img = new Image();
  img.src = url;
  var imgDiv = document.createElement("div");
  imgDiv.classList.add("image-palette");
  var palette = document.createElement("ul");
  palette.classList.add("palette");
  palette.appendChild(document.createElement("li"));
  palette.appendChild(document.createElement("li"));
  palette.appendChild(document.createElement("li"));
  palette.appendChild(document.createElement("li"));
  palette.appendChild(document.createElement("li"));
  imgDiv.appendChild(palette);
  imgDiv.appendChild(img);
  main.appendChild(imgDiv);
  metadata = document.createElement("div");
  metadata.classList.add("metadata");
  main.appendChild(metadata);
  expansion.appendChild(main);
  var add = document.createElement("div");
  add.innerHTML = "add item";
  add.classList.add("add");
  add.setAttribute("data-id", id);
  add.setAttribute("data-point", point);
  add.onclick = e => {
    var p = e.target.getAttribute("data-point");
    var i = e.target.getAttribute("data-id");
    console.log(p, i, e);
    addCell(p, i);
  };
  expansion.appendChild(add);
  sibling.insertAdjacentElement("afterend", expansion);
  loadColors(colorurl);
  getMetadata(id);
  expanded = sibling;
  setTimeout(() => expansion.classList.remove("collapsed"), 10);
}

function getMetadata(id) {
  var xmlhttp = new XMLHttpRequest(),
    method = "GET",
    url =
      "https://dp.la/api/dpla/items?fields=sourceResource.description,sourceResource.date,sourceResource.title,sourceResource.subject.name,provider.name&id=" +
      id;

  xmlhttp.open(method, url, true);
  xmlhttp.onload = function(data) {
    var item = JSON.parse(data.target.response).docs[0];
    metadata.innerHTML = "";
    var title = document.createElement("h1");
    title.classList.add("title");
    title.innerHTML = item["sourceResource.title"];
    metadata.appendChild(title);
    // if (item["sourceResource.description"]) {
    //   var description = document.createElement("p")
    //   description.innerHTML = item["sourceResource.description"];
    //   metadata.appendChild(description)
    // }
    var provider = document.createElement("p");
    provider.innerHTML = item["provider.name"];
    metadata.appendChild(provider);
    if (item["sourceResource.subject.name"]) {
      var subjects = document.createElement("ul");
      subjects.classList.add("subjects");
      item["sourceResource.subject.name"].forEach(s => {
        var subject = document.createElement("li");
        subject.innerHTML = s;
        subjects.appendChild(subject);
      });
      metadata.appendChild(subjects);
    }
    // console.log(item)
  };
  xmlhttp.send();
}
function loadColors(file) {
  var xmlhttp = new XMLHttpRequest(),
    method = "GET",
    url = file;

  xmlhttp.open(method, url, true);
  xmlhttp.onload = function(data) {
    JSON.parse(data.target.response).imgdata[1].clusters.cluster.forEach(
      (c, index) => {
        palette
          .getElementsByTagName("li")
          [index].setAttribute(
            "style",
            "width: " +
              c[0].f * 100 +
              "%; background-color: " +
              c[2].hex[0].hex +
              ";"
          );
      }
    );
  };
  xmlhttp.send();
}
