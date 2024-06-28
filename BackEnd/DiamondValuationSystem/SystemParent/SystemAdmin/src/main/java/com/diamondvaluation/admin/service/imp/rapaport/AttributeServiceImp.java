package com.diamondvaluation.admin.service.imp.rapaport;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.CaratIsNotFoundException;
import com.diamondvaluation.admin.repository.rapaport.CaratRepository;
import com.diamondvaluation.admin.repository.rapaport.DiamondAttributeRepository;
import com.diamondvaluation.admin.response.RapaportResponse;
import com.diamondvaluation.admin.service.rapaport.AttributeService;
import com.diamondvaluation.common.diamond.DiamondClarity;
import com.diamondvaluation.common.diamond.DiamondColor;
import com.diamondvaluation.common.diamond_information.Carat;
import com.diamondvaluation.common.diamond_information.DiamondAttribute;

@Service
public class AttributeServiceImp implements AttributeService {

	@Autowired
	private DiamondAttributeRepository attributeRepo;

	@Autowired
	private CaratRepository caratRepository;

	@Override
	public void addDiamondAttribute(DiamondAttribute diamondAttribute, Integer caratId) {
		Carat carat = caratRepository.findById(caratId)
				.orElseThrow(() -> new RuntimeException("Carat not found with id: " + caratId));

		diamondAttribute.setCarat(carat);

		attributeRepo.save(diamondAttribute);
	}

	public List<DiamondAttribute> getAllDiamondAttributes() {
		return attributeRepo.findAll();
	}

	@Override
	public void updateDiamondAttribute(Integer id, DiamondAttribute diamondAttribute) {
		DiamondAttribute existingAtribute = attributeRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("DiamondAttribute not found with id: " + id));
		existingAtribute.setClarity(diamondAttribute.getClarity());
		existingAtribute.setColor(diamondAttribute.getColor());
		existingAtribute.setNumber(diamondAttribute.getNumber());
		attributeRepo.save(existingAtribute);
	}

	@Override
	public void deleteDiamondAttribute(Integer id) {
		DiamondAttribute diamondAttribute = attributeRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("DiamondAttribute not found with id: " + id));
		attributeRepo.delete(diamondAttribute);
	}

	@Override
	public List<DiamondAttribute> findAttributesByCaratId(Integer caratId) {
		if(!caratRepository.findById(caratId).isPresent()) {
			throw new CaratIsNotFoundException("carat Id is not exist!");
		}
		List<DiamondAttribute> diamondAttributes = attributeRepo.findAllByCaratId(caratId);
		return diamondAttributes;
	}

	@Override
	public List<RapaportResponse> getAll() {
		List<Carat> carats = caratRepository.findAll();
		List<RapaportResponse> list = new ArrayList<>();
		for(Carat c : carats) {
			RapaportResponse response = new RapaportResponse();
			List<DiamondAttribute> diamondAttributes = attributeRepo.findAllByCaratId(c.getId());
			response.setBeginCarat(c.getBeginCarat());
			response.setEndCarat(c.getEndCarat());
			response.setList(diamondAttributes);
			list.add(response);
		}
		return list;
	}

	@Override
	public float findNumberBy4C(float carat, DiamondColor color, DiamondClarity clarity) {
		List<Carat> carats = caratRepository.findAll();
		Integer caratId = 0;
		for(Carat c : carats) {
			if(carat >= c.getBeginCarat() && carat <= c.getEndCarat()) {
				caratId = c.getId();
				break;
			}
		}
		Optional<DiamondAttribute> a = attributeRepo.findNumberBy4C(caratId, color.toString(), clarity.toString());
		if(a.isPresent()) {
			return a.get().getNumber();
		}
		return 0;
	}

}
