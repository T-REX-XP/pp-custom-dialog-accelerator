"use strict";
import { navigationOptionsTargetMode, position } from "./Enums/navigationOptionsTargetMode";
import { DialogConfig,TargetRecordReference,PageInput, NavigationOptions } from "./Interfaces";
import { convertToSize } from "./Utils";

namespace yn.Navigation {
    export async function showDialog(
        dialogName: string,
        selectedRecords: any,
        control: any
    ): Promise<void> {
        const isRibbonOnForm = Object.prototype.hasOwnProperty.call(control, "_entityReference");

        const pageInput: PageInput = {
            pageType: "custom",
            name: dialogName,
        };
        const navigationOptions: NavigationOptions = {
            target: navigationOptionsTargetMode.dialog,
            position: position.center,
        };
        const dialogConfig = await getDialogConfig(dialogName);
        const targetRef = getTargetRecordReference(
            selectedRecords ?? control,
            isRibbonOnForm
        );
        if (targetRef) {
            pageInput["entityName"] = targetRef.entityName;
            pageInput["recordId"] = targetRef.recordId;
        }
        if (dialogConfig.widthInPercentage && dialogConfig.heightInPercentage) {
            navigationOptions["width"] = convertToSize(
                dialogConfig.widthInPercentage,
                __defaultPercentage
            );
            navigationOptions["height"] = convertToSize(
                dialogConfig.heightInPercentage,
                __defaultPercentage
            );
        }
        if (dialogConfig.title) {
            navigationOptions["title"] = dialogConfig.title;
        }

        Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
            function success() {
                if (dialogConfig.isRefreshGrid) {
                    if (isRibbonOnForm) {
                        control?.data.refresh();
                    } else {
                        control?.refresh();
                    }
                }
            },
            function error(error: string) {
                showErrorDialog(`Error during showing the dialog, ${error}`);
            }
        );
    }

    // Private functions below
    function getTargetRecordReference(
        control: any,
        isRibbonOnForm: boolean
    ): TargetRecordReference | null {
        if (isRibbonOnForm) {
            return {
                entityName: control.entityReference.entityType,
                recordId: control.entityReference.id,
            };
        } else if (control?.length > 0) {
            return {
                entityName: control[0].TypeName,
                recordId: control[0].Id,
            };
        }
        return null;
    }

    function showErrorDialog(message: string): void {
        const alertStrings = {
            confirmButtonLabel: "Ok",
            text: message,
            title: "Error",
        };
        const alertOptions = {
            height: 120,
            width: 260,
        };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
    }
 
    const __defaultPercentage = 50;

    async function getDialogConfig(dialogName: string): Promise<DialogConfig> {
        const dialogConfigResult = await Xrm.WebApi.retrieveMultipleRecords(
            "yn_customdialogconfiguration",
            `?$filter=yn_name eq '${dialogName}'&$top=1`,
            1
        );
        const dialogConfigData = dialogConfigResult.entities[0];
        return {
            title: dialogConfigData["yn_title"],
            widthInPercentage: dialogConfigData["yn_widthinpercentage"],
            heightInPercentage: dialogConfigData["yn_heightinpercentage"],
            isRefreshGrid: dialogConfigData["yn_refreshgridonclose"],
        };
    }
}

export default yn.Navigation;
