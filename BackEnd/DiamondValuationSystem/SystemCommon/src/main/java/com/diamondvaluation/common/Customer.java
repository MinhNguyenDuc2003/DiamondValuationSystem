package com.diamondvaluation.common;

import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cutomers")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Customer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(length = 128, nullable = false, unique = true)
	private String email;
	@Column(name = "phone_number", length = 64, nullable = false)
	private String phoneNumber;
	@Column(name = "first_name", length = 45, nullable = false)
	private String firstName;
	@Column(name = "last_name", length = 45, nullable = false)
	private String lastName;

	private String location;
	@Column(length = 64, nullable = false)
	private String password;
	
	@Column(name = "verification_code", length = 64)
	private String verificationCode;
	
	@Column(name = "created_time", nullable =false, updatable = false)
	private Date createdTime;
	
	@OneToMany
	private List<Appoinment> appoinments;

	private boolean enabled;

	public Customer(Integer id) {
		this.id = id;
	}
	
	
	
}
