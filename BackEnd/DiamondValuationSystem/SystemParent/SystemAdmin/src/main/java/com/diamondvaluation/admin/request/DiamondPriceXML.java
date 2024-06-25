package com.diamondvaluation.admin.request;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@JacksonXmlRootElement(localName = "pr")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DiamondPriceXML {
	private String price;
	private String min;
	private String max;
	private String avg;
	private String count;
	private String link;
}
