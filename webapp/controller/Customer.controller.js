sap.ui.define(
  [
    "com/shakib/training/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
    "com/shakib/training/controller/formatter/HOUI5Formatter",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} BaseController
   */
  function (
    BaseController,
    MessageBox,
    JSONModel,
    Fragment,
    History,
    HOUI5Formatter
  ) {
    "use strict";

    return BaseController.extend("com.shakib.training.controller.Main", {
      formatter: HOUI5Formatter,
      _fragmentList: {},
      bCreate: false,

      onInit: function () {
        let oEditModel = new JSONModel({
          editmode: false,
        });

        this.setModel(oEditModel, "editModel");

        let oRouter = this.getRouter();

        oRouter
          .getRoute("Customer")
          .attachPatternMatched(this._onPatternMatched, this);

        oRouter
          .getRoute("CreateCustomer")
          .attachPatternMatched(this._onCreatePatternMatched, this);
      },

      // onExit:function(){

      // },

      // onBeforeRendering:function(){

      // },

      // onAfterRendering:function(){

      // }

      //not smart table
    //   _onPatternMatched: function (oEvent) {
    //     this.bCreate = false;

    //     let sPath = oEvent.getParameters().arguments.path;
    //     this.sCustomerPath = "/" + sPath;
    //     this.getView().bindElement(this.sCustomerPath);

    //     this.getModel("editModel").setProperty("/editmode", false);
    //     this._showCustomerFragment("DisplayCustomer");
    //   },


    //smart table
    _onPatternMatched: function (oEvent) {
        this.bCreate = false;
    
        //let sPath = oEvent.getParameters().arguments.path;
        //this.sCustomerPath = "/" + sPath;
        
        let sGuid = oEvent.getParameters().arguments.path;
        this.sCustomerPath = this.getModel().createKey("/CustomerSet", {
            CustomerId: sGuid
        });
        
        this.getView().bindElement(this.sCustomerPath);
    
        this.getView().getModel("editModel").setProperty("/editmode", false);
        this._showCustomerFragment("DisplayCustomer");
    },

      _onCreatePatternMatched: function (oEvent) {
        this.bCreate = true;

        let oNewCustomerContext = this.getView()
          .getModel()
          .createEntry("/CustomerSet");
        this.getView().bindElement(oNewCustomerContext.getPath());

        this.getModel("editModel").setProperty("/editmode", true);
        this._showCustomerFragment("ChangeCustomer");
      },

      // _onPatternMatched:function (oEvent) {
      //     console.log('oEvent', oEvent)
      //     let sPath = oEvent.getParameters().arguments.path;
      //     this.sCustomerPath = "/" + sPath;
      //     this.getView().bindElement(this.sCustomerPath);
      // },

      onEditPressed: function () {
        console.log("pressed");
        this._toggleEdit(true);
      },

      _toggleEdit: function (bEditMode) {
        let oEditModel = this.getModel("editModel");

        oEditModel.setProperty("/editmode", bEditMode);

        this._showCustomerFragment(
          bEditMode ? "ChangeCustomer" : "DisplayCustomer"
        );
      },

      _showCustomerFragment: function (sFragmentName) {
        let oPage = this.getView().byId("page");

        oPage.removeAllContent();

        if (this._fragmentList[sFragmentName]) {
          oPage.insertContent(this._fragmentList[sFragmentName]);
        } else {
          Fragment.load({
            id: this.getView().createId(sFragmentName),
            name: "com.shakib.training.view.fragment." + sFragmentName,
            controller: this,
          }).then(
            function (oFragment) {
              this._fragmentList[sFragmentName] = oFragment;
              oPage.insertContent(this._fragmentList[sFragmentName]);
            }.bind(this)
          );
        }
      },

      genderFormatter: function (gender) {
        let oView = this.getView();
        let oI18nModel = oView.getModel("i18n");
        let oResourceBundle = oI18nModel.getResourceBundle();
        let sText = oResourceBundle.getText(gender);
        return sText;
      },

      // onSavePressed: function(){
      //     let oData = this.getView().getModel().getData();
      //     this._toggleEdit(false);
      //     MessageBox.success("Customer Data: "+JSON.stringify(oData));

      // },

      onSavePressed: function () {
        let oModel = this.getModel();
        let oResourceBundle = this.getView()
          .getModel("i18n")
          .getResourceBundle();
        let sSuccessText = this.bCreate
          ? oResourceBundle.getText("dialog.create.success")
          : oResourceBundle.getText("dialog.edit.success");
        /*
                
                let oData = oModel.getData();
                MessageBox.success(JSON.stringify(oData));
                this._toggleEdit(false);
                */
        oModel.submitChanges({
          success: (oData, response) => {
            MessageBox.success(sSuccessText, {
              onClose: () => {
                if (this.bCreate) {
                  this.onNavBack();
                } else {
                  this._toggleEdit(false);
                }
              },
            });
          },
          error: (oError) => {
            MessageBox.error(oError.message);
          },
        });
      },

      onCancelPressed: function () {
        let oModel = this.getView().getModel();
        oModel.resetChanges().then(() => {
          if (this.bCreate) {
            this.onNavBack();
          } else {
            this._toggleEdit(false);
          }
        });
      },
    });
  }
);
