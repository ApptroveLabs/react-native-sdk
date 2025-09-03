package com.reactrackier;

import android.util.Log;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.HashMap;
import java.util.Map;
import java.util.LinkedHashMap;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.trackier.sdk.DeepLink;
import com.trackier.sdk.DeepLinkListener;
import com.trackier.sdk.AttributionParams;
import com.trackier.sdk.TrackierSDKConfig;
import com.trackier.sdk.dynamic_link.AndroidParameters;
import com.trackier.sdk.dynamic_link.DesktopParameters;
import com.trackier.sdk.dynamic_link.DynamicLink;
import com.trackier.sdk.dynamic_link.IosParameters;
import com.trackier.sdk.dynamic_link.SocialMetaTagParameters;

import kotlin.Unit;

public class TrackierSDK extends ReactContextBaseJavaModule {

	String secretId = "";
	String secretKey = "";

	public TrackierSDK(ReactApplicationContext context) {
		super(context);
	}

	@Override
	public String getName() {
		return "TrackierSDK";
	}

	@ReactMethod
	public void initializeSDK(ReadableMap initializeMap) {
		com.trackier.sdk.TrackierSDKConfig sdkConfig = new com.trackier.sdk.TrackierSDKConfig(
		getReactApplicationContext(), initializeMap.getString("appToken"),
		initializeMap.getString("environment"));
		sdkConfig.setSDKType("react_native_sdk");
		sdkConfig.setSDKVersion("1.6.75");
		sdkConfig.setAppSecret(initializeMap.getString("secretId"), initializeMap.getString("secretKey"));
		sdkConfig.setManualMode(initializeMap.getBoolean("manualMode"));
		sdkConfig.disableOrganicTracking(initializeMap.getBoolean("disableOrganicTrack"));
		if (initializeMap.hasKey("attributionParams") && initializeMap.getMap("attributionParams") != null) {
			ReadableMap attributionMap = initializeMap.getMap("attributionParams");
			AttributionParams attributionParams = new AttributionParams();

			if (attributionMap.hasKey("ad")) {
				attributionParams.setAd(attributionMap.getString("ad"));
			}
			if (attributionMap.hasKey("partnerId")) {
				attributionParams.setParterId(attributionMap.getString("partnerId"));
			}
			if (attributionMap.hasKey("channel")) {
				attributionParams.setChannel(attributionMap.getString("channel"));
			}
			if (attributionMap.hasKey("adId")) {
				attributionParams.setAdId(attributionMap.getString("adId"));
			}
			if (attributionMap.hasKey("siteId")) {
				attributionParams.setSiteId(attributionMap.getString("siteId"));
			}

			sdkConfig.setAttributionParams(attributionParams);
		} else {
			Log.e("TrackierSDK", "attributionParams map is missing or null");
		}
		if (initializeMap.hasKey("hasDeferredDeeplinkCallback")) {
			sdkConfig.setDeepLinkListener(new DeepLinkListener() {
				@Override
				public void onDeepLinking(@NonNull DeepLink deepLink) {
					sendEvent(getReactApplicationContext(), "trackier_deferredDeeplink", deepLink.getUrl());
				}
			});
		}
		if (initializeMap.hasKey("region")) {
			String regionStr = initializeMap.getString("region");
			if (regionStr != null) {
				TrackierSDKConfig.Region selectedRegion = null;

				switch (regionStr.toUpperCase()) {
					case "IN":
						selectedRegion = TrackierSDKConfig.Region.IN;
						break;
					case "GLOBAL":
						selectedRegion = TrackierSDKConfig.Region.GLOBAL;
						break;
					default:
						android.util.Log.w("React-Native", "Unknown region: " + regionStr);
						break;
				}

				if (selectedRegion != null) {
					sdkConfig.setRegion(selectedRegion);
				}
			}
		}
		
		if (initializeMap.hasKey("facebookAppId")) {
			String facebookAppId = initializeMap.getString("facebookAppId");
			if (facebookAppId != null && !facebookAppId.isEmpty()) {
				sdkConfig.setFacebookAppId(facebookAppId);
			}
		}
		
		if (initializeMap.hasKey("androidId")) {
			String androidId = initializeMap.getString("androidId");
			if (androidId != null && !androidId.isEmpty()) {
				sdkConfig.setAndroidId(androidId);
			}
		}
		com.trackier.sdk.TrackierSDK.initialize(sdkConfig);
	}

	@ReactMethod
	public void setEnabled(boolean value) {
		com.trackier.sdk.TrackierSDK.setEnabled(value);
	}

