package com.diamondvaluation.admin.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
@JsonPropertyOrder({"list_users", "totalPage"})
public class UserPageResponse {
	@JsonProperty("list_users")
	private List<UserResponse> listUserResponse;
	private int totalPage;

	public UserPageResponse(List<UserResponse> lisUserResponse, int totalPage) {
		this.listUserResponse = lisUserResponse;
		this.totalPage = totalPage;
	}
	
	
}
