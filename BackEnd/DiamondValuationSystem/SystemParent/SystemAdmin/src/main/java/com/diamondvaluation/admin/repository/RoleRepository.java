package com.diamondvaluation.admin.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.Role;

@Repository
public interface RoleRepository extends CrudRepository<Role, Integer>{

}
