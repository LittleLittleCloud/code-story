import {injectable} from "inversify";

/**
 * Base class for register provider
 * @class RegisterProvider
 */
@injectable()
export abstract class RegisterProvider{
    public abstract register(): void | Promise<void>;
    public abstract unregister(): void | Promise<void>;
}