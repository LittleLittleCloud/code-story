import { injectable } from "inversify";
import { RegisterProvider } from "./registerProvider";
import { MarkdownString } from "vscode";

@injectable()
export abstract class  RegisterMdProvider extends RegisterProvider {
    public abstract toMarkDown(): MarkdownString;
}









