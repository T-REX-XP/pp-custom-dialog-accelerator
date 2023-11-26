"use strict";
var yn = yn || {};

yn.Navigation = {
    __defaultPercentage: 50,
    __selectedControl: null,
    navigationOptionsTargetMode: {
        inline: 1,
        dialog: 2
    },
    position: {
        center: 1,
        farSide: 2
    },
    getTargetRecordReference: function (control, isRibbonOnForm) {      
        if (isRibbonOnForm) {
            return {
                entityName: control.entityReference.entityType,
                recordId: control.entityReference.id
            };
        }
        else {
            if (control?.length > 0) {
                return {
                    entityName: control[0].TypeName,
                    recordId: control[0].Id,
                };
            }
        }
        return null;
    },
    showErrorDialog: function (message) {
        var alertStrings = { confirmButtonLabel: "Ok", text: message, title: "Error" };
        var alertOptions = { height: 120, width: 260 };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
    },
    async __getDialogConfig(dialogName) {
        var dialogConfigResult = await Xrm.WebApi.retrieveMultipleRecords("yn_customdialogconfiguration", `?$filter=yn_name eq '${dialogName}'&$top=1`, 1);
        var dialogConfigData = dialogConfigResult.entities[0];
        return {
            title: dialogConfigData["yn_title"],
            widthInPercentage: dialogConfigData["yn_widthinpercentage"],
            heightInPercentage: dialogConfigData["yn_heightinpercentage"],
            isRefrashGrid: dialogConfigData["yn_refreshgridonclose"],
        };
    },
    async showDialog(dialogName, selectedRecords, control) {
        yn.Navigation.__selectedControl = control;
        var isRibbonOnForm = Object.prototype.hasOwnProperty.call(control, "_entityReference");
        var pageInput = {
            pageType: "custom",
            name: dialogName,
        };
        var navigationOptions = {
            target: yn.Navigation.navigationOptionsTargetMode.dialog,
            position: yn.Navigation.position.center
        };
        var dialogConfig = yn.Navigation.__getDialogConfig(dialogName);
        var targetRef = yn.Navigation.getTargetRecordReference(selectedRecords ?? control, isRibbonOnForm);

        if(targetRef){
            pageInput["entityName"] = targetRef.entityName;
            pageInput["recordId"] = targetRef.recordId;
        }

        if (dialogConfig.widthInPercentage && dialogConfig.heightInPercentage) {
            navigationOptions["width"] = { value: dialogConfig.widthInPercentage ?? yn.Navigation.__defaultPercentage, unit: "%" };
            navigationOptions["height"] = { value: dialogConfig.heightInPercentage ?? yn.Navigation.__defaultPercentage, unit: "%" };
        }
        //Override title if populated in the config
        if (dialogConfig.title) {
            navigationOptions["title"] = dialogConfig.title;
        }
        Xrm.Navigation.navigateTo(pageInput, navigationOptions)
            .then(
                function success() {
                    if (dialogConfig.isRefrashGrid) {
                        if (isRibbonOnForm) {
                            yn.Navigation.__selectedControl?.data.refresh();
                        } else {
                            yn.Navigation.__selectedControl?.refresh();
                        }
                    }
                },
                function error(error) {
                    yn.Navigation.showErrorDialog(`Error during showing the dialog, ${error}`);
                }
            );
    }
}