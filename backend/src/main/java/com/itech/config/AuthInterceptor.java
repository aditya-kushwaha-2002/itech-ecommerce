package com.itech.config;

import com.itech.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

  private final TokenService tokens;

  public AuthInterceptor(TokenService tokens) {
    this.tokens = tokens;
  }

  @Override
  public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler)
      throws Exception {

    String path = req.getRequestURI(), method = req.getMethod();

    if (method.equals("OPTIONS")
        || path.startsWith("/api/auth")
        || (method.equals("GET")
            && (path.startsWith("/api/products")
                || path.startsWith("/api/categories")
                || path.startsWith("/api/variants")))) 
      return true;

    String header = req.getHeader("Authorization");
    
    AuthUser user =
        header != null && header.startsWith("Bearer ") ? tokens.verify(header.substring(7)) : null;

    if (user == null) {
      res.sendError(401, "Please login to continue");
      return false;
    }

    boolean adminOnly =
        path.startsWith("/api/admin")
            || (path.equals("/api/orders") && method.equals("GET"))
            || ((path.startsWith("/api/products")
                    || path.startsWith("/api/categories")
                    || path.startsWith("/api/variants"))
                && !method.equals("GET"));

    if (adminOnly && !user.role().equals("ADMIN")) {

      res.sendError(403, "Admin access required");

      return false;
    }

    req.setAttribute("authUser", user);

    return true;
  }
}
