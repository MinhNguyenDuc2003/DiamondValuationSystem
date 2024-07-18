package com.diamondvaluation.shop;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    private final List<WebSocketSession> sessions = new ArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        if (session != null) {
            sessions.add(session);
            System.out.println("New WebSocket connection established. Current sessions: " + sessions.size());
        } else {
            System.out.println("Received a null WebSocket session.");
        }
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        if (session != null) {
            sessions.remove(session);
            System.out.println("WebSocket connection closed. Session ID: " + session.getId());
            System.out.println("Current number of sessions: " + sessions.size());
        } else {
            System.out.println("Attempted to close a null WebSocket session.");
        }
    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        if (session != null && message != null) {
            System.out.println("Received message: " + message.getPayload());
        } else {
            System.out.println("Received null session or message.");
        }
    }

    public void sendMessageToAll(String message) {
        System.out.println("Sending message to all sessions: " + message);

        if (sessions == null) {
            System.out.println("Sessions list is null!");
            return;
        }

        if (sessions.isEmpty()) {
            System.out.println("No sessions to send message to.");
            return;
        }

        for (WebSocketSession session : sessions) {
            if (session != null && session.isOpen()) {
                try {
                    System.out.println("Sending message to session ID: " + session.getId());
                    session.sendMessage(new TextMessage(message));
                    System.out.println("Message sent to session ID: " + session.getId());
                } catch (IOException e) {
                    System.out.println("Failed to send message to session ID: " + session.getId());
                    e.printStackTrace();
                }
            } else {
                System.out.println("Session is null or closed.");
            }
        }
    }
}
