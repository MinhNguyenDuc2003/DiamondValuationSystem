package com.diamondvaluation.admin.service.rapaport;

import com.diamondvaluation.common.diamond_information.Carat;

public interface CaratService {
	void addCarat(Carat carat);

	Carat getCaratById(Integer id);

	void updateCarat(Carat carat);

	void deleteCarat(Integer id);

	int getIdByBeginEndCarat(double beginCarat, double endCarat);
}
