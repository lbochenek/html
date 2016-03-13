// chrome.extension.onMessage.addListener(function(msg, sender, sendResponse){
//   if(msg.action == 'makeStringFromDOM'){
//     if(document.readyState === "complete"){
// //        console.log("completed!");
//         init();
//     } else {
// //        console.log("not completed");
//         window.addEventListener("onload", init, false);
//     }
//   }
// });

document.addEventListener("click", init);

function init(){
    console.log("in init!");
    var children = Array.prototype.slice.call(document.body.childNodes);
    for(var i=0, length=children.length; i<length; i++){
        var child = children[i];
        if(child.nodeType === Node.ELEMENT_NODE){
            var insertNode = toStringDOM(child);
            child.parentNode.insertBefore(insertNode, child);
            child.parentNode.removeChild(child);
        }
    }
    // var post = document.documentElement;
    // var insertNode = toStringDOM(post);
    // post.parentNode.insertBefore(insertNode, post);
    // post.parentNode.removeChild(post);
}

//depth first search!
function toStringDOM(node, processingNodes){
    //already been here!
    if(node.visited == true){
        return;
    }

    //if unvisited, process node
    node.visited = true;
    if(node.nodeType === Node.ELEMENT_NODE){
        var htmlCode = outerInnerHTMLDifference(node.outerHTML, node.innerHTML);
        var newNode = arrangeNewNode(htmlCode);
        var potentialProcessing = insert(newNode, processingNodes);
    } else {
        var potentialProcessing = insert(node, processingNodes);
    }

    //means that this node is the root node
    if(potentialProcessing !== null){
        processingNodes = {containerNode: potentialProcessing, root: true};
    }


    //visit all unvisited children
    if(node.hasChildNodes()){
        var childrenAry = Array.prototype.slice.call(node.childNodes);
        for(var i=0, length=childrenAry.length; i<length; i++){
            var child = childrenAry[i];
            if(child.vistied != true){
                toStringDOM(child, {containerNode: newNode, appendBefore: newNode.lastChild, root: false});
            }
        }
    }

    //gone through all children of root node = done!
    if(processingNodes.root){
        return processingNodes.containerNode;
    }

    function outerInnerHTMLDifference(outer, inner){
        var startInner = outer.indexOf(inner);
        var endInner = startInner + inner.length;
        var justOuterBegin = outer.slice(0, startInner);
        var justOuterEnd = outer.slice(endInner, outer.length);
        return {startC: justOuterBegin, endC: justOuterEnd};
    }

    function arrangeNewNode(rippedhtml){
        //var newNode = document.createElement(node.nodeName);
        var newNode = node.cloneNode(false);
        newNode = assignAllOriginalValues(node, newNode);
        var startCode = document.createTextNode(rippedhtml.startC);
        var endCode = document.createTextNode(rippedhtml.endC);
        newNode.appendChild(startCode);
        newNode.appendChild(endCode);
        return newNode;

        function assignAllOriginalValues(oldN, newN){

            return newN;
        }
    }

    function insert(nodeNew, processingNodes){
        if(processingNodes){
            if(processingNodes.appendBefore){
                processingNodes.containerNode.insertBefore(nodeNew, processingNodes.appendBefore);
            } else {
                processingNodes.containerNode.appendChild(nodeNew);
            }
            return null;
        } else {
            var newContainer = document.createElement("div");
            newContainer.appendChild(nodeNew);
            return newContainer;
        }
    }

}

// function init(){
//     console.log("in init!");
//     var posts = document.querySelectorAll("div.g");
//     for(var i=0, length = posts.length; i<length; i++){
// //        console.log("before", posts[i]);
// //        var newNode = DOMtoStringtoNode(posts[i]);
// //        console.log(newNode);
// //        posts[i].parentNode.insertBefore(newNode, posts[i]);
//         toStringDOM(posts[i]);
//         posts[i].parentNode.removeChild(posts[i]);
// //        console.log("after", posts[i]);
//     }
// }

// //depth first search!
// function toStringDOM(node, processingNodes){
//     //already been here!
//     if(node.visited == true){
//         return;
//     }

//     //if unvisited, process node
//     node.visited = true;
//     var htmlCode = outerInnerHTMLDifference(node.outerHTML, node.innerHTML);
//     var newNode = arrangeNewNode(htmlCode);
//     insert(newNode, processingNodes);

//     //visit all unvisited children
//     if(node.hasChildNodes){
//         for(var i=0, length=node.childNodes.length; i<length; i++){
//             var child = node.childNodes[i];
//             if(child.visted != true){
//                 toStringDOM(child, {containerNode: newNode, appendBefore: newNode.lastChild});
//             }
//         }
//     }

