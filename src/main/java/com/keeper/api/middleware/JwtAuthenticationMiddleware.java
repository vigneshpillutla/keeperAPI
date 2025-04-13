package com.keeper.api.middleware;

import com.keeper.api.entity.User;
import com.keeper.api.service.UserService;
import com.keeper.api.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationMiddleware extends OncePerRequestFilter {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromHeader(request);
        String username = jwtUtil.verifyToken(token);
        if(username!=null){
            UserDetails userDetails = userService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails.getUsername(),null,userDetails.getAuthorities());
            System.out.println(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        filterChain.doFilter(request,response);
    }

    private String getTokenFromHeader(HttpServletRequest request){
        String authorizationHeader = request.getHeader("Authorization");
        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){
            return authorizationHeader.substring(7);
        }
        return null;
    }
}
