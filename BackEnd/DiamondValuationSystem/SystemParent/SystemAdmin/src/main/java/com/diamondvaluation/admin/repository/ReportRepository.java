package com.diamondvaluation.admin.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.Report;

@Repository
public interface ReportRepository extends CrudRepository<Report, Integer>{

}
