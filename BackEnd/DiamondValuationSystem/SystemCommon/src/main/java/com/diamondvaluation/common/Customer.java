package com.diamondvaluation.common;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "customers")	
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Customer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(length = 128, nullable = false, unique = true)
	private String email;
	@Column(name = "phone_number", length = 64)
	private String phoneNumber;
	@Column(name = "first_name", length = 45)
	private String firstName;
	@Column(name = "last_name", length = 45)
	private String lastName;

	private String location;
	@Column(length = 64, nullable = false)
	private String password;
	
	@Column(name = "verification_code", length = 64)
	private String verificationCode;
	
	@Column(name = "created_time")
	@CreatedDate
	private LocalDateTime createdTime;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "authentication_type", length = 10)
	private AuthenticationType authenticationType;
	
	@OneToMany(mappedBy = "customer",cascade = CascadeType.REMOVE, orphanRemoval = true)
	private List<DiamondRequest> appoinments;

	private boolean enabled;

	public Customer(Integer id) {
		this.id = id;
	}
	
	public String getFullname() {
		return this.firstName + " " + this.lastName;
	}

	public Customer(String name, String email,String location, AuthenticationType type) {
		this.firstName = name;
		this.email = email;
		this.authenticationType = type;
		this.location = location;
	}

	
}
