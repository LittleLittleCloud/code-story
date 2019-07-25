// provide the hist graphic of code # in the past N days
import * as component from "../common/component";
import { RegisterMdProvider } from "../interface/registerMdProvider";
import * as vscode from "vscode";
import { DataHandler } from "../dataHandler";
import { registerCommand } from "../common/util";

@component.Export(RegisterMdProvider)
@component.Singleton
export class SumPerDayProvider {
  public async register() {
    registerCommand("codeStory.sumPerDay", async () => {
      let html = await this.toMarkDown();
      let panel = vscode.window.createWebviewPanel(
        "markdown.preview",
        "Sum in the Past Days",
        vscode.ViewColumn.Beside,
        { enableScripts: true }
      );
      panel.webview.html = html;
      panel.reveal();
    });
  }

  // should return a list of number
  // like [10,20,30000]
  private async getSumPerDay() {
    let nDays = await vscode.window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: "please type in the past # of days you want to include",
      value: "10"
    });

    try {
      let N = parseInt(nDays);
      if (N <= 0) {
        throw Error();
      }
      let now = new Date().getTime();
      let from = now - N * 24 * 3600 * 1000;
      let database = component.get(DataHandler).db;
      let sumPerDay = await new Promise<number[]>((res, rej) => {
        database.all(
          `select count,time from record where time > ${from}`,
          [],
          (err, rows) => {
            if (err) {
              throw err;
            }

            let result = new Array(N).fill(0);
            rows.forEach(row => {
              result[Math.floor((row.time - from) / (24 * 3600 * 1000))] +=
                row.count;
            });
            res(result);
          }
        );
      });
      return sumPerDay;
    } catch (e) {
      vscode.window.showErrorMessage(
        "Make sure only positive integer is input"
      );
    }
  }

  private toDataTable(data: number[]) {
    let dataTable = [];

    data.forEach((row, i) => {
      dataTable.push([`${data.length - i} th`, row]);
    });
    dataTable.push(["Day", "Count"]);
    return dataTable.reverse();
  }

  public async toMarkDown() {
    let data = await this.getSumPerDay();
    let chart_id = "sumPerDayChart";
    const html = `<html>
<head>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <script type="text/javascript">
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var data = google.visualization.arrayToDataTable(${JSON.stringify(
        this.toDataTable(data)
      )});

      var options = {
        title: 'Sum of code write in past few days',
        legend: { position: 'none' },
        vAxis: {
          viewWindow: {
            min: 0,
          },
      },
      };

      var chart = new google.visualization.ColumnChart(document.getElementById("${chart_id}"));
      chart.draw(data, options);
    }
  </script>
</head>
<summary><span stype="color:grey">Sum of code write in past few days</summary>
<body>
  <div id="${chart_id}"></div>
</body>
</html>`;
    return html;
  }
}
