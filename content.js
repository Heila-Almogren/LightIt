


// HighlightBack()
// // Returns highlight to document after refresh
// function HighlightBack() {

//     chrome.storage.local.get(["anchors"], function (res) {
//         // alert(JSON.stringify(res["anchors"]))
//         let p = document.getElementById("firstHeading")
//         let range = new Range();
//         range.setStart(p.firstChild, 0);
//         range.setEnd(p.firstChild, 3);
//         document.getSelection().removeAllRanges();
//         document.getSelection().addRange(range);
//     })

// }




// source https://stackoverflow.com/questions/18049576/simple-highlight-text-chrome-extension
async function makeEditableAndHighlight(colour) {

    // Check if highlighting is on or off
    let highlighterOn = await checkHighlightingStatus()

    if (highlighterOn)
        sel = window.getSelection();

    if (sel.rangeCount && sel.getRangeAt) {
        range = sel.getRangeAt(0);
    }
    document.designMode = "on";
    if (range) {
        sel.removeAllRanges();
        sel.addRange(range);

        highlightText = sel.toString()

        if (highlightText != "") {
            storeHighlight(highlightText)
        }

    }


    // Use HiliteColor since some browsers apply BackColor to the whole block
    if (!document.execCommand("HiliteColor", false, colour)) {
        document.execCommand("BackColor", false, colour);
    }
    document.designMode = "off";

    saveHighlight(sel, range)

}





// Stores Highlighted text in the local storage
async function storeHighlight(text) {

    chrome.storage.local.get(["all_highlights"], function (res) {

        let all_highlights = []
        if (res["all_highlights"])
            all_highlights = res["all_highlights"]

        all_highlights.push(text)
        chrome.storage.local.set({ "all_highlights": all_highlights })

    })
}

// Checks if highlighting is on or off
function checkHighlightingStatus() {

    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["highlighterStatus"], function (res) {
            let highlighterOn = res["highlighterStatus"]
            if (highlighterOn)
                resolve(highlighterOn)
            else
                reject();
        })
    })
}


// Checks if highlighting is on or off
async function getSelectedColor() {

    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["highlightColor"], function (res) {

            let highlightColor = res["highlightColor"]
            if (highlightColor == undefined) {
                highlightColor = "yellow"
            }
            if (highlightColor)
                resolve(highlightColor)
            else
                reject("yellow");
        })
    })
}


async function highlight() {
    let colour = await getSelectedColor()



    var range, sel;
    if (window.getSelection) {
        // IE9 and non-IE
        try {
            if (!document.execCommand("BackColor", false, colour)) {
                makeEditableAndHighlight(colour);
            }
        } catch (ex) {
            makeEditableAndHighlight(colour)
        }
    } else if (document.selection && document.selection.createRange) {
        // IE <= 8 case
        range = document.selection.createRange();
        range.execCommand("BackColor", false, colour);
    }


}

document.onmouseup = e => {

    highlight();
}




function saveHighlight(selection, range) {
    // alert(JSON.stringify(range.startContainer.id) + " and " + range.startContainer.id)
    //anchorNode, anchorOffset, focusNode, focusOffset
    chrome.storage.local.set({
        "anchors": {
            startContainer: range.startContainer, anchorOffset: selection.anchorOffset, endContainer: range.endContainer, focusOffset: selection.focusOffset
        }

    })

}



// back to https://stackoverflow.com/questions/23479533/how-can-i-save-a-range-object-from-getselection-so-that-i-can-reproduce-it-on
