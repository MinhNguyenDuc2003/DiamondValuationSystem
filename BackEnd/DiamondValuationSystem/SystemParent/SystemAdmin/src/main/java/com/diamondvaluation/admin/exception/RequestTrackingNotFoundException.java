package com.diamondvaluation.admin.exception;

import org.springframework.security.core.AuthenticationException;

public class RequestTrackingNotFoundException extends AuthenticationException {
    public RequestTrackingNotFoundException(String msg) {
		super(msg);
	}

}
