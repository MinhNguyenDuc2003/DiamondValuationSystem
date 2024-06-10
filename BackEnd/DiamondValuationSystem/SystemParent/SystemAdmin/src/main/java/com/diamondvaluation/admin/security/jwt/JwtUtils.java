package com.diamondvaluation.admin.security.jwt;

import java.util.Date;
import java.util.function.Function;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.diamondvaluation.admin.exception.JwtValidationException;
import com.diamondvaluation.common.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
@Component
public class JwtUtils {
	private static final String SECRET_KEY_ALGORITHM = "HmacSHA512";

	@Value("${app.security.jwt.issuer}")
	private String issuerName;

	@Value("${app.security.jwt.secret}")
	private String secretKey;

	@Value("${app.security.jwt.access-token.expiration}")
	private int accessTokenExpiration;

	public String generateAccessToken(User user) {
		if (user == null || user.getId() == null || user.getEmail() == null || user.getRoles() == null) {
			throw new IllegalArgumentException("user object is null or its fields have null values");
		}

		long expirationTimeInMillis = System.currentTimeMillis() + accessTokenExpiration * 60000;
		String subject = String.format("%s,%s", user.getId(), user.getFullname());

		return Jwts.builder().subject(subject).issuer(issuerName).issuedAt(new Date())
				.expiration(new Date(expirationTimeInMillis)).claim("roles", user.getRolesName())
				.signWith(Keys.hmacShaKeyFor(secretKey.getBytes()), Jwts.SIG.HS512).compact();

	}

	public Claims validateAccessToken(String token) throws JwtValidationException {
		try {
			SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), SECRET_KEY_ALGORITHM);

			return Jwts.parser().verifyWith(keySpec).build().parseSignedClaims(token).getPayload();

		} catch (ExpiredJwtException ex) {
			throw new JwtValidationException("Access token expired", ex);
		} catch (IllegalArgumentException ex) {
			throw new JwtValidationException("Access token is illegal", ex);
		} catch (MalformedJwtException ex) {
			throw new JwtValidationException("Access token is not well formed", ex);
		} catch (UnsupportedJwtException ex) {
			throw new JwtValidationException("Access token is not supported", ex);
		}
	}

	public String getSubject(String token) throws JwtValidationException, ExpiredJwtException {
		return parseClaims(token).getSubject();
	}

	private Claims parseClaims(String token) throws JwtValidationException, ExpiredJwtException{
		SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), SECRET_KEY_ALGORITHM);
		return Jwts.parser().setSigningKey(keySpec).build().parseClaimsJws(token).getBody();
	}
	
	public boolean isExpiredToken(String token) {
		DecodedJWT jwt = JWT.decode(token);
		if( jwt.getExpiresAt().before(new Date())) {
		    return true;
		}
		return false;
	}

	public String getIssuerName() {
		return issuerName;
	}

	public void setIssuerName(String issuerName) {
		this.issuerName = issuerName;
	}

	public String getSecretKey() {
		return secretKey;
	}

	public void setSecretKey(String secretKey) {
		this.secretKey = secretKey;
	}

	public int getAccessTokenExpiration() {
		return accessTokenExpiration;
	}

	public void setAccessTokenExpiration(int accessTokenExpiration) {
		this.accessTokenExpiration = accessTokenExpiration;
	}

}
