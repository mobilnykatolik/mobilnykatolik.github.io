var widgets = [["points", "Moje akwarium"]]
var selectedWidget = localStorage.getItem("wdg");

//Ustawianie Moje akwarium jako defaultowy widget
if (selectedWidget == null) {
    selectedWidget = "points"
}

widgetSelect = document.getElementById("widget-select");
for (let widget in widgets) {
    widget = widgets[widget]
    var opt = document.createElement('option');
    opt.value = widget[0];
    opt.innerHTML = widget[1];
    if (selectedWidget == widget[0]) {
        opt.selected = "selected";
    }
    widgetSelect.appendChild(opt);
}

function changeWidget() {
    selectedWidget = document.getElementById("widget-select").value;
    localStorage.setItem("wdg", selectedWidget);
    loadWidget();
}

function loadWidget() {
    for (let widget in widgets) {
        widget = widgets[widget][0]
        document.getElementById(`wdg-${widget}`).style.display = "none"
    }
    if (selectedWidget != "none") {
        document.getElementById(`wdg-${selectedWidget}`).style.display = "block";
    }   
}

loadWidget();