//     function outerInnerHTMLDifference(outer, inner){
//         var startInner = outer.indexOf(inner);
//         var endInner = startInner + inner.length;
//         var justOuterBegin = outer.slice(0, startInner);
//         var justOuterEnd = outer.slice(endInner, outer.length);
//         return {startC: justOuterBegin, endC: justOuterEnd};
//     }

//     function arrangeNewNode(rippedhtml){
//         var newNode = document.createElement(node.nodeName);
//         newNode = assignAllOriginalValues(node, newNode);
//         var startCode = document.createTextNode(rippedhtml.startC);
//         var endCode = document.createTextNode(rippedhtml.endC);
//         newNode.appendChild(startCode);
//         newNode.appendChild(endCode);
//         return newNode;

//         function assignAllOriginalValues(oldN, newN){

//             return newN;
//         }
//     }

//     function insert(nodeNew, processingNodes){
//         if(processingNodes){
//             processingNodes.containerNode.insertBefore(nodeNew, processingNodes.appendBefore);
//         } else {
//             node.parentNode.insertBefore(nodeNew, node);
//         }
//     }

// }

// //need to readd reference!
// //modified for my needs, and turned into depth first search to get all DOM nodes associated
// function DOMtoStringtoNode(root) {
//     var containerNode = createNode("div", "container", "container");
//     var html = '';
//     node = root.firstChild;
//     var htmlNode = createNode("div", "actual", null);
//     while (node) {
//         switch (node.nodeType) {
//         case Node.ELEMENT_NODE:
//             if(node.nodeName === "A"){
// //                console.log("link!", node);
//                 handleAnchorTag(node);
//             } else {
//                 html += node.outerHTML;
//             }
//             break;
//         case Node.TEXT_NODE:
//             html += node.nodeValue;
//             break;
//         case Node.CDATA_SECTION_NODE:
//             html += '<![CDATA[' + node.nodeValue + ']]>';
//             break;
//         case Node.COMMENT_NODE:
//             html += '<!--' + node.nodeValue + '-->';
//             break;
//         case Node.DOCUMENT_TYPE_NODE:
//             // (X)HTML documents are identified by public identifiers
//             html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
//             break;
//         }
//         node = node.nextSibling;
//     }
//     htmlNode.innerText = html;
//     containerNode.appendChild(htmlNode);
//     return containerNode;

//     //makes a new DOM node with element type, id, and class specified
//     function createNode(elementType, ID, Class){
//         var node = document.createElement(elementType);
//         if(ID != null){
//             node.id = ID;
//         }

//         if(Class != null){
//             node.className = Class;
//         }

//         return node;
//     }

//     //adds all collected HTML to a container node
//     //then creates an achor tag such that <a href="link">text</a> -> <a href="link"> <a href="link">text</a> </a>
//     //adds this node to the container
//     //creates a new HTML node to continue collected, and refreshes html
//     function handleAnchorTag(anchor){
//         htmlNode.innerText = html;
//         containerNode.appendChild(htmlNode);
//         htmlNode = createNode("div", "actual", "anchortag");
//         htmlAnchor = createNode("a", null, null);
//         htmlAnchor.className = anchor.className;
//         htmlAnchor.id = anchor.id;
//         htmlAnchor.href = anchor.href;
//         htmlAnchor.innerText = anchor.outerHTML;
//         htmlNode.appendChild(htmlAnchor);
//         // htmlNode.innerHTML = spliceHTMLintoAnchor(anchor);
//         containerNode.appendChild(htmlNode);
//         html = '';
//         htmlNode = createNode("div", "actual", null);

//         function spliceHTMLintoAnchor(anchor){
// //            console.log(anchor.innerText);
//             var code = "";
//             code += anchor.outerHTML;
//             var middle = {"startInd": -1, "startFound":false, "endFound":false, "endInd": -1};
//             for(var i=0, length=code.length; i<length; i++){
//                 if(code.charAt(i) == ">" && !middle.startFound){
//                     middle.startFound = true;
//                     middle.startInd = i+1;
//                 }
//                 if(code.charAt(i) == "<" && middle.startFound){
//                     middle.endFound = true;
//                     middle.endInd = i-1;
//                 }
//             }
//             var newHTML = code.slice(0, middle.startInd);
//             newHTML += code;
//             newHTML += code.slice(middle.endInd+1, code.length);
//             return newHTML;
//         }
//     }

//     function addChildrenToStack(node){
//         for(var i, length = node.childNodes.length; i<length; i++){
//             stack.push(node.childNode[i]);
//         }
//     }
// }