package com.diamondvaluation.admin.service.imp.rapaport;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.diamondvaluation.admin.repository.rapaport.CaratRepository;
import com.diamondvaluation.admin.repository.rapaport.DiamondAttributeRepository;
import com.diamondvaluation.admin.service.rapaport.CaratService;
import com.diamondvaluation.common.diamond_information.Carat;

@Service
public class CaratServiceImp implements CaratService {

	@Autowired
	private CaratRepository caratRepository;
	
	@Override
	public void addCarat(Carat carat) {
		caratRepository.save(carat);
	}

	@Override
	public Carat getCaratById(Integer id) {
		Carat carat = caratRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid carat Id " + id));
		return carat;
	}

	@Override
	public void updateCarat(Carat carat) {
		if (!caratRepository.existsById(carat.getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid carat Id " + carat.getId());
		}
		caratRepository.save(carat);
	}

	@Override
	public void deleteCarat(Integer id) {
		if (!caratRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid carat Id " + id);
		}
		caratRepository.deleteById(id);
	}

	@Override
	public int getIdByBeginEndCarat(double beginCarat, double endCarat) {
	    Optional<Carat> optionalCarat = caratRepository.findByBeginCaratAndEndCarat(beginCarat, endCarat);
	    if (optionalCarat.isPresent()) {
	        return optionalCarat.get().getId();
	    } else {
	        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Carat not found for beginCarat: " + beginCarat + " and endCarat: " + endCarat);
	    }
	}

	
}

