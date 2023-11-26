import { navigationOptionsTargetMode, position } from "../Enums/navigationOptionsTargetMode";

export interface NavigationOptions {
    target: navigationOptionsTargetMode
    position: position,
    width?: string,
    height?: string,
    title?: string,
}