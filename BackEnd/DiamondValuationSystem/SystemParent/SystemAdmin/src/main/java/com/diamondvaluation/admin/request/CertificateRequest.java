package com.diamondvaluation.admin.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CertificateRequest {
	@NotBlank(message = "Cut is mandatory")
    private String cut;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotBlank(message = "Carat is mandatory")
    private String carat;

    @NotBlank(message = "Color is mandatory")
    private String color;

    @NotBlank(message = "Clarity is mandatory")
    private String clarity;

    @NotBlank(message = "Make is mandatory")
    private String make;

    @NotBlank(message = "Measurement is mandatory")
    private String measurement;

    @NotBlank(message = "Polish is mandatory")
    private String polish;

    @NotBlank(message = "Symmetry is mandatory")
    private String symmetry;

    @NotBlank(message = "Flourescence is mandatory")
    private String flourescence;
	
    @NotNull(message = "requestId is mandatory")
	private int request_id;
}
