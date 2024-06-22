package com.diamondvaluation.shop;

import java.util.List;

import com.diamondvaluation.common.setting.Setting;
import com.diamondvaluation.common.setting.SettingBag;

public class PaymentSettingBag extends SettingBag{

	public PaymentSettingBag(List<Setting> listSettings) {
		super(listSettings);
	}
	
	public String getPayPalUrl() {
		return super.getValue("PAYPAL_API_BASE_URL");
	}
	
	public String getClientId() {
		return super.getValue("PAYPAL_API_CLIENT_ID");
	}
	
	public String getClientSecret() {
		return super.getValue("PAYPAL_API_CLIENT_SECRET");
	}
}
