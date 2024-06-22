package com.diamondvaluation.shop.service;

import com.diamondvaluation.shop.EmailSettingBag;
import com.diamondvaluation.shop.PaymentSettingBag;

public interface SettingService {
	EmailSettingBag getEmailSettings();
	PaymentSettingBag getPaymentSettings();
}
