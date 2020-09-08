function compilepost(){

//let complilepost = function(){



    let title = "'" + document.getElementById("title").value+"'";
    let description = "'" + document.getElementById("description").value +"'";
    let date = "Date.now()";
    let category =  "'"+document.getElementById("category").value+"'";
    let tags = "["+document.getElementById("tags").value+"]";
    let article = "'"+encodeURIComponent(document.getElementById("article").value)+"'";
    let imageUrl = "'"+document.getElementById("imageUrl").value+"'";
    let published = "false";

    let holder = [title,description,date,category,tags,article,imageUrl,published,"callback"];

    holder = holder.toString();
    
    let compiledString = "function(callback){postCreate("+holder+");}";



    alert(compiledString);
}

