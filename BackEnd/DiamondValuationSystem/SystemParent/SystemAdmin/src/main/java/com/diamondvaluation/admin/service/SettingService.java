package com.diamondvaluation.admin.service;

import java.util.List;

import com.diamondvaluation.common.setting.Setting;

public interface SettingService {

	void saveAll(Iterable<Setting> settings);

	List<Setting> getMailServerSettings();

	List<Setting> getMailTemplateSettings();
	
}
