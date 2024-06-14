package com.diamondvaluation.admin.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.setting.Setting;
import com.diamondvaluation.common.setting.SettingCategory;

@Repository
public interface SettingRepository extends CrudRepository<Setting, String>{
	List<Setting> findByCategory(SettingCategory category);
}
