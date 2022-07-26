sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.shakib.training.controller.Main", {
          
            onInit: function () {
            },

            onAfterRendering:function(){
                let oDataModel= this.getView().getModel();

                oDataModel.read("")
            }
        });
    });
