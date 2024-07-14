package com.diamondvaluation.admin;

import java.net.URI;
import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.atlassian.jira.rest.client.api.JiraRestClient;
import com.atlassian.jira.rest.client.api.domain.BasicIssue;
import com.atlassian.jira.rest.client.api.domain.Comment;
import com.atlassian.jira.rest.client.api.domain.Issue;
import com.atlassian.jira.rest.client.api.domain.input.IssueInput;
import com.atlassian.jira.rest.client.api.domain.input.IssueInputBuilder;
import com.atlassian.jira.rest.client.internal.async.AsynchronousJiraRestClientFactory;

@Service
public class JiraService {

    private JiraRestClient jiraRestClient;

    @Autowired
    public JiraService() throws URISyntaxException {
        this.jiraRestClient = new AsynchronousJiraRestClientFactory()
                .createWithBasicHttpAuthentication(new URI("https://quannkase173514.atlassian.net"), "minhndse173515@fpt.edu.vn", "ATATT3xFfGF0Nd1vYe_tDnRSCzWUFs_vj8gP9wxg6FDwl9OjXP4Y6_mTTEJSC2HmDfbdb4Ww-yUP3A7R-nbZLkEjBdU36YBUJs-pEV0mQr1VBkE2kVEMAzVfGaW_3d3pUFtvpsRqZoXD4Y3v37pCKYLMI3gt-tAAoUZMqEQLADvoBYRkBi6b2Eg=086B06FC");
    }

    public String createIssue(String projectKey, Long issueTypeId, String summary) {
        try {
            IssueInputBuilder issueBuilder = new IssueInputBuilder(projectKey, issueTypeId, summary);
            IssueInput issueInput = issueBuilder.build();
            BasicIssue createdIssue = jiraRestClient.getIssueClient().createIssue(issueInput).claim();
            return createdIssue.getKey();
        } catch (Exception e) {
            System.err.println("Error creating issue: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create issue in JIRA", e);
        }
    }
    
    public void addComment(Issue issue, String commentBody) {
        try {
        	jiraRestClient.getIssueClient().addComment(issue.getCommentsUri(), Comment.valueOf(commentBody)).claim();
        } catch (Exception e) {
            System.err.println("Error adding comment: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public Issue getIssue(String issueKey) {
        return jiraRestClient.getIssueClient()
          .getIssue(issueKey) 
          .claim();
    }

    public static void main(String[] args) throws URISyntaxException {
        JiraService service = new JiraService();
        String issueKey = service.createIssue("N5NJS1806", 10004L, "Pass");
        System.out.println("Created issue key: " + issueKey);
    }
}