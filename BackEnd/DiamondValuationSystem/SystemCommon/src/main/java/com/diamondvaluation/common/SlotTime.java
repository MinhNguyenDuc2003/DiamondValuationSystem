package com.diamondvaluation.common;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="slot_time")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SlotTime {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable = false, unique = true)
	private String time;
	
	@Column(nullable = false, unique = false, name = "number_request")
	private int number;
	
	@OneToMany(mappedBy = "slot")
	@JsonIgnore
	private List<DiamondRequest> requests;

	public SlotTime(Integer id) {
		this.id = id;
	}
	
	
}
