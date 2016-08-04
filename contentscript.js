if(document.readyState === "complete" || document.readyState === "interactive"){
        init();
    } else {
        window.addEventListener("onload", init, false);
    }

function init(){
    htmlify();
    document.addEventListener("click", function(){
        var timer = setTimeout(htmlify, 500);
    });
}

function htmlify(){
    var children = Array.prototype.slice.call(document.body.childNodes);
    for(var i=0; i<children.length; i++){
        var child = children[i];
        if(child.nodeType === Node.ELEMENT_NODE){
            var insertNode = toStringDOM(child);
            if(insertNode){
                if(insertNode.hasChildNodes){
                    var childrenAry = Array.prototype.slice.call(insertNode.childNodes);
                    for(var m=0, length=childrenAry.length; m<length; m++){
                        var childNewNode = childrenAry[m];
                        child.parentNode.insertBefore(childNewNode, child);
                        child.parentNode.removeChild(child);
                    }
                } else {
                    child.parentNode.insertBefore(insertNode, child);
                    child.parentNode.removeChild(child);
                }
            } else {
                var newDOMNodes = scanDOM(child);
                for(var j=0; j<newDOMNodes.length; j++){
                    var newDOMNode = newDOMNodes[j];
                    var insertNode = toStringDOM(newDOMNode);
                    if(insertNode){
                        if(insertNode.hasChildNodes){
                            var childrenAry = Array.prototype.slice.call(insertNode.childNodes);
                            for(var k=0, length=childrenAry.length; k<length; k++){
                                var childNewDOMNode = childrenAry[k];
                                newDOMNode.parentNode.insertBefore(childNewDOMNode, newDOMNode);
                                newDOMNode.parentNode.removeChild(newDOMNode);
                            }
                        } else {
                            newDOMNode.parentNode.insertBefore(insertNode, newDOMNode);
                            newDOMNode.parentNode.removeChild(newDOMNode);
                        }
                    }
                }
            }
        }
    }
}

//depth first search, making a list of unvisited nodes to turn into html
function scanDOM(node){
    var newNodes = [];

    findNewNodes(node);
    return newNodes;

    function findNewNodes(checkNode){
        if(checkNode.visited === true){
            if(checkNode.hasChildNodes()){
                var childrenAry = Array.prototype.slice.call(checkNode.childNodes);
                for(var i=0, length=childrenAry.length; i<length; i++){
                    var child = childrenAry[i];
                    var potentialNewNode = findNewNodes(child);
                    if(potentialNewNode){
                        newNodes.push(potentialNewNode);
                    }
                }
            }
        } else {
            return checkNode;
        }
    }
}

//depth first search!
function toStringDOM(node, processingNodes){
    //already been here!
    if(node.visited === true){
        return null;
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
            if(child.visited != true){
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
        var newNode = node.cloneNode(false);
        newNode.visited = true;
        newNode = assignAllOriginalValues(node, newNode);
        var startCode = document.createTextNode(rippedhtml.startC);
        startCode.visited = true;
        var endCode = document.createTextNode(rippedhtml.endC);
        endCode.visited = true;
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
            newContainer.visited = true;
            newContainer.appendChild(nodeNew);
            return newContainer;
        }
    }

}
