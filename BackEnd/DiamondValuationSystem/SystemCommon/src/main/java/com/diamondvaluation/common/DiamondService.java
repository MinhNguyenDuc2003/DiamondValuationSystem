package com.diamondvaluation.common;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "services")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DiamondService {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(length = 64, nullable = false, unique = false)
	private String name;
	
	@Column(length = 128, nullable = false)
	private String content;
	
	@Column(length = 64, nullable = false, unique = false)
	private double money;
	
	@Column(length = 128)
	private String photo;
	
	private boolean status;

	public DiamondService(Integer id) {
		this.id = id;
	}

	public DiamondService(String name) {
		this.name = name;
	}
	
	
	
	
}
