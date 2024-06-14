package com.diamondvaluation.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.service.SettingService;
import com.diamondvaluation.common.setting.Setting;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("api/settings")
public class SettingController {
	private final SettingService service;
	
	public SettingController (SettingService service) {
		this.service = service;
	}
	
	@PostMapping("/save_mail_server")
	public ResponseEntity<?> saveMailServerSetting(HttpServletRequest request){
		List<Setting> mailServerSettings = service.getMailServerSettings();
		updateSettingValuesFromForm(request, mailServerSettings);
		return ResponseEntity.ok().build();
	}
	
	@PostMapping("/save_mail_template")
	public ResponseEntity<?> saveMailTemplateSetting(HttpServletRequest request){
		List<Setting> mailServerSettings = service.getMailTemplateSettings();
		updateSettingValuesFromForm(request, mailServerSettings);
		return ResponseEntity.ok().build();
	}
	
	private void updateSettingValuesFromForm(HttpServletRequest request, List<Setting> listSettings) {
		for (Setting setting : listSettings) {
			String value = request.getParameter(setting.getKey());
			if (value != null) {
				setting.setValue(value);
			}
		}
		service.saveAll(listSettings);
	}
}
