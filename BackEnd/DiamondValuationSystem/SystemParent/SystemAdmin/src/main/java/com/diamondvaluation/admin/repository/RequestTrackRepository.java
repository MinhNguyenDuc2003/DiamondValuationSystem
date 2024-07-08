package com.diamondvaluation.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.RequestTrack;

@Repository
public interface RequestTrackRepository extends CrudRepository<RequestTrack, Integer>{
	@Query("SELECT r FROM RequestTrack r WHERE r.request.id = ?1")
	List<RequestTrack> findTrackByRequestId(Integer id);
}
