package com.financialledge.auth.service;

import com.financialledge.auth.dto.AuthRequest;
import com.financialledge.auth.dto.AuthResponse;
import com.financialledge.auth.dto.LoginRequest;
import com.financialledge.auth.entity.Role;
import com.financialledge.auth.entity.User;
import com.financialledge.auth.entity.UserRole;
import com.financialledge.auth.repository.RoleRepository;
import com.financialledge.auth.repository.UserRepository;
import com.financialledge.auth.repository.UserRoleRepository;
import com.financialledge.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        user = userRepository.save(user);

        // 기본 역할 할당 (USER 역할이 없으면 생성)
        Role userRole = roleRepository.findByName("USER")
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .name("USER")
                            .description("Default user role")
                            .build();
                    return roleRepository.save(newRole);
                });

        UserRole userRoleEntity = UserRole.builder()
                .userId(user.getId())
                .roleId(userRole.getId())
                .build();
        userRoleRepository.save(userRoleEntity);

        String token = jwtUtil.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsernameOrEmail());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.getUsernameOrEmail());
        }

        User user = userOpt.orElseThrow(() -> new RuntimeException("Invalid username/email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username/email or password");
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}