	@ReactMethod
	public void getTrackierId(Promise promise) {
		String id = com.trackier.sdk.TrackierSDK.getTrackierId();
		promise.resolve(id);
	}

	@ReactMethod
	public void setUserId(String userId) {
		com.trackier.sdk.TrackierSDK.setUserId(userId);
	}

	@ReactMethod
	public void trackAsOrganic(boolean value) {
		com.trackier.sdk.TrackierSDK.trackAsOrganic(value);
	}

	@ReactMethod
	public void setUserEmail(String userEmail) {
		com.trackier.sdk.TrackierSDK.setUserEmail(userEmail);
	}

	@ReactMethod
	public void setUserName(String userName) {
		com.trackier.sdk.TrackierSDK.setUserName(userName);
	}

	@ReactMethod
	public void setUserPhone(String userPhone) {
		com.trackier.sdk.TrackierSDK.setUserPhone(userPhone);
	}

	@ReactMethod
	public void parseDeepLink(String uri) {
		Uri data = Uri.parse(uri);
		com.trackier.sdk.TrackierSDK.parseDeepLink(data);
	}

	@ReactMethod
	public void updateAppleAdsToken(String token) {
		//for ios only
	}

	@ReactMethod
	public void storeRetargetting(String url) {
		com.trackier.sdk.TrackierSDK.storeRetargetting(getReactApplicationContext(), url);
	}

