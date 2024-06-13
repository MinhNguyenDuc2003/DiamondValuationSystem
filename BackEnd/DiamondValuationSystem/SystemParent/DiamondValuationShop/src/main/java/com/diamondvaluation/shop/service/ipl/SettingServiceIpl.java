package com.diamondvaluation.shop.service.ipl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.diamondvaluation.common.setting.Setting;
import com.diamondvaluation.common.setting.SettingCategory;
import com.diamondvaluation.shop.EmailSettingBag;
import com.diamondvaluation.shop.repository.SettingRepository;
import com.diamondvaluation.shop.service.SettingService;

@Service
public class SettingServiceIpl implements SettingService {
	private final SettingRepository repo;

	public SettingServiceIpl(SettingRepository serviceRepo) {
		this.repo = serviceRepo;
	}

	@Override
	public EmailSettingBag getEmailSettings() {
		List<Setting> list = repo.findByTwoCategories(SettingCategory.MAIL_SERVER, SettingCategory.MAIL_TEMPLATES);
		EmailSettingBag settings = new EmailSettingBag(list);
		return settings;
	}

	
}
