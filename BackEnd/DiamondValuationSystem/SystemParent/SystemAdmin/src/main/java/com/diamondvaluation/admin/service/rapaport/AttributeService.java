package com.diamondvaluation.admin.service.rapaport;

import java.util.List;

import com.diamondvaluation.admin.response.RapaportResponse;
import com.diamondvaluation.common.diamond.DiamondClarity;
import com.diamondvaluation.common.diamond.DiamondColor;
import com.diamondvaluation.common.diamond_information.DiamondAttribute;

public interface AttributeService {

//	void addDiamondAtribute(DiamondAtribute diamondAtribute, Integer caratId);

	void addDiamondAttribute(DiamondAttribute diamondAttribute, Integer id);

	List<DiamondAttribute> getAllDiamondAttributes();

	void updateDiamondAttribute(Integer id, DiamondAttribute diamondAttribute);

	void deleteDiamondAttribute(Integer id);

	List<DiamondAttribute> findAttributesByCaratId(Integer caratId);
	
	List<RapaportResponse> getAll();
	
	float findNumberBy4C(float carat, DiamondColor color, DiamondClarity clarity);
}
