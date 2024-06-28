package com.diamondvaluation.admin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.diamondvaluation.admin.request.DiamondPrice;
import com.diamondvaluation.admin.request.DiamondPriceXML;
import com.diamondvaluation.common.diamond.DiamondCertificate;

@Service
public class DiamondPriceService {
	@Autowired
	private RestTemplate restTemplate;

	@Value("${api.diamond.price.idex}")
	private String getIdexApi;

	public DiamondPrice getDiamondPrice(DiamondCertificate certificate) {
		System.out.println(getIdexApi);
		String apiUrl = getIdexApi+"&cut="+certificate.getCut()+"&carat="+certificate.getCarat()+"&color="+certificate.getColor()+"&clarity="+certificate.getClarity()+"&make="+certificate.getMake();
		System.out.println(apiUrl);
		ResponseEntity<DiamondPriceXML> response = restTemplate.getForEntity(apiUrl, DiamondPriceXML.class);
		DiamondPrice price = new DiamondPrice();
		System.out.println(response.getBody().getAvg()+"");
		if((response.getBody().getAvg()+"").length()<30) {
			price.setAvg(Double.parseDouble(response.getBody().getAvg()));
		}
		if((response.getBody().getCount()+"").length()<30) {
			price.setCount(Integer.parseInt(response.getBody().getCount()));
		}
		if((response.getBody().getMax()+"").length()<30) {
			price.setMax(Double.parseDouble(response.getBody().getMax()));
		}
		if((response.getBody().getMin()+"").length()<30) {
			price.setMin(Double.parseDouble(response.getBody().getMin()));
		}
		if((response.getBody().getPrice()+"").length()<30) {
			price.setPrice(Double.parseDouble(response.getBody().getPrice()));
		}
		
		return price;
	}
}
