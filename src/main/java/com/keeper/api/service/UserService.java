package com.keeper.api.service;

import com.keeper.api.dto.UserDto;
import com.keeper.api.entity.User;
import com.keeper.api.exception.UserAlreadyExistsException;
import com.keeper.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    public User createUser(UserDto userDto){
        if(userRepository.existsByUsername(userDto.getUsername())){
            throw new UserAlreadyExistsException();
        }
        User user = User.builder()
                .username(userDto.getUsername())
                .password(userDto.getPassword())
                .notes(new ArrayList<>())
                .build();
        return userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = getUserByUsername(username);
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .build();
    }

    public User getUserByUsername(String username) throws UsernameNotFoundException{
        User user = userRepository.findByUsername(username);
        if(user == null){
            throw new UsernameNotFoundException("Username not found");
        }
        return user;
    }
}
