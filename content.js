

// source https://stackoverflow.com/questions/18049576/simple-highlight-text-chrome-extension


function makeEditableAndHighlight(colour) {

    chrome.storage.local.get(["highlighterStatus"], function (res) {
        if (res["highlighterStatus"]) {

            sel = window.getSelection();

            if (sel.rangeCount && sel.getRangeAt) {
                range = sel.getRangeAt(0);
            }
            document.designMode = "on";
            if (range) {
                sel.removeAllRanges();
                sel.addRange(range);

                chrome.storage.local.get(["all_highlights"], function (res) {
                    if (!res["all_highlights"]) {
                        res["all_highlights"] = []
                    }
                    let all_highlights = res["all_highlights"]

                    if (sel.toString() != "") {
                        all_highlights.push(sel.toString())
                        chrome.storage.local.set({ "all_highlights": all_highlights })
                    }



                })
                // chrome.storage.local.set({ "": val })
            }
            // Use HiliteColor since some browsers apply BackColor to the whole block
            if (!document.execCommand("HiliteColor", false, colour)) {
                document.execCommand("BackColor", false, colour);
            }
            document.designMode = "off";


        }
    })




}

function highlight() {
    let colour = ""

    chrome.storage.local.get(["highlightColor"], function (res) {
        colour = res["highlightColor"] || "yellow"

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

    })
}

document.onmouseup = e => {

    highlight();


}