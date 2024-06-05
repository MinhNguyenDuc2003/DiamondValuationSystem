package com.diamondvaluation.common;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "diamond_request")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class DiamondRequest {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@CreatedDate
	private LocalDateTime createdDate;

	@LastModifiedDate
	private LocalDateTime lastModifiedDate;
	
	private String note;
	
	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private RequestStatus status;
	
	@OneToMany(mappedBy = "request", cascade = CascadeType.ALL)
	private List<RequestTrack> trackings;
	
	@ManyToOne
	@JoinColumn(name = "customer_id", nullable = false)
	private Customer customer;
	
	@ManyToMany
	@JoinTable(name = "request_services",joinColumns = @JoinColumn(name = "request_id"), inverseJoinColumns = @JoinColumn(name = "service_id"))
	List<DiamondService> services = new ArrayList<>();

	public DiamondRequest(Integer id) {
		this.id = id;
	}
	
	public List<String> getServiceIds(){
		List<String> list = new ArrayList<>();
		for(DiamondService service : this.services) {
			list.add(service.getId()+"");
		}
		return list;
	}
	
	public String getServiceNames() {
		String names = "";
		for(DiamondService service : this.services) {
			names += service.getName();
		}
		return names;
	}
 	
	
	
}
