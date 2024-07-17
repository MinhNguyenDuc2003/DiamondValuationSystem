package com.diamondvaluation.shop;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AmazonS3Util {
	public static final String S3_BASE_URI;
	private static final Logger LOGGER = LoggerFactory.getLogger(AmazonS3Util.class);
	private static final String BUCKET_NAME;
	
	static {
		BUCKET_NAME = System.getenv("AWS_BUCKET_NAME");
		String region = System.getenv("AWS_REGION");
		String pattern = "https://%s.s3.%s.amazonaws.com";
		
		S3_BASE_URI = BUCKET_NAME == null ? "" : String.format(pattern, BUCKET_NAME, region);
	}
	
}
