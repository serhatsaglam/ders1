sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		dateFormat: function (date) {
			var options = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric'
			};

			var sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage();

			try {
				if (date !== null || date !== "" || date !== undefined) {
					date = date.toLocaleDateString(sCurrentLocale, options);
				}
			} catch (err) {
				var errMsg = err.toString();
			}

			return date;
		}

	};

});