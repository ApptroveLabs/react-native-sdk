'use strict';

import { 
	NativeModules,
	NativeEventEmitter,
	Platform,
} from 'react-native';

const module_trackier = NativeModules.TrackierSDK;

let module_trackier_emitter = null;
if (Platform.OS === "android") {
	module_trackier_emitter = new NativeEventEmitter();
} else if (Platform.OS === "ios") {
	module_trackier_emitter = new NativeEventEmitter(NativeModules.TrackierSDK);
}

var TrackierConfig = function(appToken,environment) {
	this.appToken = appToken;
	this.environment = environment;
	this.secretId = '';
	this.secretKey = '';
	this.manualMode = false;
	this.disableOrganicTrack = false;
	this.attributionParams = {};
	this.region = ''; // Default region
	this.facebookAppId = ''; // Default Facebook App ID
	this.androidId = ''; // Default Android ID
}

var TrackierSDK = {};

TrackierSDK.initialize = function(trackierConfig) {
	module_trackier.initializeSDK(trackierConfig)
}

TrackierConfig.prototype.setAppSecret = function(key, value) {
	this.secretId = key;
	this.secretKey = value;
}

TrackierConfig.prototype.setManualMode = function(value) {
	this.manualMode = value;
}

TrackierConfig.prototype.disableOrganicTracking = function(value) {
	this.disableOrganicTrack = value;
}

TrackierConfig.prototype.setAttributionParams = function (params) {
	if (typeof params !== 'object' || params === null) {
		console.error('Invalid parameters passed to setAttributionParams');
		return;
	}
	this.attributionParams = params; 
};

TrackierConfig.prototype.setRegion = function (value) {
	this.region = value;
};

TrackierConfig.prototype.setFacebookAppId = function (value) {
	this.facebookAppId = value;
};

TrackierConfig.prototype.setAndroidId = function (value) {
	this.androidId = value;
};

TrackierSDK.setEnabled = function (value) {
	module_trackier.setEnabled(value)
}

TrackierSDK.getTrackierId = async function () {
	const id = await module_trackier.getTrackierId()
	return id;
}

TrackierSDK.setUserId = function(userId) {
	module_trackier.setUserId(userId)
}

TrackierSDK.setUserEmail = function(userEmail) {
	module_trackier.setUserEmail(userEmail)
}

TrackierSDK.setUserName = function(userName) {
	module_trackier.setUserName(userName)
}

TrackierSDK.setUserPhone = function(userPhone) {
	module_trackier.setUserPhone(userPhone)
}

TrackierSDK.trackAsOrganic = function(value) {
	module_trackier.trackAsOrganic(value)
}

TrackierSDK.setLocalRefTrack = function (value, delimeter) {
	module_trackier.setLocalRefTrack(value, delimeter)
}

TrackierSDK.setUserAdditionalDetails = function (userAdditionalMap) {
	if (Platform.OS === 'android') {
		module_trackier.setUserAdditionalDetails({userAdditionalMap});
		} else if (Platform.OS === 'ios') {
		module_trackier.setUserAdditionalDetails(userAdditionalMap);
	}
};

TrackierSDK.waitForATTUserAuthorization = function (timeoutInterval) {
	module_trackier.waitForATTUserAuthorization(timeoutInterval)
}

TrackierSDK.updateAppleAdsToken = function (value) {
	module_trackier.updateAppleAdsToken(value)
}

TrackierSDK.fireInstall = function () {
	module_trackier.fireInstall()
}

TrackierSDK.parseDeepLink = function (value) {
	module_trackier.parseDeepLink(value)
}

TrackierSDK.setIMEI = function (imei1, imei2) {
	module_trackier.setIMEI(imei1, imei2)
}

TrackierSDK.setMacAddress = function (value) {
	module_trackier.setMacAddress(value)

}

TrackierSDK.storeRetargetting = function (value) {
	module_trackier.storeRetargetting(value)
}

TrackierSDK.getAd = function () {
	return module_trackier.getAd();
}

TrackierSDK.getAdID = function () {
	return module_trackier.getAdID();
}

TrackierSDK.getAdSet = function () {
	return module_trackier.getAdSet();
}

TrackierSDK.getCampaign = function () {
	return module_trackier.getCampaign();
}

TrackierSDK.getCampaignID = function () {
	return module_trackier.getCampaignID();
}

