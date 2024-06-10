package com.diamondvaluation.admin.request;

import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenRequest {
	@NotNull @Length(max = 20)
	private String id;
	
	@NotNull @Length(min = 36, max = 50)
	private String refreshToken;
}
