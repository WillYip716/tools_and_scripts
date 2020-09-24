function compileLines(){

    let parser = new RegExp(/([A-Za-z0-9 ]*)\sat\s([A-Za-z ]*)\((\+|\-)([0-9.]*),\s([0-9.]*)\)/);


    let linesArr = document.getElementById("inputarea").value.split("\n");


    let screen = document.getElementsByTagName("body")[0];
    let cNode = screen.cloneNode(false);
    screen.parentNode.replaceChild(cNode,screen);

    screen = document.getElementsByTagName("body")[0];
    let lineguesses = document.createElement("form");

    let selectDiv1, selectDiv2, spreadOption1, spreadOption2, over, under, parsedLine,lineTitle;
    for(let i = 0; i < linesArr.length; i++){
        parsedLine = linesArr[i].match(parser);
        console.log(parsedLine);
        selectDiv1 = document.createElement("select");
        selectDiv1.id = "spread" + i;
        selectDiv2 = document.createElement("select");
        selectDiv2.id = "overunder" + i;
        spreadOption1 = document.createElement('option');
        spreadOption1.innerHTML = parsedLine[1] + ((parsedLine[3]==="-")?"+":"-") + parsedLine[4];
        spreadOption1.value = parsedLine[1] + ((parsedLine[3]==="-")?"+":"-") + parsedLine[4];

        spreadOption2 = document.createElement('option');
        spreadOption2.innerHTML = parsedLine[2] + parsedLine[3] + parsedLine[4];
        spreadOption2.value = parsedLine[2] + parsedLine[3] + parsedLine[4];
        selectDiv1.appendChild(spreadOption1);
        selectDiv1.appendChild(spreadOption2);

        over = document.createElement("option");
        over.innerHTML = "over " + parsedLine[5];
        over.value = "over " + parsedLine[5];
        under = document.createElement("option");
        under.innerHTML = "under " + parsedLine[5];
        under.value = "under " + parsedLine[5];
        selectDiv2.appendChild(over);
        selectDiv2.appendChild(under);

        lineTitle= document.createElement("label");
        lineTitle.id = "label" + i;
        lineTitle.innerHTML = parsedLine[0];

        lineguesses.appendChild(lineTitle);
        lineguesses.appendChild(selectDiv1);
        lineguesses.appendChild(selectDiv2);
        lineguesses.appendChild(document.createElement("br"));
        lineguesses.appendChild(document.createElement("br"));
        
    }

    let submitButton = document.createElement("button");
    submitButton.innerHTML="submit";
    submitButton.onclick = function(){lineString(linesArr.length)};
    screen.appendChild(lineguesses);
    screen.appendChild(submitButton);
    
    
}


function lineString(l){

    let linesStr = "";
    let title,spread,overunder;
    for(let j = 0; j< l; j++){
        title = document.getElementById("label"+j).innerHTML;
        spread = document.getElementById("spread"+j).value;
        overunder = document.getElementById("overunder"+j).value;
        linesStr = linesStr + title + " | " + spread + ", " + overunder + "\n";
    }

    alert(linesStr);
}