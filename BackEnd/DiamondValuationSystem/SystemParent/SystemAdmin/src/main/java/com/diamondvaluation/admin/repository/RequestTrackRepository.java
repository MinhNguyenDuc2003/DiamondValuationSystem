package com.diamondvaluation.admin.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.RequestTrack;

@Repository
public interface RequestTrackRepository extends CrudRepository<RequestTrack, Integer>{

}
