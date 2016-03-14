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

// document.addEventListener("click", init);
// var clicked = false;

// document.addEventListener("DOMContentLoaded", readyToStart, false);

if(document.readyState === "interactive" || document.readyState === "complete"){
    console.log("document is ready");
    // readyToStart();
    init();
} else {
    console.log("document is not ready, added listener");
    // window.addEventListener("onload", readyToStart, false);
    window.addEventListener("onload", init, false);

}

//https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
function readyToStart(){
    console.log("in readytostart");
    var target = document.body;
    var observer = new MutationObserver(init);
    var config = {childList: true};
    observer.observe(target, config);

}



function init(){
    // var intervalID = window.setInterval(init, 1000);
    document.addEventListener("click", init);
    // if(!clicked){
        console.log("in init!");
        // clicked = true;
        var children = Array.prototype.slice.call(document.body.childNodes);
        for(var i=0, length=children.length; i<length; i++){
            var child = children[i];
            if(child.nodeType === Node.ELEMENT_NODE){
                var insertNode = toStringDOM(child);
                child.parentNode.insertBefore(insertNode, child);
                child.parentNode.removeChild(child);
            } else {
                wrapNonElementNode(child);
            }
        }
    // }

}

function wrapNonElementNode(node){
    var wrapper = document.createElement("div");
    wrapper.className = "scriptNode";
    node.parentNode.insertBefore(wrapper, node);
    node.parentNode.removeChild(node);
    wrapper.appendChild(node);
    return wrapper;
}

//depth first search!
function toStringDOM(node, processingNodes){
    if(!(node.classList)){ //node not capable of having a classList
        if(node.parentNode){
            if(node.parentNode.classList.contains("scriptNode")){
                searchForNewNodes(node);
            } else {
                return actuallyApply(node);
            }
        } else {
            return actuallyApply(node);
        }
    } else if(!node.classList.contains("scriptNode")){ //if first time looking at this node
    // if(node.scriptNode != true){ //if created from my script, leave it alone and travel to children looking for new nodes
        return actuallyApply(node);
    } else {
        searchForNewNodes(node);
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
        // newNode.scriptNode = true;
        newNode.className += " scriptNode";
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

    function searchForNewNodes(node){
        if(node.hasChildNodes()){
            var childrenAry = Array.prototype.slice.call(node.childNodes);
            for(var i=0, length=childrenAry.length; i<length; i++){
                var child = childrenAry[i];
                if(child.vistied != true){
                    return toStringDOM(child);
                }
            }
        }
    }

    function actuallyApply(node, processingNodes){
        //already been here!
        if(node.visited == true){
            return;
        }

        //if unvisited, process node
        node.visited = true;
        if(node.nodeType === Node.ELEMENT_NODE){
            node.className += " scriptNode";
            var htmlCode = outerInnerHTMLDifference(node.outerHTML, node.innerHTML);
            var newNode = arrangeNewNode(htmlCode);
            var potentialProcessing = insert(newNode, processingNodes);
        } else {
            var wrapper = wrapNonElementNode(node);
            var potentialProcessing = insert(wrapper, processingNodes);
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
                if(child.visited != true){
                    actuallyApply(child, {containerNode: newNode, appendBefore: newNode.lastChild, root: false});
                }
            }
        }

        //gone through all children of root node = done!
        if(processingNodes.root){
            return processingNodes.containerNode;
        }
    }


}