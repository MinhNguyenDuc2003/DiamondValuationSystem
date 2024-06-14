package com.diamondvaluation.admin.service.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.repository.SettingRepository;
import com.diamondvaluation.admin.service.SettingService;
import com.diamondvaluation.common.setting.Setting;
import com.diamondvaluation.common.setting.SettingCategory;

@Service
public class SettingServiceImp implements SettingService {
	private final SettingRepository repo;

	public SettingServiceImp(SettingRepository serviceRepo) {
		this.repo = serviceRepo;
	}

	@Override
	public void saveAll(Iterable<Setting> settings) {
		repo.saveAll(settings);
	}
	@Override
	public List<Setting> getMailServerSettings() {
		return repo.findByCategory(SettingCategory.MAIL_SERVER);
	}
	@Override
	public List<Setting> getMailTemplateSettings() {
		return repo.findByCategory(SettingCategory.MAIL_TEMPLATES);
	}	
}
