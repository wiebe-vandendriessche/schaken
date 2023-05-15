let plot_count = 0;

export class Plot {
    constructor(title) {
        let div = document.createElement("div");
        div.className = "row mt-5";
        div.id = "chartContainer" + plot_count;
        div.style = "height: 370px; width: 100%;";

        let top_level_container = document.getElementById("plot");
        top_level_container.appendChild(div);

        this.dataPoints = [];
        this.chart = new CanvasJS.Chart("chartContainer" + plot_count, {
            theme: "dark2",
            title: {
                text: title
            },
            axisY: {
                title: "Rating"
            },
            axisX: {
                title: "Puzzels opgelost deze sessie",
                interval:1,
                minimum:0
            },
            data: [{
                type: "line",
                color:"green",
                dataPoints: this.dataPoints
            }]
        });
        plot_count++;
    }

    plotData(data) {
        this.dataPoints.push({x: data[0], y: data[1]});
        this.chart.render();
    }
}