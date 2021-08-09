window.onload = function (e) {

    let current = ""
    var table = document.getElementById("all_highlists")
    var row, cell, content
    var showArea = document.getElementById("current")
    chrome.storage.local.get(["all_highlights"], function (res) {
        let len = 0
        if (res["all_highlights"])
            len = res["all_highlights"].length
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                content = res["all_highlights"][i]
                if (content == undefined)
                    break
                row = table.insertRow(i);
                cell = row.insertCell(0);
                cell.style.backgroundColor = "#F6F6F6";
                cell.style.borderRadius = "15px"
                row.style.padding = "3px";
                cell.className = "HighlighTextListItem"
                cell.style.width = "300px"
                cell.style.cursor = "pointer"
                cell.onclick = (e) => {
                    showArea.innerHTML = e.target.innerText
                    let other_elements = document.getElementsByClassName("HighlighTextListItem")
                    for (i = 0; i < other_elements.length; i++) {

                        let element = other_elements[i]
                        if (element != e.target)
                            element.parentElement.style.backgroundColor = "#F6F6F6"
                    }
                    e.target.parentElement.style.backgroundColor = "#ccc"

                }
                // table.style.borderCollapse = "collapse"
                // table.style.borderSpacing = "1px 0px;"

                cell.innerHTML = "<p class='HighlighTextListItem'>&nbsp;  &#128278; &nbsp;" + content + "</p>";
            }
        } else {
            row = table.insertRow(0);
            cell = row.insertCell(0);
            cell.innerHTML = "No highlights"
        }

    })




}