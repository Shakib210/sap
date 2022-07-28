sap.ui.define(
  [
    "com/shakib/training/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, MessageBox, JSONModel, HOUI5Formatter) {
    "use strict";

    return BaseController.extend("com.shakib.training.controller.Main", {
      onInit: function () {
        this.setContentDensity();

        this.getView().setModel(this.getOwnerComponent().getModel("cdsModel"));
        this.getView().byId("main_smarttable").rebindTable();

        let oEditModel = new JSONModel({
          editmode: false,
        });

        this.setModel(oEditModel, "editModel");
      },

      onAfterRendering: function () {
        let oDataModel = this.getModel();

        oDataModel.read("");
      },

      onDeleteButtonPressed: function (oEvent) {
        this._delete(oEvent.getSource());
      },

      onDeletePressed: function (oEvent) {
        this._delete(oEvent.getParameters().listItem);
      },

      //normal table
      //   _delete: function (oListItem) {
      //     let oModel = this.getModel();
      //     let oResourceBundle = this.getView()
      //       .getModel("i18n")
      //       .getResourceBundle();
      //     let sPath = oListItem.getBindingContext().getPath();

      //     MessageBox.warning(oResourceBundle.getText("sureToDeleteQuestion"), {
      //       title: oResourceBundle.getText("sureToDeleteTitle"),
      //       actions: [MessageBox.Action.YES, MessageBox.Action.NO],
      //       emphasizedAction: MessageBox.Action.YES,
      //       onClose: function (oAction) {
      //         if (MessageBox.Action.YES === oAction) {
      //           oModel.remove(sPath);
      //         }
      //       },
      //     });
      //   },

      //   onListItemPressed: function (oEvent) {
      //     console.log("test");
      //     let sPath = oEvent.getSource().getBindingContext().getPath();
      //     let oRouter = this.getRouter();
      //     oRouter.navTo("Customer", {
      //       path: sPath.split("/")[1],
      //     });
      //   },

      onListItemPressed: function (oEvent) {
        //let sPath = oEvent.getSource().getBindingContext().getPath();
        //let oRouter = this.getOwnerComponent().getRouter();
        let sGuid = oEvent
          .getSource()
          .getBindingContext()
          .getPath()
          .split("'")[1];
        this.getRouter().navTo("Customer", {
          //path: sPath.split("/")[1]
          path: sGuid,
        });
      },

      onDeleteButtonPressed: function (oEvent) {
        let oModel = this.getModel();
        let oResourceBundle = this.getView()
          .getModel("i18n")
          .getResourceBundle();

        let oSource = oEvent.getSource();
        let sPath = oSource.getBindingContext().getPath();

        MessageBox.warning(oResourceBundle.getText("sureToDeleteQuestion"), {
          title: oResourceBundle.getText("sureToDeleteTitle"),
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          emphasizedAction: MessageBox.Action.YES,
          onClose: function (oAction) {
            if (MessageBox.Action.YES === oAction) {
              oModel.remove(sPath, {
                success: (oData, response) => {
                  console.log(oData, response);
                  MessageBox.success("Deleted");
                },
                error: (oError) => {
                  MessageBox.error(oError.message);
                },
              });
            }
          },
        });
      },

      //smart table
      _delete: function (oListItem) {
        //let oModel = this.getModel();
        //let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
        //let sPath = oListItem.getBindingContext().getPath();

        let oModel = this.getOwnerComponent().getModel();
        let sGuid = oListItem.getBindingContext().getPath().split("'")[1];
        let sPath = oModel.createKey("/CustomerSet", {
          CustomerId: sGuid,
        });

        MessageBox.warning(this.getLocalizedText("sureToDeleteQuestion"), {
          title: this.getLocalizedText("sureToDeleteTitle"),
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          emphasizedAction: MessageBox.Action.YES,
          onClose: function (oAction) {
            if (MessageBox.Action.YES === oAction) {
              oModel.remove(sPath, {
                success: (oData, response) => {
                  MessageBox.success(
                    this.getLocalizedText("dialog.delete.success")
                  );
                  this.getModel().refresh();
                },
                error: (oError) => {
                  MessageBox.error(oError.message);
                },
              });
            }
          }.bind(this),
        });
      },

      onCreatePressed: function () {
        console.log("create pressed");
        let oRouter = this.getRouter();
        oRouter.navTo("CreateCustomer", null, false);
      },
    });
  }
);
