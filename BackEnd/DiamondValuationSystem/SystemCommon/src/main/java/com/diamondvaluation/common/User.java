package com.diamondvaluation.common;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
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

	@Column(length = 64, nullable = false)
	private String password;

	private boolean enabled;
	@Column(length = 128)
	private String photo;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles = new HashSet<>();
	
	

	public boolean hasRole(String roleName) {
		Iterator<Role> iterator = roles.iterator();

		while (iterator.hasNext()) {
			Role role = iterator.next();
			if (role.getName().equals(roleName)) {
				return true;
			}
		}

		return false;
	}

	public String getFullname() {
		return this.firstName + " " + this.lastName;
	}

	public List<String> getListRoleIds() {
		List<String> listRoles = new ArrayList<>();
		Iterator<Role> iterator = roles.iterator();

		while (iterator.hasNext()) {
			Role role = iterator.next();
			listRoles.add(role.getId()+"");
		}

		return listRoles;
	}
	
	public String getRolesName() {
	    StringBuilder listRole = new StringBuilder();
	    Iterator<Role> iterator = roles.iterator();
	    while (iterator.hasNext()) {
	        Role element = iterator.next();
	        listRole.append(element.getName()).append("/");
	    }
	    
	    // Kiểm tra xem listRole có rỗng hay không trước khi cắt ký tự cuối cùng
	    if (listRole.length() > 0) {
	        listRole.setLength(listRole.length() - 1); // Cắt bỏ ký tự '/' cuối cùng
	    }
	    
	    return listRole.toString();
	}

	public User(Integer id) {
		this.id = id;
	}

}
