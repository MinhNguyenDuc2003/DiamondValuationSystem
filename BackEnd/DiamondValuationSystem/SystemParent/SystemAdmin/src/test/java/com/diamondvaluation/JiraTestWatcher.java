package com.diamondvaluation;

import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.atlassian.jira.rest.client.api.domain.Issue;
import com.diamondvaluation.admin.JiraService;

@Component
public class JiraTestWatcher implements BeforeEachCallback, AfterEachCallback {

	@Autowired
	private JiraService jiraService;
	
	private ExtensionContext currentContext;
//	@Override
//	protected void failed(Throwable e, Description description) {
//		String projectKey = "N5NJS1806";
//		Long issueType = 10004L;
//		service.createIssue(projectKey, issueType, "Test Login Successfully");
//	}
//
//	@Override
//	protected void succeeded(Description description) {
//		String projectKey = "N5NJS1806";
//		Long issueType = 10002L;
//		service.createIssue(projectKey, issueType, "Test Login Successfully");
//	}

	   @Override
	    public void afterEach(ExtensionContext context) throws Exception {
	        String projectKey = "N5NJS1806";
	        Long issueType = 10004L;
	        String summary = "Test Username not Found Successfully";
	        String comment;

	        if (context.getExecutionException().isPresent()) {
	            comment = "Test failed: " + context.getExecutionException().get().getMessage();
	        } else {
	            comment = "Test passed successfully.";
	        }

	        try {
	            // Create issue in Jira
	            String issueKey = jiraService.createIssue(projectKey, issueType, summary);
	            System.out.println("Created issue with key: " + issueKey);

	            // Add comment to the created issue
	            Issue issue = jiraService.getIssue(issueKey);
	            jiraService.addComment(issue, comment);
	            System.out.println("Added comment to issue: " + issueKey);
	        } catch (Exception e) {
	            System.err.println("Error processing Jira operations: " + e.getMessage());
	            e.printStackTrace();
	        }
	    }

	@Override
	public void beforeEach(ExtensionContext context) throws Exception {
		SpringExtension.getApplicationContext(context)
        .getAutowireCapableBeanFactory()
        .autowireBean(this);

	}
}