TrackierSDK.getChannel = function () {
	return module_trackier.getChannel();
}

TrackierSDK.getP1 = function () {
	return module_trackier.getP1();
}

TrackierSDK.getP2 = function () {
	return module_trackier.getP2();
}

TrackierSDK.getP3 = function () {
	return module_trackier.getP3();
}

TrackierSDK.getP4 = function () {
	return module_trackier.getP4();
}

TrackierSDK.getP5 = function () {
	return module_trackier.getP5();
}

TrackierSDK.getClickId = function () {
	return module_trackier.getClickId();
}

TrackierSDK.getDlv = function () {
	return module_trackier.getDlv();
}

TrackierSDK.getPid = function () {
	return module_trackier.getPid();
}

TrackierSDK.getIsRetargeting = function () {
	return module_trackier.getIsRetargeting();
}

TrackierSDK.createDynamicLink = function (linkConfig) {
	return module_trackier.createDynamicLink(linkConfig);
};

TrackierSDK.resolveDeeplinkUrl = function (url) {
	return module_trackier.resolveDeeplinkUrl(url);
};

TrackierSDK.trackEvent = function(trackierEvent) {
	let isValidArgs = true;
	let props = ['eventId', 'orderId', 'currency', 'couponCode', 'param1', 'param2', 'param3', 'param4', 'param5', 'param6', 'param7', 'param8', 'param9', 'param10'];
	props.forEach(function (v, k) {
		if (trackierEvent[v] === null || trackierEvent[v] === undefined) {
			return;
		}
		if (typeof trackierEvent[v] != 'string') {
			isValidArgs = false;
			return false;
		}
	})
	if (!isValidArgs || (typeof trackierEvent.revenue != 'undefined' && typeof trackierEvent.revenue != 'number')) {
		return;
	}
	
	module_trackier.trackEvent(trackierEvent)
};

TrackierConfig.EnvironmentDevelopment = "development";
TrackierConfig.EnvironmentProduction = "production";
TrackierConfig.EnvironmentTesting = "testing";
TrackierConfig.IN = "in";
TrackierConfig.GLOBAL = "global";


TrackierConfig.prototype.setDeferredDeeplinkCallbackListener = function(deferredDeeplinkCallbackListener) {
	if (Platform.OS === "android" || Platform.OS === "ios") {
		this.hasDeferredDeeplinkCallback = true;
		module_trackier_emitter.addListener('trackier_deferredDeeplink', deferredDeeplinkCallbackListener);
	}
};

var TrackierEvent = function(eventId) {
	this.eventId = eventId;
	this.orderId = null;
	this.currency = null;
	this.discount = 0;
	this.couponCode = null;
	this.productId = null;
	this.param1 = null;
	this.param2 = null;
	this.param3 = null;
	this.param4 = null;
	this.param5 = null;
	this.param6 = null;
	this.param7 = null;
	this.param8 = null;
	this.param9 = null;
	this.param10 = null;
	this.revenue = 0;

	this.ev = {};
}

TrackierEvent.LEVEL_ACHIEVED = "1CFfUn3xEY"
TrackierEvent.ADD_TO_CART = "Fy4uC1_FlN"
TrackierEvent.ADD_TO_WISHLIST = "AOisVC76YG"
TrackierEvent.COMPLETE_REGISTRATION = "mEqP4aD8dU"
TrackierEvent.TUTORIAL_COMPLETION = "99VEGvXjN7"
TrackierEvent.PURCHASE = "Q4YsqBKnzZ"
TrackierEvent.SUBSCRIBE = "B4N_In4cIP"
TrackierEvent.START_TRIAL = "jYHcuyxWUW"
TrackierEvent.ACHIEVEMENT_UNLOCKED = "xTPvxWuNqm"
TrackierEvent.CONTENT_VIEW = "Jwzois1ays"
TrackierEvent.TRAVEL_BOOKING = "yP1-ipVtHV"
TrackierEvent.SHARE = "dxZXGG1qqL"
TrackierEvent.INVITE = "7lnE3OclNT"
TrackierEvent.LOGIN = "o91gt1Q0PK"
TrackierEvent.UPDATE = "sEQWVHGThl"

TrackierEvent.prototype.setEventValue = function(key, value) {
	if (typeof key !== 'string') {
		return;
	}
	this.ev[key] = value;
};

module.exports = {
	TrackierConfig,
	TrackierSDK,
	TrackierEvent
}

