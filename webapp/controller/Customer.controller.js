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
    function (Controller,MessageBox, JSONModel,Fragment, History ) {
        "use strict";

        return Controller.extend("com.shakib.training.controller.Main", {
            _fragmentList: {},
            onInit: function () {
                let oEditModel = new JSONModel({
                    editmode: false
                });
                this.getView().setModel(oEditModel, "editModel");
                this._showCustomerFragment("DisplayCustomer");
            
                this.getOwnerComponent().getRouter().getRoute("Customer")
                    .attachPatternMatched(this._onPatternMatched, this);
            },
        
            // onExit:function(){

            // },

            // onBeforeRendering:function(){

            // },

            // onAfterRendering:function(){

            // }

            _onPatternMatched:function (oEvent) {
                console.log('oEvent', oEvent)
                let sPath = oEvent.getParameters().arguments.path;
                this.sCustomerPath = "/" + sPath;
                this.getView().bindElement(this.sCustomerPath);
            },
            
            onNavBack:function(){
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
            
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("Main");
                }
            },

            onEditPressed:function(){
                console.log('pressed')
                this._toggleEdit(true);
            },
            
            _toggleEdit:function(bEditMode){
                let oEditModel = this.getView().getModel("editModel");
            
                oEditModel.setProperty("/editmode", bEditMode);
            
                this._showCustomerFragment(bEditMode ? "ChangeCustomer" : "DisplayCustomer");
            },

            _showCustomerFragment: function(sFragmentName){
                let oPage = this.getView().byId("page");
            
                oPage.removeAllContent();
            
                if(this._fragmentList[sFragmentName]){
                    oPage.insertContent(this._fragmentList[sFragmentName]);
                }else{
                    Fragment.load({
                        id: this.getView().createId(sFragmentName),
                        name: "com.shakib.training.view.fragment." + sFragmentName,
                        controller: this
                    }).then(function(oFragment){
                        this._fragmentList[sFragmentName] = oFragment;
                        oPage.insertContent(this._fragmentList[sFragmentName]);
                    }.bind(this));
                }
            },

            genderFormatter: function(gender){
                let oView = this.getView();
                let oI18nModel = oView.getModel("i18n");
                let oResourceBundle = oI18nModel.getResourceBundle();
                let sText = oResourceBundle.getText(gender);
                return sText;
            },

            onSavePressed: function(){
                let oData = this.getView().getModel().getData();     
                this._toggleEdit(false);       
                MessageBox.success("Customer Data: "+JSON.stringify(oData));
                
               
            },
        });
    });
