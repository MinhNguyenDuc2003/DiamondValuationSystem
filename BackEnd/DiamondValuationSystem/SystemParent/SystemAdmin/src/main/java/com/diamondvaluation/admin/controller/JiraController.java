package com.diamondvaluation.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.atlassian.jira.rest.client.api.domain.Issue;
import com.diamondvaluation.admin.JiraService;
@RestController
@RequestMapping("/api/jira")
public class JiraController {

    @Autowired
    private JiraService service;

    @GetMapping("/get")
    public ResponseEntity<?> getIssue() {
        try {
        	String issueKey = service.createIssue("N5NJS1806", 10002L, "Pass");
            return ResponseEntity.ok(issueKey);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving issue: " + e.getMessage());
        }
    }
}
