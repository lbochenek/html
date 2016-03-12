chrome.extension.onMessage.addListener(function(msg, sender, sendResponse){
  if(msg.action == 'makeStringFromDOM'){
    if(document.readyState === "complete"){
//        console.log("completed!");
        init();
    } else {
//        console.log("not completed");
        window.addEventListener("onload", init, false);
    }
  }
});

function init(){
    console.log("in init!");
    var posts = document.querySelectorAll("div.g");
    for(var i=0, length = posts.length; i<length; i++){
//        console.log("before", posts[i]);
        var newNode = DOMtoStringtoNode(posts[i]);
        console.log(newNode);
        posts[i].parentNode.insertBefore(newNode, posts[i]);
        posts[i].parentNode.removeChild(posts[i]);
//        console.log("after", posts[i]);
    }
}

function DOMtoStringtoNode(root) {
    var containerNode = createNode("div", "container", "container");
    var html = '',
        node = root.firstChild;
     var htmlNode = createNode("div", "actual", null);
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            if(node.nodeName === "A"){
//                console.log("link!", node);
                handleAnchorTag(node);
            } else {
                html += node.outerHTML;
            }
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
    htmlNode.innerText = html;
    containerNode.appendChild(htmlNode);
    return containerNode;

    //makes a new DOM node with element type, id, and class specified
    function createNode(elementType, ID, Class){
        var node = document.createElement(elementType);
        if(ID != null){
            node.id = ID;
        }

        if(Class != null){
            node.className = Class;
        }

        return node;
    }

    //adds all collected HTML to a container node
    //then creates an achor tag such that <a href="link">text</a> -> <a href="link"> <a href="link">text</a> </a>
    //adds this node to the container
    //creates a new HTML node to continue collected, and refreshes html
    function handleAnchorTag(anchor){
        htmlNode.innerText = html;
        containerNode.appendChild(htmlNode);
        htmlNode = createNode("div", "actual", "anchortag");
        htmlAnchor = createNode("a", null, null);
        htmlAnchor.className = anchor.className;
        htmlAnchor.id = anchor.id;
        htmlAnchor.href = anchor.href;
        htmlAnchor.innerText = anchor.outerHTML;
        htmlNode.appendChild(htmlAnchor);
        // htmlNode.innerHTML = spliceHTMLintoAnchor(anchor);
        containerNode.appendChild(htmlNode);
        html = '';
        htmlNode = createNode("div", "actual", null);

        function spliceHTMLintoAnchor(anchor){
//            console.log(anchor.innerText);
            var code = "";
            code += anchor.outerHTML;
            var middle = {"startInd": -1, "startFound":false, "endFound":false, "endInd": -1};
            for(var i=0, length=code.length; i<length; i++){
                if(code.charAt(i) == ">" && !middle.startFound){
                    middle.startFound = true;
                    middle.startInd = i+1;
                }
                if(code.charAt(i) == "<" && middle.startFound){
                    middle.endFound = true;
                    middle.endInd = i-1;
                }
            }
            var newHTML = code.slice(0, middle.startInd);
            newHTML += code;
            newHTML += code.slice(middle.endInd+1, code.length);
            return newHTML;
        }
    }
}