	@ReactMethod
	public void getAd(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getAd());
	}

	@ReactMethod
	public void getAdID(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getAdID());
	}

	@ReactMethod
	public void getAdSet(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getAdSet());
	}

	@ReactMethod
	public void getCampaign(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getCampaign());
	}

	@ReactMethod
	public void getCampaignID(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getCampaignID());
	}

	@ReactMethod
	public void getChannel(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getChannel());
	}

	@ReactMethod
	public void getP1(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getP1());
	}

	@ReactMethod
	public void getP2(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getP2());
	}

	@ReactMethod
	public void getP3(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getP3());
	}

	@ReactMethod
	public void getP4(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getP4());
	}

	@ReactMethod
	public void getP5(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getP5());
	}

	@ReactMethod
	public void getClickId(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getClickId());
	}

	@ReactMethod
	public void getDlv(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getDlv());
	}

	@ReactMethod
	public void getPid(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getPid());
	}

	@ReactMethod
	public void getIsRetargeting(Promise promise) {
		promise.resolve(com.trackier.sdk.TrackierSDK.getIsRetargeting());
	}

	@ReactMethod
	public void setPreinstallAttribution(String pid, String campaign, String campaignId) {
		com.trackier.sdk.TrackierSDK.setPreinstallAttribution(pid, campaign, campaignId);
	}

	@ReactMethod
	public void setLocalRefTrack(boolean value, String delimeter) {
		com.trackier.sdk.TrackierSDK.setLocalRefTrack(value, delimeter);
	}

	@ReactMethod
	public void fireInstall() {
		com.trackier.sdk.TrackierSDK.fireInstall();
	}

	@ReactMethod
	public void setIMEI(String imei1, String imei2) {
		com.trackier.sdk.TrackierSDK.setIMEI(imei1, imei2);
	}

	@ReactMethod
	public void setMacAddress(String macAddress) {
		com.trackier.sdk.TrackierSDK.setMacAddress(macAddress);
	}

		@ReactMethod
	public void createDynamicLink(ReadableMap config, Promise promise) {
		try {
			DynamicLink.Builder builder = new DynamicLink.Builder();

			if (config.hasKey("templateId")) {
				builder.setTemplateId(config.getString("templateId"));
			}

			if (config.hasKey("link")) {
				builder.setLink(Uri.parse(config.getString("link")));
			}

			if (config.hasKey("domainUriPrefix")) {
				builder.setDomainUriPrefix(config.getString("domainUriPrefix"));
			}

			if (config.hasKey("deepLinkValue")) {
				builder.setDeepLinkValue(config.getString("deepLinkValue"));
			}

			if (config.hasKey("androidParameters")) {
				ReadableMap androidParams = config.getMap("androidParameters");
				AndroidParameters.Builder androidBuilder = new AndroidParameters.Builder();
				if (androidParams.hasKey("redirectLink")) {
					androidBuilder.setRedirectLink(androidParams.getString("redirectLink"));
				}
				builder.setAndroidParameters(androidBuilder.build());
			}

			if (config.hasKey("iosParameters")) {
				ReadableMap iosParams = config.getMap("iosParameters");
				IosParameters.Builder iosBuilder = new IosParameters.Builder();
				if (iosParams.hasKey("redirectLink")) {
					iosBuilder.setRedirectLink(iosParams.getString("redirectLink"));
				}
				builder.setIosParameters(iosBuilder.build());
			}

			if (config.hasKey("desktopParameters")) {
				ReadableMap desktopParams = config.getMap("desktopParameters");
				DesktopParameters.Builder desktopBuilder = new DesktopParameters.Builder();
				if (desktopParams.hasKey("redirectLink")) {
					desktopBuilder.setRedirectLink(desktopParams.getString("redirectLink"));
				}
				builder.setDesktopParameters(desktopBuilder.build());
			}

			if (config.hasKey("socialMetaTagParameters")) {
				ReadableMap meta = config.getMap("socialMetaTagParameters");
				SocialMetaTagParameters.Builder metaBuilder = new SocialMetaTagParameters.Builder();
				if (meta.hasKey("title")) {
					metaBuilder.setTitle(meta.getString("title"));
				}
				if (meta.hasKey("description")) {
					metaBuilder.setDescription(meta.getString("description"));
				}
				if (meta.hasKey("imageLink")) {
					metaBuilder.setImageLink(meta.getString("imageLink"));
				}
				builder.setSocialMetaTagParameters(metaBuilder.build());
			}

			if (config.hasKey("sdkParameters")) {
				ReadableMap sdkParams = config.getMap("sdkParameters");
				Map<String, String> paramMap = new HashMap<>();
				ReadableMapKeySetIterator iterator = sdkParams.keySetIterator();
				while (iterator.hasNextKey()) {
					String key = iterator.nextKey();
					paramMap.put(key, sdkParams.getString(key));
				}
				builder.setSDKParameters(paramMap);
			}

			if (config.hasKey("attributionParameters")) {
				ReadableMap attrParams = config.getMap("attributionParameters");

				String channel = attrParams.hasKey("channel") ? attrParams.getString("channel") : "";
				String campaign = attrParams.hasKey("campaign") ? attrParams.getString("campaign") : "";
				String mediaSource = attrParams.hasKey("mediaSource") ? attrParams.getString("mediaSource") : "";

				String p1 = attrParams.hasKey("p1") ? attrParams.getString("p1") : "";
				String p2 = attrParams.hasKey("p2") ? attrParams.getString("p2") : "";
				String p3 = attrParams.hasKey("p3") ? attrParams.getString("p3") : "";
				String p4 = attrParams.hasKey("p4") ? attrParams.getString("p4") : "";
				String p5 = attrParams.hasKey("p5") ? attrParams.getString("p5") : "";

				builder.setAttributionParameters(channel, campaign, mediaSource, p1, p2, p3, p4, p5);
			}

			DynamicLink dynamicLink = builder.build();

			com.trackier.sdk.TrackierSDK.createDynamicLink(
					dynamicLink,
					dynamicLinkUrl -> {
						promise.resolve(dynamicLinkUrl);
						return Unit.INSTANCE;
					},
					error -> {
						promise.reject("CREATE_DYNAMIC_LINK_FAILED", error);
						return Unit.INSTANCE;
					}
			);

		} catch (Exception e) {
			promise.reject("CREATE_DYNAMIC_LINK_EXCEPTION", e);
		}
	}

	@ReactMethod
	public void resolveDeeplinkUrl(String url, Promise promise) {
		com.trackier.sdk.TrackierSDK.INSTANCE.resolveDeeplinkUrl(
				url,
				resultUrl -> {
					try {
						WritableMap result = Arguments.createMap();
						result.putString("url", resultUrl.getUrl());

						WritableMap sdkParamsMap = Arguments.createMap();
						Map<String, Object> sdkParams = resultUrl.getSdkParams();
						if (sdkParams != null) {
							for (Map.Entry<String, Object> entry : sdkParams.entrySet()) {
								sdkParamsMap.putString(entry.getKey(), entry.getValue().toString());
							}
						}
						result.putMap("sdkParams", sdkParamsMap);
						promise.resolve(result);
					} catch (Exception e) {
						promise.reject("DL_PARSE_ERROR", e);
					}
					return Unit.INSTANCE;
				},
				error -> {
					promise.reject("RESOLVE_DEEPLINK_FAILED", error);
					return Unit.INSTANCE;
				}
		);
	}


	@ReactMethod
	public void setUserAdditionalDetails(ReadableMap userAdditionalDetailsMap) {
		Log.d("trackiersdk", "JS map received: " + userAdditionalDetailsMap);

		if (checkKey(userAdditionalDetailsMap, "userAdditionalMap")) {
			ReadableMap map = userAdditionalDetailsMap.getMap("userAdditionalMap");

			if (map != null) {
				Map<String, Object> userAdditionalDetail = TrackierUtil.toMap(map);

				// Optional: clean/map to string values if needed
				Map<String, Object> ev = new LinkedHashMap<>();
				for (Map.Entry<String, Object> entry : userAdditionalDetail.entrySet()) {
					ev.put(entry.getKey(), entry.getValue() != null ? entry.getValue().toString() : "");
				}

				Log.d("trackiersdk", "Passing to SDK: " + ev.toString());
				com.trackier.sdk.TrackierSDK.setUserAdditionalDetails(ev); // this calls your Kotlin method
			}
		}
	}

	@ReactMethod
	public void trackEvent(ReadableMap trackierEventMap) {
		com.trackier.sdk.TrackierEvent trackierEvent = new com.trackier.sdk.TrackierEvent(
				trackierEventMap.getString("eventId"));

		trackierEvent.orderId = null;
		trackierEvent.currency = null;
		trackierEvent.discount = null;
		trackierEvent.couponCode = null;
		trackierEvent.productId = null;
		trackierEvent.param1 = null;
		trackierEvent.param2 = null;
		trackierEvent.param3 = null;
		trackierEvent.param4 = null;
		trackierEvent.param5 = null;
		trackierEvent.param6 = null;
		trackierEvent.param7 = null;
		trackierEvent.param8 = null;
		trackierEvent.param9 = null;
		trackierEvent.param10 = null;
		trackierEvent.revenue = null;

		if (checkKey(trackierEventMap, "orderId")) {
			trackierEvent.orderId = trackierEventMap.getString("orderId");
		}
		if (checkKey(trackierEventMap, "currency")) {
			trackierEvent.currency = trackierEventMap.getString("currency");
		}
		if (checkKey(trackierEventMap, "couponCode")) {
			trackierEvent.couponCode = trackierEventMap.getString("couponCode");
		}
		if (checkKey(trackierEventMap, "productId")) {
			trackierEvent.productId = trackierEventMap.getString("productId");
		}
		if (checkKey(trackierEventMap, "discount")) {
			trackierEvent.discount = (float) trackierEventMap.getDouble("discount");
		}
		if (checkKey(trackierEventMap, "param1")) {
			trackierEvent.param1 = trackierEventMap.getString("param1");
		}
		if (checkKey(trackierEventMap, "param2")) {
			trackierEvent.param2 = trackierEventMap.getString("param2");
		}
		if (checkKey(trackierEventMap, "param3")) {
			trackierEvent.param3 = trackierEventMap.getString("param3");
		}
		if (checkKey(trackierEventMap, "param4")) {
			trackierEvent.param4 = trackierEventMap.getString("param4");
		}
		if (checkKey(trackierEventMap, "param5")) {
			trackierEvent.param5 = trackierEventMap.getString("param5");
		}
		if (checkKey(trackierEventMap, "param6")) {
			trackierEvent.param6 = trackierEventMap.getString("param6");
		}
		if (checkKey(trackierEventMap, "param7")) {
			trackierEvent.param7 = trackierEventMap.getString("param7");
		}
		if (checkKey(trackierEventMap, "param8")) {
			trackierEvent.param8 = trackierEventMap.getString("param8");
		}
		if (checkKey(trackierEventMap, "param9")) {
			trackierEvent.param9 = trackierEventMap.getString("param9");
		}
		if (checkKey(trackierEventMap, "param10")) {
			trackierEvent.param10 = trackierEventMap.getString("param10");
		}
		if (checkKey(trackierEventMap, "revenue")) {
			trackierEvent.revenue = trackierEventMap.getDouble("revenue");
		}

		Map<String, Object> eventValues = TrackierUtil.toMap(trackierEventMap.getMap("ev"));
		Map<String, Object> ev = new LinkedHashMap<String, Object>();
		if (eventValues != null) {
			for (Map.Entry<String, Object> entry : eventValues.entrySet()) {
				ev.put(entry.getKey(), entry.getValue().toString());
			}
		}
		trackierEvent.ev = ev;
		com.trackier.sdk.TrackierSDK.trackEvent(trackierEvent);
	}

	private boolean checkKey(ReadableMap map, String key) {
		return map.hasKey(key) && !map.isNull(key);
	}

	private void sendEvent(ReactApplicationContext reactContext, String eventName, @Nullable String params) {
		reactContext
				.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
				.emit(eventName, params);
	}
}
