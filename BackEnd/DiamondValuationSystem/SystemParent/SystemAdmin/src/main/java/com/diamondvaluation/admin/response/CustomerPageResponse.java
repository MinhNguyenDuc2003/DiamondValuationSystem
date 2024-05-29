package com.diamondvaluation.admin.response;

import java.util.List;

import com.diamondvaluation.common.Customer;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@JsonPropertyOrder({"list_customers", "totalPage"})
public class CustomerPageResponse {
	@JsonProperty("list_customers")
	private List<CustomerResponse> listCustomersResponse;
	private int totalPage;

	public CustomerPageResponse(List<CustomerResponse> listCustomersResponse, int totalPage) {
		this.listCustomersResponse = listCustomersResponse;
		this.totalPage = totalPage;
	}
}
