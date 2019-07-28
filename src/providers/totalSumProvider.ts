import * as component from "../common/component";
import { RegisterMdProvider } from "../interface/registerMdProvider";
import { registerCommand } from "../common/util";
import * as vscode from "vscode";
import * as sqlite from "sqlite3";
import { DataHandler } from "../dataHandler";
import { resolve } from "url";

@component.Export(RegisterMdProvider)
@component.Singleton
export class TotalSumProvider {
  public async register() {
    registerCommand("codeStory.totalSum", async () => {
        let MDString = await this.toMarkDown();
        let panel = vscode.window.createWebviewPanel('markdown.preview','Total Sum',vscode.ViewColumn.Beside);
        panel.webview.html=MDString;
        panel.reveal();
    });
  }

  // show the total line # of code write in the past # days
  private async getTotalSum() {
    let nDays = await vscode.window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: "please type in the # of days you want to include",
      value: "10"
    });

    try {
      let N = parseInt(nDays);
      if (N <= 0) {
        throw Error();
      }
      let now = new Date().getTime();
      let from = now - N * 24 * 3600*1000;
      let database = component.get(DataHandler).db;
      let sum = await new Promise<number>((res, rej) => {
        database.get(
          `select sum(count) as res from record where time > ${from}`,
          (err, sum) => {
            if (err) {
              // TODO
              // use better error handler
              console.error(err);
            } else {
              res(sum.res as number);
            }
          }
        );
      });
      return [N, sum];
    } catch (e) {
      vscode.window.showErrorMessage(
        "Make sure only positive integer is input"
      );
    }
  }

  public async toMarkDown() {
      const [N,sum] = await this.getTotalSum();
      const MDString = 
`<details>
<summary><span style="color:grey">lines of code you wrote in the past ${N} days</span></summary>

<p> in the past <b>${N}</b> days, you wrote <b>${sum === null ?0:sum}</b> lines of code </p>
<p> <span style="color:Red">WELL DONE</span></p>
</details>`;
      return MDString;
  }
}
