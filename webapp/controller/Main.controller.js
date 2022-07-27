sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, Fragment,History) {
        "use strict";

        return Controller.extend("com.shakib.training.controller.Main", {
          
            onInit: function () {
                let oEditModel = new JSONModel({
                    editmode: false
                });
            
                this.getView().setModel(oEditModel, "editModel");
             
            },

            onAfterRendering:function(){
                let oDataModel= this.getView().getModel();

                oDataModel.read("")
            },

            

     

            onDeleteButtonPressed: function(oEvent){
                this._delete(oEvent.getSource());
            },
            
            onDeletePressed: function(oEvent){
                this._delete(oEvent.getParameters().listItem);
            },
            
            _delete: function(oListItem){
                let oModel = this.getView().getModel();
                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                let sPath = oListItem.getBindingContext().getPath();
            
                MessageBox.warning(oResourceBundle.getText("sureToDeleteQuestion"), {
                    title: oResourceBundle.getText("sureToDeleteTitle"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function(oAction){
                        if(MessageBox.Action.YES === oAction){
                            oModel.remove(sPath);
                        }
                    }
                });
            },

            onListItemPressed: function(oEvent){
                let sPath = oEvent.getSource().getBindingContext().getPath();
                let oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Customer", {
                    path: sPath.split("/")[1]
                });
            },

            onDeleteButtonPressed: function(oEvent){

                let oModel = this.getView().getModel();
                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            
                let oSource = oEvent.getSource();
                let sPath = oSource.getBindingContext().getPath();
            
                MessageBox.warning(oResourceBundle.getText("sureToDeleteQuestion"), {
                    title: oResourceBundle.getText("sureToDeleteTitle"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function(oAction){
                        if(MessageBox.Action.YES === oAction){
                            oModel.remove(sPath, {
                                success: (oData, response) => {
                                    console.log(oData, response)
                                    MessageBox.success("Deleted");
                                },
                                error: (oError) => {
                                    MessageBox.error(oError.message);
                                }
                            });
                        }
                    }
                });
            },
        });
    });
