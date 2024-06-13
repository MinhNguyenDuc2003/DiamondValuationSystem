package com.diamondvaluation.common.diamond_information;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name="carats")
@NoArgsConstructor
@AllArgsConstructor
public class Carat {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(name="begin_carat")
	private float beginCarat;
	
	@Column(name="end_carat")
	private float endCarat;
	
	@OneToMany(mappedBy="carat")
	private List<DiamondAttribute> diamondAttributes;
	
}
