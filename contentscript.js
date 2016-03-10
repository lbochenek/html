// chrome.extension.onMessage.addListener(function(msg, sender, sendResponse){
//   console.log("hi from constentscript");
//   if(msg.action == 'makeStringFromDOM'){
//     var html = DOMtoString(document.documentElement);
//     console.log(html);
//     replaceWithHTML(html, document.documentElement);
//   }
// });

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse){
  if(msg.action == 'makeStringFromDOM'){
    if(document.readyState === "complete"){
        console.log("completed!");
        init();
    } else {
        console.log("not completed");
        window.addEventListener("onload", init, false);
    }
  }
});

// onload = init();

//http://stackoverflow.com/questions/8100576/how-to-check-if-dom-is-ready-without-a-framework
// if(document.readyState === "complete"){
//     console.log("completed!");
//     init();
// } else {
//     console.log("not completed");
//     window.addEventListener("onload", init, false);
// }

function init(){
    console.log("in init!");
    var posts = document.querySelectorAll("div.g");
    for(var i=0, length = posts.length; i<length; i++){
        modifyHTML(posts[i]);
        console.log(posts[i]);
    }
}


function modifyHTML(element){
    var html = DOMtoString(element);
    element.innerText = html;
}

// var html = DOMtoString(document.documentElement);
// console.log(html);
// replaceWithHTML(html, document.documentElement);

//http://stackoverflow.com/questions/11684454/getting-the-source-html-of-the-current-page-from-chrome-extension
// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
    return html;
}

// function replaceWithHTML(html, document_root){
//     console.log("replaceWithHTML");

//     var htmlNode = document.createElement("div");
//     htmlNode.id = "actualHTML";
//     htmlNode.innerText = html;
//     console.log(htmlNode);

//     document.body.insertBefore(htmlNode, document.body.childNodes[0]);

//     console.log(document_root.childNodes);
// }