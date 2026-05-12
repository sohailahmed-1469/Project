package restaurant_management.user.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import restaurant_management.user.dto.AuthResponse;
import restaurant_management.user.dto.LoginRequest;
import restaurant_management.user.dto.RegisterRequest;
import restaurant_management.user.entity.User;
import restaurant_management.user.securityConfig.JwtUtil;
import restaurant_management.user.service.serviceImpl.AuthServiceImpl;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AuthServiceImpl authService;
    private final UserDetailsService userDetailsService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, AuthServiceImpl authService, UserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.authService = authService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        authService.registerUser(request.getEmail(), request.getPassword(), String.valueOf(request.getRole().getName()), request.getUserName());
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String accessToken = jwtUtil.generateToken(userDetails.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(userDetails.getUsername());
        User user = (User) userDetails;
        return new AuthResponse(accessToken, refreshToken, user.getEmail(), user.getRoleName());
    }

    @PostMapping("/refresh-token")
    public AuthResponse refreshToken(@RequestBody String refreshToken) {
        if (jwtUtil.validateToken(refreshToken)) {
            String username = jwtUtil.extractUsername(refreshToken);
            String newAccessToken = jwtUtil.generateToken(username);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            User user = (User) userDetails;
            return new AuthResponse(newAccessToken, refreshToken, user.getEmail(),user.getRoleName());
        } else {
            throw new RuntimeException("Invalid Refresh Token. Please login again.");
        }
    }

}
