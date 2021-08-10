let colors = document.getElementsByClassName('ColorSelector');
// let on = document.getElementById("checkbox").checked

// let onoff = document.getElementById("hello")
// let range = new Range();
// range.selectNodeContents(onoff);

// document.getSelection().removeAllRanges();
// document.getSelection().addRange(range);


chrome.storage.local.get(["highlighterStatus"], function (res) {
    if (res == null || res == undefined) {
        // alert("res is undefined")
        chrome.storage.local.set({ "highlighterStatus": false })
        document.getElementById("checkbox").checked = false

    } else {
        // alert("res is " + JSON.stringify(res))
        document.getElementById("checkbox").checked = res['highlighterStatus']
    }

})

var table = document.getElementById("latest_highlights")
var row, cell, content
chrome.storage.local.get(["all_highlights"], function (res) {
    let len = 0
    if (res["all_highlights"])
        len = res["all_highlights"].length
    if (len > 0) {
        for (var i = 0; i < 5; i++) {
            content = res["all_highlights"][len - i - 1]
            if (content == undefined)
                break
            row = table.insertRow(i);
            cell = row.insertCell(0);
            row.style.backgroundColor = "#F6F6F6";
            cell.style.borderRadius = "15px"
            row.style.padding = "3px";
            row.className = "highlight_row"
            // table.style.borderCollapse = "collapse"
            // table.style.borderSpacing = "1px 0px;"

            cell.innerHTML = "<p class='HighlighText'>&nbsp;  &#128278; &nbsp;" + content + "</p>";
        }
    } else {
        row = table.insertRow(0);
        cell = row.insertCell(0);
        cell.innerHTML = "No highlights"

    }

})






document.getElementById("checkbox").onchange = () => {
    let val = document.getElementById("checkbox").checked
    // alert("res changed to " + val)
    chrome.storage.local.set({ "highlighterStatus": val })
}


for (var i = 0; i < colors.length; i++) {
    colors[i].addEventListener('click', (e) => {
        resetSelectedColor()
        chrome.storage.local.set({ "highlightColor": e.target.id }, function () {
            setSelectedColor()
        });
    })
}

function setSelectedColor() {
    chrome.storage.local.get(["highlightColor"], function (res) {
        document.getElementById(res["highlightColor"]).style.borderColor = "#ccc"
    })
}


function resetSelectedColor() {
    chrome.storage.local.get(["highlightColor"], function (res) {
        document.getElementById(res["highlightColor"]).style.borderColor = "white"
    })
}

document.getElementById("viewAll").onclick = () => {

    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }

}